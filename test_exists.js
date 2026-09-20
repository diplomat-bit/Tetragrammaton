
import fs from 'fs';
import path from 'path';
const p = path.join('/zip/Aibankinggod-main (2)', 'package.json');
console.log('Path:', p);
console.log('Exists:', fs.existsSync(p));
