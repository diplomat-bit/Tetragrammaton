const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).map(f => path.join(dir, f)).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  if (!content.includes('import { fetchApi }')) {
    content = "import { fetchApi } from '../utils';\n" + content;
  }
  
  // Replace AccountsView
  if (file.includes('AccountsView')) {
    content = content.replace(/fetch\('\/api\/accounts\/search', \{[\s\S]*?body: JSON\.stringify\(\{\}\)\n    \}\)\n    \.then\(async res => \{\n      const data = await res\.json\(\);\n      if \(!res\.ok\) throw new Error\(data\.error \|\| 'Failed to fetch accounts'\);\n      return data;\n    \}\)/g, 
    "fetchApi('/api/accounts/search', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({})\n    })");
    
    content = content.replace(/const res = await fetch\(`\/api\/accounts\/\$\{accountUID\}`\);\n      const data = await res\.json\(\);\n      if \(!res\.ok\) throw new Error\(data\.error \|\| 'Failed to fetch account details'\);/g, 
    "const data = await fetchApi(`/api/accounts/${accountUID}`);");
  }
  
  // Replace TransactionsView
  if (file.includes('TransactionsView')) {
    content = content.replace(/fetch\('\/api\/transactions\/search', \{[\s\S]*?body: JSON\.stringify\(\{ pageSize: 50, pageNumber: 1 \}\)\n    \}\)\n    \.then\(async res => \{\n      const data = await res\.json\(\);\n      if \(!res\.ok\) throw new Error\(data\.error \|\| 'Failed to fetch transactions'\);\n      return data;\n    \}\)/g, 
    "fetchApi('/api/transactions/search', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ pageSize: 50, pageNumber: 1 })\n    })");
  }

  // Replace SetupAccountView
  if (file.includes('SetupAccountView')) {
    content = content.replace(/const res = await fetch\('\/api\/accounts\/setup', \{[\s\S]*?\}\);\n      const data = await res\.json\(\);\n      if \(!res\.ok\) throw new Error\(data\.error \|\| 'Failed to setup account'\);/g, 
    "const data = await fetchApi('/api/accounts/setup', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          firstName: formData.get('firstName'),\n          lastName: formData.get('lastName'),\n          creditLimit: Number(formData.get('creditLimit'))\n        })\n      });");
  }
  
  // Replace CardControlsView
  if (file.includes('CardControlsView')) {
    content = content.replace(/const res = await fetch\(`\/api\/accounts\/\$\{accountUID\}\/merchant-auth-controls`\);\n      const data = await res\.json\(\);\n      if \(!res\.ok\) throw new Error\(data\.error \|\| 'Failed to fetch Merchant Controls'\);/g, 
    "const data = await fetchApi(`/api/accounts/${accountUID}/merchant-auth-controls`);");
    
    content = content.replace(/const res = await fetch\(`\/api\/accounts\/\$\{accountUID\}\/merchant-auth-controls`, \{[\s\S]*?\}\);\n      const data = await res\.json\(\);\n      if \(!res\.ok\) throw new Error\(data\.error \|\| 'Failed to update Merchant Controls'\);/g, 
    "const data = await fetchApi(`/api/accounts/${accountUID}/merchant-auth-controls`, {\n        method: 'PUT',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(controls)\n      });");
  }

  fs.writeFileSync(file, content);
});
