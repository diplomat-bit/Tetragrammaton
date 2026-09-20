const fs = require('fs');
const path = require('path');

const dirs = ['components', 'services'];
const fallback = '(process.env.GEMINI_API_KEY || (typeof window !== "undefined" ? localStorage.getItem("CUSTOM_GEMINI_KEY") : "") || (import.meta as any).env?.VITE_GEMINI_API_KEY)';

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Don't replace if already replaced
      if (content.includes('CUSTOM_GEMINI_KEY')) {
        continue;
      }

      // Replace process.env.GEMINI_API_KEY
      const newContent = content.replace(/process\.env\.GEMINI_API_KEY/g, fallback);
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

dirs.forEach(processDir);
