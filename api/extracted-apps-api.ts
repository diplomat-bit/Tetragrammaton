import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { execSync } from 'child_process';

export const extractedAppsRouter = express.Router();

const ZIP_DIR = path.resolve(process.cwd(), 'zip');
const PACKAGES_DIR = path.resolve(process.cwd(), 'packages');

if (!fs.existsSync(ZIP_DIR)) {
  fs.mkdirSync(ZIP_DIR, { recursive: true });
}
if (!fs.existsSync(PACKAGES_DIR)) {
  fs.mkdirSync(PACKAGES_DIR, { recursive: true });
}

function flattenSingleSubdir(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath);
    if (entries.length === 1) {
      const single = path.join(dirPath, entries[0]);
      if (fs.statSync(single).isDirectory()) {
        const subFiles = fs.readdirSync(single);
        for (const f of subFiles) {
          const src = path.join(single, f);
          const dest = path.join(dirPath, f);
          if (fs.existsSync(dest)) {
            // Remove destination if it conflicts
            try {
              if (fs.statSync(dest).isDirectory()) fs.rmSync(dest, { recursive: true, force: true });
              else fs.unlinkSync(dest);
            } catch (e) {}
          }
          fs.renameSync(src, dest);
        }
        try {
          fs.rmdirSync(single);
        } catch (e) {}
      }
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Auto-detect and unpack any zip files in root or /zip that haven't been extracted yet
 */
export function autoSyncZipArchives(): { newlyExtracted: string[]; totalArchives: number } {
  try {
    if (!fs.existsSync(ZIP_DIR)) fs.mkdirSync(ZIP_DIR, { recursive: true });
    if (!fs.existsSync(PACKAGES_DIR)) fs.mkdirSync(PACKAGES_DIR, { recursive: true });

    // 1. Move/copy any .zip files from project root to /zip
    const rootItems = fs.readdirSync(process.cwd());
    rootItems.forEach((item) => {
      if (item.endsWith('.zip')) {
        const src = path.join(process.cwd(), item);
        const dest = path.join(ZIP_DIR, item);
        if (!fs.existsSync(dest)) {
          try {
            fs.copyFileSync(src, dest);
          } catch (e) {}
        }
      }
    });

    // 2. Scan all zip archives in /zip
    const zipFiles = fs.readdirSync(ZIP_DIR).filter((f) => f.endsWith('.zip'));
    const newlyExtracted: string[] = [];

    for (const z of zipFiles) {
      const baseName = path.basename(z, '.zip');
      const zipPath = path.join(ZIP_DIR, z);
      const zipExtractDir = path.join(ZIP_DIR, baseName);
      const pkgExtractDir = path.join(PACKAGES_DIR, baseName);

      const needsZip = !fs.existsSync(zipExtractDir) || fs.readdirSync(zipExtractDir).length === 0;
      const needsPkg = !fs.existsSync(pkgExtractDir) || fs.readdirSync(pkgExtractDir).length === 0;

      if (needsZip || needsPkg) {
        try {
          if (needsZip) {
            fs.mkdirSync(zipExtractDir, { recursive: true });
            execSync(`unzip -o -q "${zipPath}" -d "${zipExtractDir}"`);
            flattenSingleSubdir(zipExtractDir);
          }
          if (needsPkg) {
            fs.mkdirSync(pkgExtractDir, { recursive: true });
            execSync(`unzip -o -q "${zipPath}" -d "${pkgExtractDir}"`);
            flattenSingleSubdir(pkgExtractDir);
          }
          newlyExtracted.push(baseName);
        } catch (err: any) {
          console.error(`Error auto-extracting ${z}:`, err.message);
        }
      }
    }

    return { newlyExtracted, totalArchives: zipFiles.length };
  } catch (err) {
    console.error('Error during autoSyncZipArchives:', err);
    return { newlyExtracted: [], totalArchives: 0 };
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, ZIP_DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

function getNestedAppDir(basePath: string): string {
  try {
    if (!fs.existsSync(basePath)) return basePath;
    const items = fs.readdirSync(basePath);
    if (items.length === 1) {
      const subPath = path.join(basePath, items[0]);
      if (fs.statSync(subPath).isDirectory()) {
        if (fs.existsSync(path.join(subPath, 'package.json')) || fs.existsSync(path.join(subPath, 'src')) || fs.existsSync(path.join(subPath, 'index.html'))) {
          return subPath;
        }
      }
    }
  } catch (e) {
    // fallback
  }
  return basePath;
}

function walkDir(dir: string, baseDir: string = dir, fileList: string[] = []): string[] {
  try {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.DS_Store' || file === '__MACOSX') {
        return;
      }
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath, baseDir, fileList);
      } else {
        const relPath = path.relative(baseDir, filePath);
        fileList.push(relPath);
      }
    });
  } catch (e) {
    // ignore
  }
  return fileList;
}

