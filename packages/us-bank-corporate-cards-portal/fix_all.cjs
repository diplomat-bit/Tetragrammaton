const fs = require('fs');

function replaceFetch(file) {
  let content = fs.readFileSync(file, 'utf-8');
  
  if (!content.includes('import { fetchApi }')) {
    content = "import { fetchApi } from '../utils';\n" + content;
  }

  // Replace fetch().then(async res => { const data = await res.json(); if (!res.ok) ... })
  content = content.replace(/fetch\((['"`].*?['"`]),\s*(\{[\s\S]*?\})\s*\)\s*\.then\(\s*async\s*res\s*=>\s*\{\s*const\s*data\s*=\s*await\s*res\.json\(\);\s*if\s*\(!res\.ok\)\s*throw\s*new\s*Error\([^)]*\);\s*return\s*data;\s*\}\s*\)/g, 
  "fetchApi($1, $2)");

  // Replace await fetch() / await res.json()
  content = content.replace(/const res = await fetch\((.*?)\);\s*const data = await res\.json\(\);\s*if \(!res\.ok\) throw new Error\([^)]*\);/g, 
  "const data = await fetchApi($1);");

  content = content.replace(/const res = await fetch\((.*?),\s*(\{[\s\S]*?\})\s*\);\s*const data = await res\.json\(\);\s*if \(!res\.ok\) throw new Error\([^)]*\);/g, 
  "const data = await fetchApi($1, $2);");
  
  fs.writeFileSync(file, content);
}

replaceFetch('src/components/TransactionsView.tsx');
replaceFetch('src/components/SetupAccountView.tsx');
replaceFetch('src/components/CardControlsView.tsx');
