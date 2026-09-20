const fs = require('fs');
const esbuild = require('esbuild');

const remaining = [
  'components/CitibankCrossBorderView.tsx',
  'components/CitibankDeveloperToolsView.tsx',
  'components/ConciergeService.tsx',
  'components/CounterpartyDashboardView.tsx',
  'components/CreditHealthView.tsx',
  'components/CryptoView.tsx',
  'components/CustomerDashboard.tsx',
  'components/Dashboard.tsx',
  'components/DealFlow.tsx',
  'components/EventNotificationCard.tsx',
  'components/ExpectedPaymentsTable.tsx',
  'components/IdentityView.tsx',
  'components/IncomingPaymentDetailList.tsx',
  'components/Input.tsx',
  'components/InvestmentForm.tsx',
  'components/LoginView.tsx',
  'components/MarketplaceView.tsx',
  'components/MoneyMovementContext.tsx',
  'components/MoneyMovementProvider.tsx',
  'components/PhilanthropyHub.tsx',
  'components/PlaidDashboardView.tsx',
  'components/PlaidInstitutionsExplorer.tsx'
];

remaining.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  console.log(`\n=== ${f} === (${content.length} chars, ${content.split('\n').length} lines)`);
  console.log('Start:\n' + content.slice(0, 300));
  console.log('\nEnd:\n' + content.slice(-300));
});
