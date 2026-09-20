import express from 'express';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const execPromise = util.promisify(exec);
export const githubDeployRouter = express.Router();

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Sanitizer to guarantee PAT is never logged or exposed in responses
function sanitizeLogs(text: string, pat?: string): string {
  if (!text) return '';
  let sanitized = text;
  if (pat && pat.trim().length > 0) {
    const escaped = pat.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    sanitized = sanitized.replace(new RegExp(escaped, 'g'), 'ghp_***REDACTED***');
  }
  // Also redact any https://token@github.com or https://user:token@github.com patterns
  sanitized = sanitized.replace(/https:\/\/[^@\s]+@github\.com/gi, 'https://***@github.com');
  return sanitized;
}

// Helper to run safe git command
async function runGit(cmd: string, pat?: string): Promise<{ stdout: string; stderr: string; success: boolean }> {
  try {
    const { stdout, stderr } = await execPromise(cmd, { cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 });
    return {
      stdout: sanitizeLogs(stdout, pat),
      stderr: sanitizeLogs(stderr, pat),
      success: true,
    };
  } catch (err: any) {
    return {
      stdout: sanitizeLogs(err.stdout || '', pat),
      stderr: sanitizeLogs(err.stderr || err.message || 'Git execution error', pat),
      success: false,
    };
  }
}

