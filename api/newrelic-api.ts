import { Router, Request, Response } from 'express';
import os from 'os';

export const newRelicRouter = Router();

export interface NewRelicConfig {
  apiKey: string;
  accountId: string;
  appName: string;
  logLevel: string;
  installCommand: string;
  isConfigured: boolean;
  agentVersion: string;
}

export function getNewRelicConfig(): NewRelicConfig {
  const apiKey = process.env.NEW_RELIC_API_KEY || 'NRAK-JT6X72Y5W8LWT1PB2NB3BTW1KTE';
  const accountId = process.env.NEW_RELIC_ACCOUNT_ID || '4095792';
  const appName = process.env.NEW_RELIC_APP_NAME || 'QuickBooks-AI-Banking-Bridge';
  const logLevel = process.env.NEW_RELIC_LOG_LEVEL || 'info';

  const installCommand = `curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh | bash && sudo NEW_RELIC_API_KEY=${apiKey} NEW_RELIC_ACCOUNT_ID=${accountId} /usr/local/bin/newrelic install`;

  return {
    apiKey,
    accountId,
    appName,
    logLevel,
    installCommand,
    isConfigured: Boolean(apiKey && accountId),
    agentVersion: 'v12.x OpenTelemetry & APM Node Agent',
  };
}

/**
 * GET /api/newrelic/status
 */
newRelicRouter.get('/status', (req: Request, res: Response) => {
  const config = getNewRelicConfig();
  const maskedKey = config.apiKey
    ? `${config.apiKey.slice(0, 8)}••••••••${config.apiKey.slice(-4)}`
    : 'Not configured';

  const systemMetrics = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMb: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
    totalMemoryGb: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2),
    freeMemoryGb: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2),
    cpuCores: os.cpus().length,
  };

  res.json({
    success: true,
    config: {
      ...config,
      maskedApiKey: maskedKey,
    },
    systemMetrics,
    telemetryEndpoints: {
      nerdgraphGraphql: 'https://api.newrelic.com/graphql',
      logsIngestApi: 'https://log-api.newrelic.com/log/v1',
      metricsIngestApi: 'https://metric-api.newrelic.com/metric/v1',
      eventsIngestApi: 'https://insights-collector.newrelic.com/v1/accounts/' + config.accountId + '/events',
      oneDashboardUrl: `https://one.newrelic.com/launcher/nr1-core.explorer?account=${config.accountId}`,
    },
  });
});

/**
 * POST /api/newrelic/test-nerdgraph
 * Queries New Relic GraphQL NerdGraph API using the User/Ingest API key
 */
newRelicRouter.post('/test-nerdgraph', async (req: Request, res: Response) => {
  const config = getNewRelicConfig();
  const apiKey = req.body.apiKey || config.apiKey;
  const accountId = req.body.accountId || config.accountId;

  if (!apiKey) {
    return res.status(400).json({ success: false, error: 'New Relic API Key is required' });
  }

  // GraphQL query against NerdGraph API
  const graphqlQuery = {
    query: `
      query GetAccountInfo($accountId: Int!) {
        actor {
          user {
            email
            name
            id
          }
          account(id: $accountId) {
            id
            name
          }
        }
      }
    `,
    variables: {
      accountId: parseInt(accountId, 10) || 4095792,
    },
  };

  try {
    const response = await fetch('https://api.newrelic.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
      },
      body: JSON.stringify(graphqlQuery),
    });

    const data: any = await response.json();

    if (response.ok && !data.errors) {
      return res.json({
        success: true,
        status: response.status,
        message: 'Successfully authenticated with New Relic NerdGraph API!',
        data: data.data,
      });
    } else {
      return res.json({
        success: false,
        status: response.status,
        error: data.errors?.[0]?.message || 'New Relic NerdGraph request returned errors',
        details: data,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: `Failed to connect to New Relic API: ${err.message}`,
    });
  }
});

/**
 * POST /api/newrelic/send-log
 * Pushes custom structured log event to New Relic Log Ingest API
 */
