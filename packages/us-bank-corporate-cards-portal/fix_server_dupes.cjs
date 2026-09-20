const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// Find the index of the first "// Zelle: Search Aliases"
const firstZelle = content.indexOf('// Zelle: Search Aliases');
const secondZelle = content.indexOf('// Zelle: Search Aliases', firstZelle + 1);

if (secondZelle !== -1) {
  // It was duplicated. Let's remove the second one.
  const endOfSecond = content.indexOf('// Vite middleware for development', secondZelle);
  if (endOfSecond !== -1) {
    content = content.substring(0, secondZelle) + content.substring(endOfSecond);
  }
}
fs.writeFileSync('server.ts', content);
