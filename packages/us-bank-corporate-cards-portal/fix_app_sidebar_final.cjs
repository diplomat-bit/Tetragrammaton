const fs = require('fs');

// Update Sidebar
let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebarContent = sidebarContent.replace(
  /\{ id: 'custody', name: 'Institutional Custody', icon: Building2 \},/,
  `{ id: 'custody', name: 'Institutional Custody', icon: Building2 },
    { id: 'virtualCards', name: 'Virtual Cards', icon: Settings },
    { id: 'accessOnline', name: 'Access Online', icon: Settings },`
);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);

// Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appContent.includes('VirtualCardsView')) {
  appContent = appContent.replace(
    /import CustodyView from '\.\/components\/CustodyView';/,
    `import CustodyView from './components/CustodyView';
import VirtualCardsView from './components/VirtualCardsView';
import AccessOnlineView from './components/AccessOnlineView';`
  );
}

appContent = appContent.replace(
  /custody: 'Institutional Custody'/,
  `custody: 'Institutional Custody',
    virtualCards: 'Virtual Cards',
    accessOnline: 'Access Online'`
);

appContent = appContent.replace(
  /\{activeTab === 'custody' && <CustodyView \/>\}/,
  `{activeTab === 'custody' && <CustodyView />}
            {activeTab === 'virtualCards' && <VirtualCardsView />}
            {activeTab === 'accessOnline' && <AccessOnlineView />}`
);

fs.writeFileSync('src/App.tsx', appContent);

