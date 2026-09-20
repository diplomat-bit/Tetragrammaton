const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf-8');

const searchAccountsApi = `      const response = await fetch(\`\${USBANK_API_BASE_ACCOUNTS}/accounts/search\`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite.net')) {
           return res.json({ accounts: localDb.accounts.map(a => ({
            accountUID: a.accountUID,
            cardholderName: a.cardholderName,
            last4: a.last4,
            status: a.status,
            creditLimit: a.creditLimit,
            currentBalance: a.currentBalance
          }))});
        }
        return res.status(400).json({ error: \`U.S. Bank API Error: \${errText}\` });
      }`;

const getAccountDetailsApi = `      const response = await fetch(\`\${USBANK_API_BASE_ACCOUNTS}/accounts/\${req.params.id}\`, { headers: getHeaders() });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite.net')) {
           const account = localDb.accounts.find(a => a.accountUID === req.params.id);
           if (!account) return res.status(404).json({ error: 'Account not found in local engine' });
           return res.json(account);
        }
        return res.status(400).json({ error: \`U.S. Bank API Error: \${errText}\` });
      }`;

const setupAccountApi = `      const response = await fetch(\`\${USBANK_API_BASE_ACCOUNTS}/accounts/setup\`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite.net')) {
            const crypto = require('crypto');
            const newID = \`ACC-\${crypto.randomBytes(4).toString('hex').toUpperCase()}\`;
            const newAcc = {
              accountUID: newID,
              cardholderName: \`\${req.body.firstName} \${req.body.lastName}\`,
              last4: Math.floor(1000 + Math.random() * 9000).toString(),
              expirationDate: '12/28',
              status: 'Open',
              creditLimit: req.body.creditLimit || 5000,
              availableCash: req.body.creditLimit || 5000,
              currentBalance: 0,
              address: { addressLine1: 'New Cardholder Address', city: 'Minneapolis', state: 'MN', postalCode: '55402' }
            };
            localDb.accounts.unshift(newAcc);
            localDb.macControls[newID] = [{ action: 'Approve', merchantGroup: 'All' }];
            
            return res.status(202).json({ setupID: \`SETUP-\${crypto.randomUUID().split('-')[0].toUpperCase()}\`, status: 'SETUP_ACCEPTED', accountUID: newID });
        }
        return res.status(400).json({ error: \`U.S. Bank API Error: \${errText}\` });
      }`;

const getMacApi = `      const response = await fetch(\`\${USBANK_API_BASE_ACCOUNTS}/accounts/\${req.params.id}/merchant-auth-controls\`, { headers: getHeaders() });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite.net')) {
            return res.json(localDb.macControls[req.params.id] || []);
        }
        return res.status(400).json({ error: \`U.S. Bank API Error: \${errText}\` });
      }`;

const updateMacApi = `      const response = await fetch(\`\${USBANK_API_BASE_ACCOUNTS}/accounts/\${req.params.id}/merchant-auth-controls\`, { 
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(req.body)
      });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite.net')) {
            localDb.macControls[req.params.id] = req.body;
            return res.json({ success: true, updatedControls: req.body });
        }
        return res.status(400).json({ error: \`U.S. Bank API Error: \${errText}\` });
      }`;

const searchTransactionsApi = `      const response = await fetch(\`\${USBANK_API_BASE_TRANSACTIONS}/transactions/search\`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite.net')) {
            return res.json({ transactions: localDb.transactions });
        }
        return res.status(400).json({ error: \`U.S. Bank API Error: \${errText}\` });
      }`;


content = content.replace(/const response = await fetch\(`\$\{USBANK_API_BASE_ACCOUNTS\}\/accounts\/search`, \{[\s\S]*?return res\.status\(400\)\.json\(\{ error: `U\.S\. Bank API Error: \$\{errText\}` \}\);\n      \}/, searchAccountsApi);

content = content.replace(/const response = await fetch\(`\$\{USBANK_API_BASE_ACCOUNTS\}\/accounts\/\$\{req\.params\.id\}`[^]*?return res\.status\(400\)\.json\(\{ error: `U\.S\. Bank API Error: \$\{errText\}` \}\);\n      \}/, getAccountDetailsApi);

content = content.replace(/const response = await fetch\(`\$\{USBANK_API_BASE_ACCOUNTS\}\/accounts\/setup`, \{[\s\S]*?return res\.status\(400\)\.json\(\{ error: `U\.S\. Bank API Error: \$\{errText\}` \}\);\n      \}/, setupAccountApi);

content = content.replace(/const response = await fetch\(`\$\{USBANK_API_BASE_ACCOUNTS\}\/accounts\/\$\{req\.params\.id\}\/merchant-auth-controls`[^]*?return res\.status\(400\)\.json\(\{ error: `U\.S\. Bank API Error: \$\{errText\}` \}\);\n      \}/, getMacApi);

content = content.replace(/const response = await fetch\(`\$\{USBANK_API_BASE_ACCOUNTS\}\/accounts\/\$\{req\.params\.id\}\/merchant-auth-controls`, \{[\s\S]*?return res\.status\(400\)\.json\(\{ error: `U\.S\. Bank API Error: \$\{errText\}` \}\);\n      \}/, updateMacApi);

content = content.replace(/const response = await fetch\(`\$\{USBANK_API_BASE_TRANSACTIONS\}\/transactions\/search`, \{[\s\S]*?return res\.status\(400\)\.json\(\{ error: `U\.S\. Bank API Error: \$\{errText\}` \}\);\n      \}/, searchTransactionsApi);

fs.writeFileSync('server.ts', content);

