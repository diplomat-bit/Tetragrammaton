import fs from 'fs';
import path from 'path';
import { transformSync } from 'esbuild';

const compDir = 'components';
const files = fs.readdirSync(compDir).filter(f => /\.(tsx|ts|jsx|js)$/.test(f));

for (const file of files) {
  const fullPath = path.join(compDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  try {
    transformSync(content, {
      loader: file.endsWith('.tsx') ? 'tsx' : 'ts',
      jsx: 'automatic'
    });
  } catch (err) {
    console.log(`\n================= ${file} =================`);
    if (err.errors) {
      for (const e of err.errors) {
        console.log(`Line ${e.location?.line}:${e.location?.column} - ${e.text}`);
        const lines = content.split('\n');
        const errLine = e.location?.line ? e.location.line - 1 : lines.length - 1;
        const start = Math.max(0, errLine - 5);
        const end = Math.min(lines.length, errLine + 6);
        console.log(lines.slice(start, end).map((l, i) => `${start + i + 1}: ${l}`).join('\n'));
      }
    }
  }
}
