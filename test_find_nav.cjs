const fs = require('fs');
const path = require('path');

function searchFile(dir, fileName) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        const found = searchFile(fullPath, fileName);
        if (found) return found;
      }
    } else if (file === fileName) {
      return fullPath;
    }
  }
  return null;
}

const found = searchFile('/app/applet', 'TreasuryXsdConsole.tsx');
if (found) {
  console.log(`Found at: ${found}`);
} else {
  console.log("Not found.");
}
