
import fs from 'fs';
import path from 'path';
const entries = fs.readdirSync('/zip');
console.log('Entries:', entries);
for (const entry of entries) {
  const fullPath = '/zip/' + entry;
  try {
    const isDir = fs.statSync(fullPath).isDirectory();
    console.log(`Entry: "${entry}", IsDir: ${isDir}`);
    if (isDir) {
        const pkgPath = path.join(fullPath, 'package.json');
        console.log(`  Package exists: ${fs.existsSync(pkgPath)}`);
    }
  } catch (e) {
    console.log(`  Error: ${e}`);
  }
}
