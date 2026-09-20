const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // A simple regex to replace generic res.json() parsing with a safer one
  // Note: we'll just write a wrapper for fetch in a new file, and use it?
  // Better yet, just use regex to replace.
});
