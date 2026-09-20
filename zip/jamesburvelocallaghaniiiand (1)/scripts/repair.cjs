const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

function getFailingFiles() {
  const dirs = ['components', 'context', 'data', 'lib', 'hooks'];
  const fails = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      if (fs.statSync(fullPath).isFile() && /\.(tsx|ts)$/.test(entry)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const loader = fullPath.endsWith('.tsx') ? 'tsx' : 'ts';
        try {
          esbuild.transformSync(content, { loader });
        } catch (err) {
          fails.push({
            file: fullPath,
            line: err.errors[0]?.location?.line,
            column: err.errors[0]?.location?.column,
            text: err.errors[0]?.text
          });
        }
      }
    }
  }
  return fails;
}

const fails = getFailingFiles();
console.log('Failing files (' + fails.length + '):');
fails.forEach(f => {
  const content = fs.readFileSync(f.file, 'utf8');
  const lines = content.split('\n');
  const start = Math.max(0, (f.line || 1) - 6);
  const end = Math.min(lines.length, (f.line || 1) + 6);
  const context = lines.slice(start, end).map((l, i) => `${start + i + 1}: ${l}`).join('\n');
  console.log(`\n========================================\nFile: ${f.file} (Total lines: ${lines.length})`);
  console.log(`Error at line ${f.line}: ${f.text}`);
  console.log('Context:\n' + context);
});
