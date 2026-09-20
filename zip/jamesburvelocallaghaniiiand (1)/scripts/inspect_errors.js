import fs from 'fs';
import path from 'path';
import { transformSync } from 'esbuild';

const compDir = 'components';
const files = fs.readdirSync(compDir).filter(f => /\.(tsx|ts|jsx|js)$/.test(f));

for (const file of files) {
  const fullPath = path.join(compDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  try {
    transformSync(content, {
      loader: file.endsWith('.tsx') ? 'tsx' : 'ts',
      jsx: 'automatic'
    });
  } catch (err) {
    console.log(`\n================= ${file} =================`);
    console.log(err.errors ? err.errors.map(e => `${e.location?.line}:${e.location?.column} - ${e.text}`).join('\n') : err.message);
  }
}
