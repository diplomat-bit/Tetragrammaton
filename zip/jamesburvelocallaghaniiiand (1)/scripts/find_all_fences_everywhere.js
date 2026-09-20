import fs from 'fs';
import path from 'path';

function findFences(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        findFences(full);
      }
    } else if (/\.(tsx|ts|jsx|js|html|css|json)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('```')) {
        console.log(`FENCE FOUND: ${full}`);
      }
    }
  }
}

findFences('.');
