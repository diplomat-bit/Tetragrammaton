const fs = require('fs');

let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebarContent = sidebarContent.replace(
  /\{ id: 'webhooks', name: 'Webhooks', icon: Settings \},/,
  `{ id: 'webhooks', name: 'Webhooks', icon: Settings },
    { id: 'custody', name: 'Institutional Custody', icon: Building2 },`
);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appContent.includes('CustodyView')) {
  appContent = appContent.replace(
    /import WebhooksView from '\.\/components\/WebhooksView';/,
    `import WebhooksView from './components/WebhooksView';
import CustodyView from './components/CustodyView';`
  );
}

appContent = appContent.replace(
  /webhooks: 'Webhooks'/,
  `webhooks: 'Webhooks',
    custody: 'Institutional Custody'`
);

appContent = appContent.replace(
  /\{activeTab === 'webhooks' && <WebhooksView \/>\}/,
  `{activeTab === 'webhooks' && <WebhooksView />}
            {activeTab === 'custody' && <CustodyView />}`
);

fs.writeFileSync('src/App.tsx', appContent);

