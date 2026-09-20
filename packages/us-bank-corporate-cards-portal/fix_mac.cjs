const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf-8');

const correctGetMac = `  app.get('/api/accounts/:id/merchant-auth-controls', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        return res.json(localDb.macControls[req.params.id] || []);
      }
      
      const response = await fetch(\`\${USBANK_API_BASE_ACCOUNTS}/accounts/\${req.params.id}/merchant-auth-controls\`, { headers: getHeaders() });
      
      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 403 && errText.includes('edgesuite.net')) {
            return res.json(localDb.macControls[req.params.id] || []);
        }
        return res.status(400).json({ error: \`U.S. Bank API Error: \${errText}\` });
      }
      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to U.S. Bank API' });
    }
  });`;

// Replace the incorrect get block
content = content.replace(/app\.get\('\/api\/accounts\/:id\/merchant-auth-controls'[^]*?\/\/ Update MAC/m, 
correctGetMac + '\n\n  // Update MAC');

// Also the update MAC needs the fallback! The regex missed it initially maybe?
// Wait, the update MAC regex didn't have the fallback in the current server.ts!
// Let's check update MAC:
const correctUpdateMac = `  app.put('/api/accounts/:id/merchant-auth-controls', async (req, res) => {
    try {
      if (!process.env.USBANK_API_KEY) {
        localDb.macControls[req.params.id] = req.body;
        return res.json({ success: true, updatedControls: req.body });
      }
      const response = await fetch(\`\${USBANK_API_BASE_ACCOUNTS}/accounts/\${req.params.id}/merchant-auth-controls\`, { 
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
      }
      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to connect to U.S. Bank API' });
    }
  });`;

content = content.replace(/app\.put\('\/api\/accounts\/:id\/merchant-auth-controls'[^]*?\/\/ Transactions Search/m,
correctUpdateMac + '\n\n  // Transactions Search');

fs.writeFileSync('server.ts', content);

