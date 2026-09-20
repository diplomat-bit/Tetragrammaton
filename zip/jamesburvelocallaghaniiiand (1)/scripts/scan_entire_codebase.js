import fs from 'fs';
import path from 'path';
import { transformSync } from 'esbuild';

const allDirs = ['components', 'lib', 'hooks', 'pages', 'context', 'contexts', 'models', 'config', 'core'];
const errorFiles = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanDir(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      try {
        transformSync(content, {
          loader: entry.name.endsWith('.tsx') ? 'tsx' : (entry.name.endsWith('.ts') ? 'ts' : (entry.name.endsWith('.jsx') ? 'jsx' : 'js')),
          jsx: 'automatic'
        });
      } catch (err) {
        errorFiles.push({ path: fullPath, err: err.message.split('\n')[0] });
      }
    }
  }
}

for (const d of allDirs) {
  scanDir(d);
}

console.log(`Found ${errorFiles.length} files with syntax errors:`);
errorFiles.forEach(e => {
  console.log(`${e.path} -> ${e.err}`);
});
