const fs = require('fs');
const https = require('https');

https.get('https://apisandbox.openbankproject.com/obp/v5.1.0/banks', (res) => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const banks = parsed.banks || [];
      
      let readme = `# 🌐 Global Corporate Treasury & Open Banking Command Center\n\n`;
      
      readme += `## 📖 The Epic Narrative: Reimagining Financial Infrastructure\n\n`;
      readme += `Imagine stepping into the role of a modern Corporate Treasurer, Quantitative Analyst, or FinTech Developer. The traditional financial world is fragmented, relying on archaic portals, manual CSV exports, and delayed batch processing. You are sitting at a command center that shatters those limitations.\n\n`;
      readme += `This application isn't just a static web interface or a mock prototype; it is a **live, fully-connected global financial sandbox**. By integrating directly with the **Open Bank Project (OBP)** network, this platform bypasses hardcoded dummy data and reaches straight into a sprawling ecosystem of simulated financial institutions worldwide.\n\n`;
      readme += `When you boot up this system, it dynamically discovers the banking network. It maps out entities ranging from traditional tier-one banks like *The Royal Bank of Scotland*, *Banco Santander*, and *Deutsche Bank*, all the way to specialized test environments and regional simulated banks. You aren't just looking at data—you are interacting with an active API network that mimics real-world Open Banking (PSD2) standards.\n\n`;
      
      readme += `### 🔐 The Authentication Matrix\n`;
      readme += `Security and access control are paramount. You begin your session by injecting your Open Bank Project credentials directly into the platform. The application executes a secure \`DirectLogin\` sequence against the OBP servers, exchanging your API Key, Username, and Password for a cryptographic session token. From that moment on, every network request is signed, authenticated, and authorized to manipulate your specific corporate sandboxes.\n\n`;
      
      readme += `### 📡 The Network Telemetry Inspector\n`;
      readme += `True control requires absolute visibility. We built a live **Telemetry & Network Inspector** (accessible via the Terminal icon) that acts as an API heart monitor. Every time the dashboard whispers to a bank—whether it's fetching account balances or routing a cross-border payment—the inspector logs the raw truth. You see the exact HTTP statuses, latency in milliseconds, destination URLs, and the raw JSON payloads. We even generate 1-click copyable \`cURL\` commands so you can instantly drop into your own terminal and replay the network events.\n\n`;
      
      readme += `### 💸 Programmatic Liquidity & Money Movement\n`;
      readme += `Viewing balances is only half the equation; manipulating liquidity is where true power lies. The integrated **Transfer & Settlement Engine** allows you to initiate cross-institution transfers on the fly. Select a source account from your portfolio, pick an external destination bank from the live network, and dispatch the funds. The frontend instantly orchestrates the complex \`POST\` payloads required by the OBP Transaction Request API, executing programmatic money movement in real-time.\n\n`;
      
      readme += `### 🛠️ Interactive API Workbench\n`;
      readme += `Built by developers, for developers. Embedded within the Open Bank Project module is a Postman-style API workbench. You don't need to leave the app to debug a new endpoint. With one click, you can fire off custom \`GET\` and \`POST\` requests to specific bank routing addresses, instantly rendering and formatting the JSON response right inside your dashboard.\n\n`;

      readme += `---\n\n`;

      readme += `## 🚀 Core Architecture & Technology Stack\n\n`;
      readme += `This platform is engineered using a robust, modern full-stack architecture designed for performance, security, and developer experience.\n\n`;
      readme += `- **Frontend Ecosystem**: Built with **React 18** and **Vite** for lightning-fast HMR and optimized production builds.\n`;
      readme += `- **Styling & UI**: Powered by **Tailwind CSS** for responsive, utility-first styling, paired with **Lucide Icons** and **Framer Motion** for fluid, professional animations and transitions.\n`;
      readme += `- **Backend Proxy Engine**: A **Node.js** and **Express** server operates as a secure intermediary layer. This prevents CORS issues, protects sensitive API keys from being exposed to the client browser, and acts as the central hub for our Telemetry tracking.\n`;
      readme += `- **API Integration**: Deep, native integration with the **Open Bank Project (v5.1.0 API)**, alongside specialized abstractions for simulated Modern Treasury clearing and Commercial Paper desks.\n\n`;

      readme += `---\n\n`;

      readme += `## 🛠️ Getting Started & Installation Guide\n\n`;
      readme += `1. **Clone & Install**: Ensure you have Node.js installed. Run \`npm install\` to pull down all dependencies.\n`;
      readme += `2. **Environment Configuration**: Duplicate \`.env.example\` to \`.env\` and configure your OBP credentials if running locally.\n`;
      readme += `3. **Boot the Engines**: Run \`npm run dev\` to spin up both the Vite frontend and the Express API proxy simultaneously.\n`;
      readme += `4. **Authenticate**: Open the application, click the **Credentials / Settings** button in the top right, and input your OBP API Key and login details.\n`;
      readme += `5. **Explore**: Navigate to the Open Bank Project tab, open the Telemetry Inspector, and start interacting with the global sandbox.\n\n`;

      readme += `---\n\n`;

      readme += `## 🏦 The Complete Global Banking Directory\n\n`;
      readme += `This platform is engineered to interact with the entire Open Bank Project sandbox network. Upon initialization, it dynamically fetches and indexes the available financial institutions.\n\n`;
      readme += `Below is the comprehensive list of all **${banks.length}** banks currently accessible and integrated within this command center:\n\n`;
      
      readme += `| Bank ID | Short Name | Full Name | Primary Routing Scheme |\n`;
      readme += `|---------|------------|-----------|------------------------|\n`;
      
      banks.forEach(b => {
        const scheme = b.bank_routings && b.bank_routings.length > 0 ? b.bank_routings[0].scheme : 'N/A';
        readme += `| \`${b.id}\` | ${b.short_name || 'N/A'} | ${b.full_name || 'N/A'} | \`${scheme}\` |\n`;
      });

      readme += `\n---\n\n`;
      readme += `*This architecture is continuously evolving. As the Open Bank Project expands its sandbox, this dashboard will automatically ingest, map, and expose the new financial routing nodes in real-time.*\n`;

      fs.writeFileSync('README.md', readme);
      console.log(`Successfully generated mega-README with ${banks.length} banks.`);
    } catch (e) {
      console.error('Error parsing JSON or writing file:', e);
    }
  });
}).on('error', (err) => {
  console.error('HTTPS request failed:', err);
});