// GET /api/github/config - non-sensitive config & environment status
githubDeployRouter.get('/config', async (req, res) => {
  try {
    const envPat = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN || '';
    const hasEnvPat = envPat.trim().length > 0;
    const defaultRepo = process.env.GITHUB_REPO_URL || 'https://github.com/jocall3/Rexmundi.git';
    const defaultBranch = process.env.GITHUB_DEFAULT_BRANCH || 'Master';

    // Check git version & git status
    const gitVer = await runGit('git --version');
    const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));

    let currentBranch = '';
    let statusSummary = '';
    let remoteOrigin = '';
    let recentCommits: string[] = [];

    if (isGitRepo) {
      const branchRes = await runGit('git branch --show-current');
      currentBranch = branchRes.stdout.trim() || 'HEAD (detached)';

      const statusRes = await runGit('git status --short');
      statusSummary = statusRes.stdout.trim();

      const remoteRes = await runGit('git remote get-url origin');
      remoteOrigin = sanitizeLogs(remoteRes.stdout.trim());

      const logRes = await runGit('git log -n 5 --oneline');
      if (logRes.success && logRes.stdout.trim()) {
        recentCommits = logRes.stdout.trim().split('\n');
      }
    }

    res.json({
      hasEnvPat,
      defaultRepo,
      defaultBranch,
      isGitRepo,
      gitVersion: gitVer.stdout.trim(),
      currentBranch,
      statusSummary,
      remoteOrigin,
      recentCommits,
      workspaceRoot: process.cwd(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/github/verify-pat - verify token with GitHub REST API
githubDeployRouter.post('/verify-pat', async (req, res) => {
  try {
    const pat = (req.body.pat || process.env.GITHUB_PAT || process.env.GITHUB_TOKEN || '').trim();
    const repoUrl = (req.body.repoUrl || 'https://github.com/jocall3/Rexmundi.git').trim();

    if (!pat) {
      return res.status(400).json({ valid: false, error: 'No Personal Access Token provided.' });
    }

    // Call GitHub User API
    const userResp = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Rexmundi-Sovereign-Deployer/1.0',
      },
    });

    if (!userResp.ok) {
      const errText = await userResp.text();
      return res.status(userResp.status).json({
        valid: false,
        status: userResp.status,
        error: `GitHub Authentication Failed (${userResp.status}): ${errText}`,
      });
    }

    const userData = await userResp.json();
    const scopes = userResp.headers.get('x-oauth-scopes') || 'fine-grained-or-none';

    // Parse target owner & repo from repoUrl
    let repoCheck = { accessible: false, exists: false, details: null as any };
    const repoMatch = repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)/i);
    if (repoMatch) {
      const owner = repoMatch[1];
      const repo = repoMatch[2];
      try {
        const repoResp = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Authorization: `Bearer ${pat}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'Rexmundi-Sovereign-Deployer/1.0',
          },
        });
        if (repoResp.ok) {
          const repoData = await repoResp.json();
          repoCheck = {
            accessible: true,
            exists: true,
            details: {
              name: repoData.full_name,
              private: repoData.private,
              default_branch: repoData.default_branch,
              permissions: repoData.permissions,
            },
          };
        } else if (repoResp.status === 404) {
          repoCheck = { accessible: true, exists: false, details: 'Repository does not exist yet or token lacks access' };
        }
      } catch {
        // network or CORS issue, non-blocking
      }
    }

    res.json({
      valid: true,
      user: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        scopes,
      },
      repoCheck,
    });
  } catch (error: any) {
    res.status(500).json({ valid: false, error: error.message });
  }
});

// POST /api/github/push - Executes the full commit & push workflow
githubDeployRouter.post('/push', async (req, res) => {
  const steps: Array<{ step: string; command: string; output: string; success: boolean }> = [];
  const pat = (req.body.pat || process.env.GITHUB_PAT || process.env.GITHUB_TOKEN || '').trim();
  const rawRepoUrl = (req.body.repoUrl || 'https://github.com/jocall3/Rexmundi.git').trim();
  const branch = (req.body.branch || 'Master').trim();
  const commitMessage = (req.body.commitMessage || 'first commit').trim();
  const pushEntireRepo = req.body.pushEntireRepo !== false; // default true
  const appendReadme = req.body.appendReadme === true;
  const forcePush = req.body.forcePush === true;
  const authorName = (req.body.authorName || 'jocall3').trim();
  const authorEmail = (req.body.authorEmail || 'sovereignties3@gmail.com').trim();

  if (!pat) {
    return res.status(400).json({
      success: false,
      error: 'GitHub Personal Access Token (PAT) is required to push to GitHub.',
      steps,
    });
  }

  // Build authenticated URL safely
  // standard: https://github.com/jocall3/Rexmundi.git -> https://<PAT>@github.com/jocall3/Rexmundi.git
  const cleanRepoUrl = rawRepoUrl.replace(/^https?:\/\/[^@]*@/, 'https://');
  const authRepoUrl = cleanRepoUrl.replace('https://', `https://${encodeURIComponent(pat)}@`);

  try {
    // Step 1: Append to README.md if requested
    if (appendReadme) {
      const readmePath = path.join(process.cwd(), 'README.md');
      const headerToAdd = '\n# Rexmundi\n';
      try {
        if (!fs.existsSync(readmePath)) {
          fs.writeFileSync(readmePath, '# Rexmundi\n', 'utf8');
        } else {
          const currentContent = fs.readFileSync(readmePath, 'utf8');
          if (!currentContent.includes('# Rexmundi')) {
            fs.appendFileSync(readmePath, headerToAdd, 'utf8');
          }
        }
        steps.push({
          step: '1. Update README.md',
          command: 'echo "# Rexmundi" >> README.md',
          output: 'Appended # Rexmundi header to README.md',
          success: true,
        });
      } catch (e: any) {
        steps.push({
          step: '1. Update README.md',
          command: 'echo "# Rexmundi" >> README.md',
          output: `Warning: Failed to update README.md: ${e.message}`,
          success: false,
        });
      }
    }

    // Step 2: Initialize Git if not initialized
    const isGit = fs.existsSync(path.join(process.cwd(), '.git'));
    if (!isGit) {
      const initRes = await runGit('git init', pat);
      steps.push({
        step: '2. Git Init',
        command: 'git init',
        output: initRes.stdout || initRes.stderr,
        success: initRes.success,
      });
    } else {
      steps.push({
        step: '2. Git Init',
        command: 'git init (already initialized)',
        output: 'Repository already initialized with .git',
        success: true,
      });
    }

    // Step 3: Configure Git User & Email for commit
    await runGit(`git config user.name "${authorName}"`, pat);
    await runGit(`git config user.email "${authorEmail}"`, pat);
    steps.push({
      step: '3. Configure Author Identity',
      command: `git config user.name "${authorName}" && git config user.email "${authorEmail}"`,
      output: `Configured commit author as ${authorName} <${authorEmail}>`,
      success: true,
    });

    // Step 4: Ensure .gitignore protects node_modules and .env
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, 'node_modules/\ndist/\nbuild/\n.cache/\n.env*\n!.env.example\n', 'utf8');
    }

    // Step 5: Git Add
    const addCmd = pushEntireRepo ? 'git add -A' : 'git add README.md';
    const addRes = await runGit(addCmd, pat);
    steps.push({
      step: '4. Stage Files',
      command: addCmd,
      output: addRes.stdout || addRes.stderr || (pushEntireRepo ? 'Staged entire repository' : 'Staged README.md'),
      success: addRes.success,
    });

    // Step 6: Git Commit
    // Check if there is anything to commit
    const statusBeforeCommit = await runGit('git status --porcelain', pat);
    let commitSha = '';
    if (statusBeforeCommit.stdout.trim().length > 0) {
      const commitRes = await runGit(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, pat);
      steps.push({
        step: '5. Git Commit',
        command: `git commit -m "${commitMessage}"`,
        output: commitRes.stdout || commitRes.stderr,
        success: commitRes.success,
      });
      const shaRes = await runGit('git rev-parse HEAD', pat);
      commitSha = shaRes.stdout.trim();
    } else {
      steps.push({
        step: '5. Git Commit',
        command: `git commit -m "${commitMessage}"`,
        output: 'Working tree clean, no new uncommitted changes staged.',
        success: true,
      });
      const shaRes = await runGit('git rev-parse HEAD', pat);
      commitSha = shaRes.stdout.trim();
    }

    // Step 7: Git Branch -M <branch>
    const branchRes = await runGit(`git branch -M ${branch}`, pat);
    steps.push({
      step: `6. Set Branch ${branch}`,
      command: `git branch -M ${branch}`,
      output: branchRes.stdout || branchRes.stderr || `Branch set to ${branch}`,
      success: branchRes.success,
    });

    // Step 8: Git Remote Configuration
    // Check if origin exists
    const checkRemote = await runGit('git remote', pat);
    if (checkRemote.stdout.includes('origin')) {
      await runGit('git remote remove origin', pat);
    }
    const remoteAddRes = await runGit(`git remote add origin ${authRepoUrl}`, pat);
    steps.push({
      step: '7. Configure Remote Origin',
      command: `git remote add origin ${cleanRepoUrl}`,
      output: `Origin configured with authenticated token for ${cleanRepoUrl}`,
      success: remoteAddRes.success,
    });

    // Step 9: Git Push
    const pushCmd = forcePush
      ? `git push -u origin ${branch} --force`
      : `git push -u origin ${branch}`;
    const pushRes = await runGit(pushCmd, pat);

    steps.push({
      step: `8. Git Push to ${branch}`,
      command: pushCmd.replace(pat, '***'),
      output: pushRes.stdout || pushRes.stderr,
      success: pushRes.success,
    });

    // Cleanup: Reset origin remote to clean URL (without PAT) so token is never saved on disk
    await runGit(`git remote set-url origin ${cleanRepoUrl}`, pat);

    if (!pushRes.success) {
      // Check if rejection was due to non-fast-forward
      const isRejected = pushRes.stderr.includes('rejected') || pushRes.stderr.includes('fetch first');
      return res.status(400).json({
        success: false,
        isRejected,
        error: `Push to GitHub failed: ${pushRes.stderr}`,
        steps,
        advice: isRejected
          ? 'The remote repository already contains commits. You can toggle "Force Push (--force)" to overwrite or rebase.'
          : 'Check token permissions (must have "repo" or "Contents: read/write" scope).',
      });
    }

    res.json({
      success: true,
      commitSha,
      branch,
      repoUrl: cleanRepoUrl,
      steps,
      summary: `Successfully committed and pushed ${pushEntireRepo ? 'the entire repository' : 'README.md'} to ${cleanRepoUrl} on branch ${branch}!`,
    });
  } catch (error: any) {
    // Ensure remote is sanitized even on crash
    try {
      await runGit(`git remote set-url origin ${cleanRepoUrl}`, pat);
    } catch {}
    res.status(500).json({
      success: false,
      error: sanitizeLogs(error.message, pat),
      steps,
    });
  }
});

