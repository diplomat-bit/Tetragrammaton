const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  try {
    for (const f of fs.readdirSync(dir)) {
      if (['node_modules', '.git', 'dist', 'build'].includes(f)) continue;
      const p = path.join(dir, f);
      try {
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
          res = res.concat(walk(p));
        } else if (/\.(ts|tsx|js|jsx|json|css|html|md|txt)$/.test(f)) {
          res.push(p);
        }
      } catch (e) {}
    }
  } catch (e) {}
  return res;
}

const files = walk('.');
let cleaned = 0;

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Remove markdown code fences like ```typescript, ```tsx, ```javascript, ```json, etc.
    // at the beginning of the file
    content = content.replace(/^\s*```(?:typescript|tsx|ts|javascript|jsx|js|json|css|html|bash|sh|sql)?\s*\r?\n/i, '');

    // at the end of the file
    content = content.replace(/\r?\n\s*```\s*$/i, '\n');

    // any standalone fence lines
    content = content.replace(/^\s*```(?:typescript|tsx|ts|javascript|jsx|js|json|css|html|bash|sh|sql)?\s*$/gmi, '');

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      cleaned++;
      console.log(`Cleaned: ${file}`);
    }
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
}

console.log(`Successfully cleaned ${cleaned} files.`);
