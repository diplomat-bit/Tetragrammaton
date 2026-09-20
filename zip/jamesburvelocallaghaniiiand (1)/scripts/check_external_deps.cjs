const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const installedDeps = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
  'react', 'react-dom', 'react/jsx-runtime', 'path', 'fs', 'url', 'crypto', 'stream', 'http', 'https', 'zlib', 'os', 'util', 'events', 'assert'
]);

function checkExternalImports() {
  const dirs = ['components', 'context', 'data', 'lib', 'hooks'];
  const missingPkgs = new Set();
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      if (fs.statSync(fullPath).isFile() && /\.(tsx|ts)$/.test(entry)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const importRegex = /(?:import|export)\s+(?:[\w\s{},*]+from\s+)?['"]([^.][^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          let pkgName = match[1];
          // Handle scoped packages like @mui/material or deep imports
          if (pkgName.startsWith('@')) {
            const parts = pkgName.split('/');
            pkgName = parts[0] + '/' + parts[1];
          } else {
            pkgName = pkgName.split('/')[0];
          }
          if (!installedDeps.has(pkgName)) {
            missingPkgs.add(`${pkgName} (used in ${fullPath})`);
          }
        }
      }
    }
  }
  return Array.from(missingPkgs);
}

const missing = checkExternalImports();
console.log('Missing external packages:');
console.log(missing.join('\n'));
