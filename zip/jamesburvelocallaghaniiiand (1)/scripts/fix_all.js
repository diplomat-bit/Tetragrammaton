const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const loader = filePath.endsWith('.tsx') ? 'tsx' : 'ts';
  try {
    esbuild.transformSync(content, { loader });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.errors[0] };
  }
}

console.log('Script helper loaded.');
