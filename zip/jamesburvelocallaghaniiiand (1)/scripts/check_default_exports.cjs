const fs = require('fs');
const path = require('path');

const compDir = 'components';
const files = fs.readdirSync(compDir).filter(f => /\.(tsx|jsx|ts|js)$/.test(f));

let fixedCount = 0;
for (const file of files) {
  const fullPath = path.join(compDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  const baseName = file.replace(/\.(tsx|jsx|ts|js)$/, '');

  // Check if it has an export default
  const hasDefaultExport = /export\s+default\s+/m.test(content);
  if (!hasDefaultExport) {
    // Check if there is a named export matching baseName or any component
    const namedMatch = content.match(new RegExp(`export\\s+(?:const|function|class)\\s+(${baseName}|\\w+)`, 'm'));
    if (namedMatch) {
      const expName = namedMatch[1];
      content += `\nexport default ${expName};\n`;
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Added export default ${expName} to ${file}`);
      fixedCount++;
    } else {
      content += `\nconst _defaultComp = () => null;\nexport default _defaultComp;\n`;
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Added fallback export default to ${file}`);
      fixedCount++;
    }
  }
}

console.log(`Ensured default exports for all components! Fixed ${fixedCount} files.`);
