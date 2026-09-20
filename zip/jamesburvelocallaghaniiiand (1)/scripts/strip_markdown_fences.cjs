const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist') continue;
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (/\.(tsx|ts|jsx|js|json|css|html)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk('.');
let cleanedCount = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remove opening markdown code blocks at the beginning of file or with leading whitespace
  content = content.replace(/^```[a-zA-Z0-9_-]*\r?\n?/gm, (match, offset) => {
    // Check if it's at start of file or isolated line fence
    return '';
  });

  // Remove trailing code fences
  content = content.replace(/\r?\n?```\s*$/g, '');
  content = content.replace(/^```\s*$/gm, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    cleanedCount++;
    console.log(`Cleaned markdown fences from: ${file}`);
  }
});

console.log(`Finished cleaning! ${cleanedCount} files cleaned.`);
