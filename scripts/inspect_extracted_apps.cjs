const fs = require('fs');
const path = require('path');

const zipDir = path.resolve(__dirname, '../zip');
console.log('Inspecting zip dir:', zipDir);
if (!fs.existsSync(zipDir)) {
  console.error('Zip dir does not exist!');
  process.exit(1);
}

const items = fs.readdirSync(zipDir);
items.forEach(item => {
  const fullPath = path.join(zipDir, item);
  if (fs.statSync(fullPath).isDirectory()) {
    const subItems = fs.readdirSync(fullPath);
    let appDir = fullPath;
    if (subItems.length === 1 && fs.statSync(path.join(fullPath, subItems[0])).isDirectory()) {
      appDir = path.join(fullPath, subItems[0]);
    }
    const pkgPath = path.join(appDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        console.log(`[APP] ${item} -> Name: ${pkg.name} | Path: ${path.relative(process.cwd(), appDir)}`);
      } catch (e) {
        console.log(`[APP] ${item} -> Error reading package.json:`, e.message);
      }
    }
  }
});
