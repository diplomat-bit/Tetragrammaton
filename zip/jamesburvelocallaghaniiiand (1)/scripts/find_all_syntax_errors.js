import fs from 'fs';
import path from 'path';
import { transformSync } from 'esbuild';

const compDir = 'components';
const files = fs.readdirSync(compDir).filter(f => /\.(tsx|ts|jsx|js)$/.test(f));

const errors = [];

for (const file of files) {
  const fullPath = path.join(compDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  try {
    transformSync(content, {
      loader: file.endsWith('.tsx') ? 'tsx' : 'ts',
      jsx: 'automatic'
    });
  } catch (err) {
    errors.push({ file, firstLine: err.message.split('\n')[0] });
  }
}

console.log(`Scanned ${files.length} components. Found ${errors.length} syntax error files:`);
errors.forEach(e => {
  console.log(`${e.file} -> ${e.firstLine}`);
});
