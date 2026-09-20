import express from 'express';
import { citiApiRouter } from './citi-api';
import { citiOpenApiSuiteRouter } from './citi-openapi-suite';
import { intuitRouter } from './intuit/intuit-router';
import { bridgeRouter } from './intuit/bridge-router';
import { universalIngestRouter } from './intuit/universal-ingest';
import { qboFullSuiteRouter } from './intuit/qbo-full-suite';
import { mcpRouter } from './mcp-server-api';
import { chaseApiRouter } from './chase-api';
import { finicityApiRouter } from './finicity-api';
import { marqetaApiRouter } from './marqeta-api';
import { modernTreasuryApiRouter } from './modern-treasury-api';
import { newRelicRouter } from './newrelic-api';
import { paypalApiRouter } from './paypal-api';
import { plaidApiRouter } from './plaid-api';
import { westernUnionPsd2Router } from './western-union-psd2';
import { visaUnifiedRouter } from './visa-unified-router';
import { ethereumApiRouter } from './ethereum-api';
import { amazonApsRouter } from './amazon-aps-api';
import { aiProcureRouter } from './ai-procure-api';
import { aiAppPilotRouter } from './ai-app-pilot';
import { cardCatalogRouter } from './card-catalog-api';
import { credentialsRouter } from './credentials-api';
import { envManagerRouter } from './env-manager';
import { expansionRouter } from './expansion-pipeline';
import { extractedAppsRouter } from './extracted-apps-api';
import { integratedPackagesRouter } from './integrated-packages-api';
import { streamOpenApiRouter } from './stream-openapi-api';
import { stripeAnalyticsRouter } from './stripe-analytics-api';
import { treasuryXsdRouter } from './treasury-xsd-api';
import { azureDeploymentsRouter } from './azure-deployments-api';
import { azureMasterRouter } from './azure-master-deploy';
import { ocallaghanRouter } from './ocallaghan-algorithm';
import { googleServiceKeyRouter } from './google-service-key';
import { authKeysRouter } from './auth-keys';
import { azureArcRouter } from './azure-arc-onboarding';
import { azureAuthRouter } from './azure-auth';
import { web3BrowserRouter } from './web3-browser-proxy';
import { workbenchRouter } from './workbench-api';
import { sovereignSingularityRouter } from './sovereign-singularity-api';
import { signwellRouter } from './signwell-api';
import { jamesburveloRouter } from './jamesburvelo-api';
import { kronosApiRouter } from './kronos-api';
import { githubDeployRouter } from './github-deploy-api';

export const activeTokens = {
  accessToken: '',
  refreshToken: '',
  realmId: '9341453267972001',
  tokenType: 'bearer',
  expiresIn: 3600,
  updatedAt: Date.now(),
};

export const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Intuit / QuickBooks Routes (Mounted at both /api/intuit and /intuit for maximum resilience)
app.use('/api/intuit', intuitRouter);
app.use('/intuit', intuitRouter);

// Universal Ingest & Full Suite Routes
app.use('/api/intuit/universal', universalIngestRouter);
app.use('/api/intuit/suite', qboFullSuiteRouter);

// QuickBooks Autonomous Quantum Bridge
app.use('/api/bridge', bridgeRouter);
app.use('/api/intuit/bridge', bridgeRouter);

// Model Context Protocol (MCP) Multi-Company Unified Server
app.use('/api/mcp', mcpRouter);
app.use('/api', mcpRouter); // Also mounts /api/mcp/execute, /api/mcp/tools etc.
app.use('/mcp', mcpRouter);

// Institutional Banking & Fintech Ecosystem Routers
app.use('/api/citi/openapi', citiOpenApiSuiteRouter);
app.use('/openapi', citiOpenApiSuiteRouter);
app.use('/foundations', citiOpenApiSuiteRouter);
app.use('/api/citi', citiApiRouter);
app.use('/api/chase', chaseApiRouter);
app.use('/api/finicity', finicityApiRouter);
app.use('/api/marqeta', marqetaApiRouter);
app.use('/api/moderntreasury', modernTreasuryApiRouter);
app.use('/api/newrelic', newRelicRouter);
app.use('/api/paypal', paypalApiRouter);
app.use('/api/plaid', plaidApiRouter);
app.use('/api/wu-psd2', westernUnionPsd2Router);
app.use('/api/visa', visaUnifiedRouter);
app.use('/api/ethereum', ethereumApiRouter);
app.use('/api/amazon', amazonApsRouter);

// Auxiliary & Management Routers
app.use('/api/procure', aiProcureRouter);
app.use('/api/pilot', aiAppPilotRouter);
app.use('/api/card-catalog', cardCatalogRouter);
app.use('/api/credentials', credentialsRouter);
app.use('/api/env-manager', envManagerRouter);
app.use('/api/expansion', expansionRouter);
app.use('/api/extracted-apps', extractedAppsRouter);
app.use('/api', extractedAppsRouter);
app.use('/api/jamesburvelo', jamesburveloRouter);
app.use('/api/consortium', jamesburveloRouter);
app.use('/api/integrated-packages', integratedPackagesRouter);
app.use('/api/stream-openapi', streamOpenApiRouter);
app.use('/api/stripe', stripeAnalyticsRouter);
app.use('/api/treasury-xsd', treasuryXsdRouter);
app.use('/api/azure', azureDeploymentsRouter);
app.use('/api/azure-master', azureMasterRouter);
app.use('/api/azure-arc', azureArcRouter);
app.use('/api/azure-auth', azureAuthRouter);
app.use('/api/ocallaghan', ocallaghanRouter);
app.use('/api/google-service-key', googleServiceKeyRouter);
app.use('/api/auth-keys', authKeysRouter);
app.use('/api/web3-browser', web3BrowserRouter);
app.use('/api/workbench', workbenchRouter);
app.use('/api/sovereign', sovereignSingularityRouter);
app.use('/api/singularity', sovereignSingularityRouter);
app.use('/api/signwell', signwellRouter);
app.use('/api/kronos', kronosApiRouter);
app.use('/kronos', kronosApiRouter);
app.use('/api/github', githubDeployRouter);
app.use('/github', githubDeployRouter);

// Quantum telemetry endpoint
app.post('/api/quantum', async (req, res) => {
  try {
    res.json({ success: true, counts: { '00': 512, '11': 512 } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