newRelicRouter.post('/send-log', async (req: Request, res: Response) => {
  const config = getNewRelicConfig();
  const apiKey = req.body.apiKey || config.apiKey;
  const message = req.body.message || 'QuickBooks AI Banking Autonomous Bridge heartbeat';
  const level = req.body.level || 'info';
  const metadata = req.body.metadata || {};

  if (!apiKey) {
    return res.status(400).json({ success: false, error: 'New Relic API Key is required' });
  }

  const logPayload = [
    {
      common: {
        attributes: {
          service: config.appName,
          hostname: os.hostname(),
          environment: process.env.NODE_ENV || 'development',
          accountId: config.accountId,
        },
      },
      logs: [
        {
          timestamp: Date.now(),
          message,
          'log.level': level,
          ...metadata,
          source: 'QuickBooks-Autonomous-Bridge',
          integration: 'Intuit-OpenBanking-Telemetry',
        },
      ],
    },
  ];

  try {
    const response = await fetch('https://log-api.newrelic.com/log/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify(logPayload),
    });

    if (response.ok) {
      return res.json({
        success: true,
        status: response.status,
        message: 'Log record successfully ingested into New Relic Log Stream!',
        payloadSent: logPayload,
      });
    } else {
      const errorText = await response.text();
      return res.json({
        success: false,
        status: response.status,
        error: `New Relic Ingest returned HTTP ${response.status}: ${errorText}`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: `Failed to send log to New Relic: ${err.message}`,
    });
  }
});

/**
 * POST /api/newrelic/send-metric
 * Sends custom dimensional metrics to New Relic Metric API
 */
newRelicRouter.post('/send-metric', async (req: Request, res: Response) => {
  const config = getNewRelicConfig();
  const apiKey = req.body.apiKey || config.apiKey;
  const metricName = req.body.metricName || 'quickbooks.bridge.sync_event';
  const value = typeof req.body.value === 'number' ? req.body.value : 1;
  const attributes = req.body.attributes || {};

  if (!apiKey) {
    return res.status(400).json({ success: false, error: 'New Relic API Key is required' });
  }

  const metricPayload = [
    {
      metrics: [
        {
          name: metricName,
          type: 'gauge',
          value,
          timestamp: Math.floor(Date.now() / 1000),
          attributes: {
            'service.name': config.appName,
            host: os.hostname(),
            'account.id': config.accountId,
            ...attributes,
          },
        },
      ],
    },
  ];

  try {
    const response = await fetch('https://metric-api.newrelic.com/metric/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify(metricPayload),
    });

    if (response.ok) {
      return res.json({
        success: true,
        status: response.status,
        message: `Metric "${metricName}" (${value}) successfully dispatched to New Relic!`,
        payloadSent: metricPayload,
      });
    } else {
      const errText = await response.text();
      return res.json({
        success: false,
        status: response.status,
        error: `New Relic Metrics API returned HTTP ${response.status}: ${errText}`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: `Failed to send metric to New Relic: ${err.message}`,
    });
  }
});

/**
 * GET /api/newrelic/download-script
 * Generates and downloads the full standalone shell script for installing New Relic CLI
 */
newRelicRouter.get('/download-script', (req: Request, res: Response) => {
  const config = getNewRelicConfig();

  const scriptContent = `#!/bin/bash
# ==============================================================================
# New Relic Automated Full-Stack Observability & APM Agent Installer
# Account ID: ${config.accountId}
# Generated: ${new Date().toISOString()}
# ==============================================================================

set -e

echo "================================================================="
echo "   New Relic Observability Installation for QuickBooks AI Hub   "
echo "================================================================="
echo "Target Account ID: ${config.accountId}"
echo "Application Name : ${config.appName}"
echo ""

echo "[1/3] Downloading official New Relic CLI installer..."
curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh | bash

echo "[2/3] Installing New Relic Guided Agent & Observability suite..."
sudo NEW_RELIC_API_KEY="${config.apiKey}" \\
     NEW_RELIC_ACCOUNT_ID="${config.accountId}" \\
     NEW_RELIC_REGION="US" \\
     /usr/local/bin/newrelic install

echo "[3/3] Installation command executed. Verifying local agent..."
echo "New Relic One URL: https://one.newrelic.com/launcher/nr1-core.explorer?account=${config.accountId}"
echo "Done!"
`;

  res.setHeader('Content-Type', 'text/x-shellscript');
  res.setHeader('Content-Disposition', 'attachment; filename="newrelic_install.sh"');
  res.send(scriptContent);
});
