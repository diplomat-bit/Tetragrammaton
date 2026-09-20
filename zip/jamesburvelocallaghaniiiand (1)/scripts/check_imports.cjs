const fs = require('fs');
const path = require('path');

function checkImports() {
  const dirs = ['components', 'context', 'data', 'lib', 'hooks'];
  const missing = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      if (fs.statSync(fullPath).isFile() && /\.(tsx|ts)$/.test(entry)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const importRegex = /(?:import|export)\s+(?:[\w\s{},*]+from\s+)?['"](\.[^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          const importPath = match[1];
          const resolvedBase = path.resolve(path.dirname(fullPath), importPath);
          const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
          const exists = extensions.some(ext => fs.existsSync(resolvedBase + ext));
          if (!exists) {
            missing.push({ file: fullPath, importPath, resolvedBase });
          }
        }
      }
    }
  }
  return missing;
}

const missing = checkImports();
console.log(`Found ${missing.length} missing imports:`);
missing.forEach(m => console.log(`${m.file} -> ${m.importPath}`));
