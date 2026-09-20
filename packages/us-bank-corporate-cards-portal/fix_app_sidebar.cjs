const fs = require('fs');

let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebarContent = sidebarContent.replace(
  /\{ id: 'controls', name: 'Card Controls', icon: Settings \},/,
  `{ id: 'controls', name: 'Card Controls', icon: Settings },
    { id: 'zelle', name: 'Zelle Disbursements', icon: Building2 },
    { id: 'webhooks', name: 'Webhooks', icon: Settings },` // Using Settings for webhooks for now, maybe find a better icon like Webhook or Bell
);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appContent.includes('ZelleView')) {
  appContent = appContent.replace(
    /import CardControlsView from '\.\/components\/CardControlsView';/,
    `import CardControlsView from './components/CardControlsView';
import ZelleView from './components/ZelleView';
import WebhooksView from './components/WebhooksView';`
  );
}

appContent = appContent.replace(
  /controls: 'Card Controls'/,
  `controls: 'Card Controls',
    zelle: 'Zelle Disbursements',
    webhooks: 'Webhooks'`
);

appContent = appContent.replace(
  /\{activeTab === 'transactions' && <TransactionsView \/>\}/,
  `{activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'zelle' && <ZelleView />}
            {activeTab === 'webhooks' && <WebhooksView />}`
);

fs.writeFileSync('src/App.tsx', appContent);