// Initial sync on startup
autoSyncZipArchives();

// Scan and auto-extract any pending zips
extractedAppsRouter.post('/apps/scan', (req: Request, res: Response) => {
  try {
    const result = autoSyncZipArchives();
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload zip files and extract automatically
extractedAppsRouter.post('/apps/upload', upload.array('zips') as any, (req: Request, res: Response) => {
  try {
    const files = (req as any).files as any[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: 'No zip files uploaded' });
    }

    const results = [];
    for (const file of files) {
      const zipPath = file.path;
      const baseName = path.basename(file.originalname, '.zip');
      const zipExtractDir = path.join(ZIP_DIR, baseName);
      const pkgExtractDir = path.join(PACKAGES_DIR, baseName);

      try {
        fs.mkdirSync(zipExtractDir, { recursive: true });
        execSync(`unzip -o -q "${zipPath}" -d "${zipExtractDir}"`);
        flattenSingleSubdir(zipExtractDir);

        fs.mkdirSync(pkgExtractDir, { recursive: true });
        execSync(`unzip -o -q "${zipPath}" -d "${pkgExtractDir}"`);
        flattenSingleSubdir(pkgExtractDir);

        results.push({ filename: file.originalname, status: 'extracted', folder: baseName });
      } catch (err: any) {
        results.push({ filename: file.originalname, status: 'error', error: err.message });
      }
    }

    res.json({ success: true, results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET list of all extracted apps
extractedAppsRouter.get('/apps', (req: Request, res: Response) => {
  try {
    // Always trigger an auto-sync check before listing so new uploads are instant
    autoSyncZipArchives();

    const seenFolders = new Set<string>();
    const apps: any[] = [];

    const searchDirs = [PACKAGES_DIR, ZIP_DIR];

    for (const searchDir of searchDirs) {
      if (!fs.existsSync(searchDir)) continue;

      const entries = fs.readdirSync(searchDir);

      entries.forEach((entry) => {
        if (entry.endsWith('.zip') || entry === '.git' || entry === 'node_modules') return;
        if (seenFolders.has(entry)) return;

        const fullPath = path.join(searchDir, entry);
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
          seenFolders.add(entry);
          const appDir = getNestedAppDir(fullPath);
          let pkgName = entry;
          let pkgDescription = 'Extracted Package & Repository';
          let pkgVersion = '1.0.0';
          let dependencies = {};
          let scripts = {};

          const pkgPath = path.join(appDir, 'package.json');
          if (fs.existsSync(pkgPath)) {
            try {
              const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
              pkgName = pkgData.name || entry;
              pkgDescription = pkgData.description || pkgDescription;
              pkgVersion = pkgData.version || pkgVersion;
              dependencies = pkgData.dependencies || {};
              scripts = pkgData.scripts || {};
            } catch (e) {}
          }

          const metaPath = path.join(appDir, 'metadata.json');
          if (fs.existsSync(metaPath)) {
            try {
              const metaData = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
              if (metaData.name) pkgName = metaData.name;
              if (metaData.description) pkgDescription = metaData.description;
            } catch (e) {}
          }

          const files = walkDir(appDir, appDir);
          const hasIndexHtml = fs.existsSync(path.join(appDir, 'index.html'));
          const hasAppTsx = fs.existsSync(path.join(appDir, 'src', 'App.tsx')) || fs.existsSync(path.join(appDir, 'App.tsx'));
          const hasServer = fs.existsSync(path.join(appDir, 'server.ts')) || files.some((f) => f.includes('server') || f.includes('api'));

          // Determine category & tags
          let category = 'Utility & Tools';
          const lower = entry.toLowerCase();
          if (lower.includes('jamesburvelo') || lower.includes('ocallaghan') || lower.includes('aether') || lower.includes('consortium')) {
            category = 'Sovereign Banking Mesh';
          } else if (lower.includes('citi') || lower.includes('chase') || lower.includes('bank') || lower.includes('card') || lower.includes('fdx') || lower.includes('jwt')) {
            category = 'Banking & Cards';
          } else if (lower.includes('wallet') || lower.includes('hf') || lower.includes('eth') || lower.includes('crypto')) {
            category = 'Web3 & Crypto';
          } else if (lower.includes('workflow') || lower.includes('expandai') || lower.includes('infinite') || lower.includes('remix')) {
            category = 'Autonomous AI';
          } else if (lower.includes('portfolio') || lower.includes('explorer')) {
            category = 'Developer & AI';
          } else if (lower.includes('gateway') || lower.includes('sdk') || lower.includes('protocol') || lower.includes('ontology')) {
            category = 'Protocol & SDK';
          }

          apps.push({
            id: entry,
            folderName: entry,
            name: pkgName,
            description: pkgDescription,
            version: pkgVersion,
            category,
            dependenciesCount: Object.keys(dependencies).length,
            filesCount: files.length,
            files: files.slice(0, 200),
            hasReadme: files.some((f) => f.toLowerCase().includes('readme')),
            hasServer,
            hasIndexHtml,
            hasAppTsx,
            previewUrl: `/api/apps/preview/${encodeURIComponent(entry)}`,
          });
        }
      });
    }

    res.json({ success: true, count: apps.length, apps });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function resolveAppFolder(folder: string): string | null {
  const candidate1 = path.join(PACKAGES_DIR, folder);
  if (fs.existsSync(candidate1)) return getNestedAppDir(candidate1);
  const candidate2 = path.join(ZIP_DIR, folder);
  if (fs.existsSync(candidate2)) return getNestedAppDir(candidate2);
  return null;
}

// GET file content of an extracted app
extractedAppsRouter.get('/app-file', (req: Request, res: Response) => {
  try {
    const { appFolder, filePath } = req.query;
    if (!appFolder || !filePath) {
      return res.status(400).json({ success: false, error: 'Missing appFolder or filePath' });
    }

    const appDir = resolveAppFolder(String(appFolder));
    if (!appDir || !fs.existsSync(appDir)) {
      return res.status(404).json({ success: false, error: `App directory not found: ${appFolder}` });
    }

    const targetFile = path.resolve(appDir, String(filePath));

    if (!targetFile.startsWith(path.resolve(appDir))) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    if (!fs.existsSync(targetFile) || !fs.statSync(targetFile).isFile()) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    const content = fs.readFileSync(targetFile, 'utf8');
    res.json({ success: true, filePath, content });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve raw static assets of an app
extractedAppsRouter.use('/apps/raw/:appFolder', (req: Request, res: Response, next) => {
  const { appFolder } = req.params;
  const appDir = resolveAppFolder(appFolder);
  if (!appDir || !fs.existsSync(appDir)) {
    return res.status(404).send('App directory not found');
  }
  express.static(appDir)(req, res, next);
});

// Live Preview route for any extracted application
extractedAppsRouter.get('/apps/preview/:appFolder', (req: Request, res: Response) => {
  try {
    const { appFolder } = req.params;
    const appDir = resolveAppFolder(appFolder);

    if (!appDir || !fs.existsSync(appDir)) {
      return res.status(404).send('App not found');
    }

    const indexHtmlPath = path.join(appDir, 'index.html');
    let pkgData: any = {};
    const pkgPath = path.join(appDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      } catch (e) {}
    }

    if (fs.existsSync(indexHtmlPath)) {
      let html = fs.readFileSync(indexHtmlPath, 'utf8');
      // If there is no base tag, inject one so relative CSS/JS paths resolve properly through raw route
      if (!html.includes('<base ')) {
        html = html.replace('<head>', `<head><base href="/api/apps/raw/${encodeURIComponent(appFolder)}/">`);
      }
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }

    // Fallback UI for repositories without standalone index.html
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${pkgData.name || appFolder} - Zero-Config Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0D1117] text-[#C9D1D9] p-8 font-sans antialiased">
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] shadow-xl">
      <div class="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold mb-3">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>AUTO-EXTRACTED ZERO-CONFIG REPOSITORY</span>
      </div>
      <h1 class="text-2xl font-bold text-white mb-2">${pkgData.name || appFolder}</h1>
      <p class="text-sm text-[#8B949E] mb-4">${pkgData.description || 'Application archive extracted and mounted natively.'}</p>
      <div class="flex flex-wrap gap-2 text-xs font-mono">
        <span class="px-2.5 py-1 rounded bg-[#21262d] text-white border border-[#30363D]">Version: ${pkgData.version || '1.0.0'}</span>
        <span class="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Direct ZIP Execution</span>
        <span class="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Folder: ${appFolder}</span>
      </div>
    </div>
  </div>
</body>
</html>`);
  } catch (err: any) {
    res.status(500).send(`Failed to render app: ${err.message}`);
  }
});

