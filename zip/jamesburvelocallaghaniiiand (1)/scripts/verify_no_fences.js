import fs from 'fs';
import path from 'path';

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
        } else if (/\.(ts|tsx|js|jsx|json|css|html)$/.test(f)) {
          res.push(p);
        }
      } catch (e) {}
    }
  } catch (e) {}
  return res;
}

const files = walk('.');
let found = [];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (/^\s*```/.test(line)) {
        found.push({ file, line: idx + 1, text: line.trim() });
      }
    });
  } catch (e) {}
}

console.log(`Found ${found.length} remaining backtick fence lines:`);
found.forEach(f => console.log(`${f.file}:${f.line} -> ${f.text}`));