// POST /api/github/ai-chat - Conversational Git assistant & execution engine
githubDeployRouter.post('/ai-chat', async (req, res) => {
  try {
    const message = (req.body.message || '').trim();
    const pat = (req.body.pat || process.env.GITHUB_PAT || process.env.GITHUB_TOKEN || '').trim();
    const repoUrl = (req.body.repoUrl || 'https://github.com/jocall3/Rexmundi.git').trim();
    const branch = (req.body.branch || 'Master').trim();
    const history = req.body.history || [];

    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // Inspect git status for context
    const gitStatusRes = await runGit('git status --short', pat);
    const branchRes = await runGit('git branch --show-current', pat);
    const currentBranch = branchRes.stdout.trim() || 'Master';
    const changedFiles = gitStatusRes.stdout.trim();

    // Check if user explicitly asks to push / commit
    const isPushIntent = /push|commit and push|deploy to github|ship to github/i.test(message);
    const isStatusIntent = /status|changes|diff|modified/i.test(message);
    const isReadmeIntent = /echo|readme|append/i.test(message);

    const ai = getAiClient();
    let aiResponse = '';
    let suggestedAction: any = null;

    if (ai) {
      const systemPrompt = `You are Rexmundi Git AI Copilot, a high-velocity sovereign systems release engineer.
You are helping the user manage git, commit, and push their codebase to GitHub (Repository: ${repoUrl}, Target Branch: ${branch}).
Current Git Status:
- Current Branch: ${currentBranch}
- Uncommitted Changes: ${changedFiles ? changedFiles : 'None (clean)'}
- GitHub PAT configured: ${pat ? 'Yes (configured)' : 'No (needs PAT)'}

Tone: Sharp, professional, authoritative, helpful.
When the user asks you to push or commit, confirm the command sequence:
1. echo "# Rexmundi" >> README.md
2. git init
3. git add -A (or git add README.md)
4. git commit -m "commit message"
5. git branch -M ${branch}
6. git remote add origin ${repoUrl}
7. git push -u origin ${branch}

Provide direct, actionable advice or confirmation. If they asked to push, explain that they can click the "Execute Push Now" button or confirm the parameters.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Message: ${message}` }] },
          ],
        });
        aiResponse = response.text || '';
      } catch {
        // Fallback to rule-based engine below
      }
    }

    if (!aiResponse) {
      if (isPushIntent) {
        aiResponse = `I am prepared to commit and push to **${repoUrl}** on branch **${branch}**.\n\nExecuting this will run:\n\`\`\`bash\necho "# Rexmundi" >> README.md\ngit init\ngit add -A\ngit commit -m "Sovereign Rexmundi Deployment"\ngit branch -M ${branch}\ngit remote add origin ${repoUrl}\ngit push -u origin ${branch}\n\`\`\`\nClick **"Push Entire Repo to GitHub"** below to execute immediately with your PAT.`;
        suggestedAction = {
          type: 'push',
          branch,
          repoUrl,
          pushEntireRepo: true,
          appendReadme: isReadmeIntent,
        };
      } else if (isStatusIntent) {
        aiResponse = `**Current Repository State:**\n- Branch: \`${currentBranch}\`\n- Remote: \`${repoUrl}\`\n- Uncommitted Files:\n\`\`\`\n${changedFiles || 'Working tree clean, no modified files.'}\n\`\`\``;
        suggestedAction = { type: 'status' };
      } else {
        aiResponse = `I am your **Rexmundi Sovereign Git Copilot**. I can execute autonomous commits, initialize git repositories, stage the entire codebase, and push directly to **${repoUrl}** (branch: \`${branch}\`) using your GitHub Personal Access Token.\n\nWhat would you like me to do? You can ask me to "Push entire repo", "Check git status", or "Append # Rexmundi to README.md and push".`;
      }
    }

    res.json({
      response: aiResponse,
      suggestedAction,
      context: {
        currentBranch,
        changedFilesCount: changedFiles ? changedFiles.split('\n').length : 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
