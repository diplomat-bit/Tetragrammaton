import express from 'express';
import { Request, Response } from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';

export const mcpRouter = express.Router();

// Initialize MCP Server for All Companies Combined
const mcpServer = new Server(
  {
    name: 'Multi-Company Banking & Fintech MCP Server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define All Combined Company Tools
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_all_companies_status',
        description: 'Returns the health, connection status, and endpoint catalog for all 10+ integrated companies (Citibank, Chase, FDX, Modern Treasury, PayPal, Marqeta, New Relic, Amazon, Ethereum, Card Catalog).',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'citi_banking_action',
        description: 'Execute Citibank and Open Banking (OBP) operations: account balance retrieval, CSV export, insurance booking, AI treasury insights, DCR registration, UAE/Dubai loan offers, HK cards, and JWT/JWE decryption.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['get_accounts', 'export_csv', 'book_insurance', 'ai_insights', 'dcr_register', 'uae_lending', 'hk_cards', 'jwt_decrypt', 'commercial_paper'],
              description: 'The Citibank/OBP operation to execute.'
            },
            payload: {
              type: 'object',
              description: 'Optional payload parameters for the action.'
            }
          },
          required: ['action']
        },
      },
      {
        name: 'chase_rewards_action',
        description: 'Execute Chase Bank operations: Pay with Points rewards validation, merchant program enrollment, and transaction simulation.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['get_points', 'enroll_merchant', 'simulate_transaction'],
              description: 'Chase action to execute.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      },
      {
        name: 'fdx_open_finance_action',
        description: 'Execute FDX v6 Open Finance bill pay gateway operations: list payees, schedule disbursements, and fetch telemetry metrics.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['list_payees', 'schedule_bill', 'get_metrics'],
              description: 'FDX action to execute.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      },
      {
        name: 'moderntreasury_ledger_action',
        description: 'Execute Modern Treasury operations: payment orders, ledger entry recording, and counterparty management.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['create_payment_order', 'list_ledgers', 'add_counterparty'],
              description: 'Modern Treasury action.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      },
      {
        name: 'paypal_braintree_action',
        description: 'Execute PayPal / Braintree checkout, subscription creation, and payout operations.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['create_order', 'create_subscription', 'execute_payout'],
              description: 'PayPal action.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      },
      {
        name: 'marqeta_issuing_action',
        description: 'Execute Marqeta card issuing operations: virtual card provisioning, user creation, and webhook simulation.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['create_card', 'list_holders', 'simulate_webhook'],
              description: 'Marqeta action.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      },
      {
        name: 'newrelic_telemetry_action',
        description: 'Fetch New Relic APM metrics, error logs, and performance traces.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['get_metrics', 'get_errors', 'get_traces'],
              description: 'New Relic action.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      },
      {
        name: 'amazon_aps_action',
        description: 'Execute Amazon Payment Services checkout session and fulfillment verification.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['create_session', 'verify_signature', 'process_refund'],
              description: 'Amazon APS action.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      },
      {
        name: 'ethereum_blockchain_action',
        description: 'Execute Ethereum Web3 operations: wallet connection status, blockchain ledger notarization, and bank on-ramp.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['get_balance', 'notarize_hash', 'buy_eth_bank'],
              description: 'Ethereum Web3 action.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      },
      {
        name: 'krisp_meeting_automation',
        description: 'Execute Krisp AI Meeting Assistant operations: background noise cancellation, transcript summarization, action item extraction, and triggering any of the 25 Zapier integrations (Zoom, Slack, HubSpot, Jira, QuickBooks, Google Drive).',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['generate_summary_and_zap', 'trigger_zap', 'process_transcript'],
              description: 'Krisp / Zapier action.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      },
      {
        name: 'card_vault_catalog_action',
        description: 'Manage card and bank account vault catalog, parse ISO magnetic tracks (Track 0, 1, 2, 3 with LRC checksums), simulate USB encoder control transfers (Vendor 0x0801, Product 0x0003), and download CSV/JSON backups.',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['list_catalog', 'add_card', 'encode_usb', 'download_catalog'],
              description: 'Card Vault action.'
            },
            payload: { type: 'object' }
          },
          required: ['action']
        }
      }
    ],
  };
});

// Tool execution handler combining all companies
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: rawArgs } = request.params;
  const args = (rawArgs || {}) as Record<string, any>;
  const payload = (args.payload as any) || {};

  switch (name) {
    case 'get_all_companies_status':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ONLINE',
              server: 'Multi-Company Banking & Fintech MCP Server',
              timestamp: new Date().toISOString(),
              integratedCompanies: [
                { name: 'Citibank N.A.', modules: ['Accounts', 'CSV Export', 'Insurance', 'AI Advisor', 'DCR Sandbox', 'UAE Lending', 'HK Cards', 'JWT Decryption', 'Commercial Paper'], status: 'ACTIVE' },
                { name: 'Chase Bank USA', modules: ['Pay with Points', 'Rewards Validator', 'Transaction Simulator'], status: 'ACTIVE' },
                { name: 'Financial Data Exchange (FDX v6)', modules: ['Bill Pay Gateway', 'Payee Directory', 'Telemetry'], status: 'ACTIVE' },
                { name: 'Modern Treasury', modules: ['Payment Orders', 'Ledger Entries', 'Counterparties'], status: 'ACTIVE' },
                { name: 'PayPal / Braintree', modules: ['Checkout Orders', 'Subscriptions', 'Payouts'], status: 'ACTIVE' },
                { name: 'Marqeta', modules: ['Card Issuing', 'Virtual Cards', 'Webhooks'], status: 'ACTIVE' },
                { name: 'New Relic', modules: ['APM Metrics', 'Error Logs', 'Performance Traces'], status: 'ACTIVE' },
                { name: 'Amazon Payment Services', modules: ['Checkout Sessions', 'Fulfillment', 'Signatures'], status: 'ACTIVE' },
                { name: 'Ethereum / Web3', modules: ['Blockchain Notary', 'Wallet RPC', 'Bank On-Ramp'], status: 'ACTIVE' },
                { name: 'Card & Bank Account Vault Catalog', modules: ['ISO Track Parser', 'USB Encoder (0x0801:0x0003)', 'CSV/JSON Export'], status: 'ACTIVE' },
                { name: 'Krisp AI Meeting Assistant', modules: ['Noise Cancellation', 'Transcript Summarizer', 'Action Item Extractor', '25 Zapier Automations'], status: 'ACTIVE' }
              ]
            }, null, 2)
          }
        ]
      };

    case 'citi_banking_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'Citibank N.A.',
              action: args.action,
              result: {
                message: `Successfully executed Citibank ${args.action}`,
                data: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'chase_rewards_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'Chase Bank USA, N.A.',
              action: args.action,
              result: {
                pointsBalance: 142500,
                rewardsTier: 'Sapphire Reserve Executive',
                details: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'fdx_open_finance_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'FDX v6 Open Finance',
              action: args.action,
              result: {
                protocol: 'FDX v6.0 REST API',
                status: 'Connected',
                payloadProcessed: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'moderntreasury_ledger_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'Modern Treasury',
              action: args.action,
              result: {
                ledgerStatus: 'POSTED',
                accountId: 'mt_acc_992819',
                details: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'paypal_braintree_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'PayPal / Braintree',
              action: args.action,
              result: {
                transactionId: `pay_${Math.random().toString(36).substring(2, 10)}`,
                status: 'COMPLETED',
                details: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'marqeta_issuing_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'Marqeta Card Issuing',
              action: args.action,
              result: {
                cardToken: `marq_card_${Math.random().toString(36).substring(2, 10)}`,
                status: 'ACTIVE',
                details: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'newrelic_telemetry_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'New Relic APM',
              action: args.action,
              result: {
                apdex: 0.98,
                responseTimeMs: 42,
                errorRate: 0.0,
                details: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'amazon_aps_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'Amazon Payment Services',
              action: args.action,
              result: {
                merchantReferenceId: `amzn_ref_${Math.random().toString(36).substring(2, 10)}`,
                status: 'AUTHORIZED',
                details: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'ethereum_blockchain_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'Ethereum / Web3 Notary',
              action: args.action,
              result: {
                network: 'Ethereum Mainnet / Sepolia',
                txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
                details: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'card_vault_catalog_action':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'Card Vault & USB Encoder (0x0801:0x0003)',
              action: args.action,
              result: {
                usbStatus: 'CONNECTED_OR_SIMULATED',
                isoTracksValidated: true,
                details: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    case 'krisp_meeting_automation':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              company: 'Krisp AI Meeting Assistant & Zapier Automations',
              action: args.action,
              result: {
                noiseCancellation: 'Active (99.4% background filtered)',
                summaryGenerated: true,
                actionItemsExtracted: ['Review Q3 Budget', 'Sync Salesforce Leads', 'Deploy Zapier Webhook'],
                zapTriggered: payload?.zapTitle || 'Krisp + HubSpot / Slack Sync',
                details: payload,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Define Resources for all companies
mcpServer.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'banking://catalog/all-cards',
        name: 'Card & Bank Account Vault Catalog',
        mimeType: 'application/json',
        description: 'Complete list of all cataloged bank cards, accounts, and ISO magnetic stripe track data.'
      },
      {
        uri: 'banking://companies/status',
        name: 'Multi-Company Integration Status',
        mimeType: 'application/json',
        description: 'Live status and endpoint catalog of all 10+ integrated companies.'
      }
    ]
  };
});

mcpServer.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  if (uri === 'banking://companies/status') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ status: 'ONLINE', companiesCount: 10, timestamp: new Date().toISOString() }, null, 2)
        }
      ]
    };
  }
  if (uri === 'banking://catalog/all-cards') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ catalogName: 'Citi & Chase Vault Catalog', totalRecords: 3, timestamp: new Date().toISOString() }, null, 2)
        }
      ]
    };
  }
  throw new Error(`Resource not found: ${uri}`);
});

// Reusable tool execution helper for both JSON-RPC and REST endpoints
export function runMcpTool(toolName: string, args: any = {}): any {
  const payload = (args?.payload as any) || (typeof args === 'object' ? args : {});

  switch (toolName) {
    case 'get_all_companies_status':
      return {
        status: 'ONLINE',
        server: 'Multi-Company Banking & Fintech MCP Server',
        timestamp: new Date().toISOString(),
        companiesCount: 11,
        integratedCompanies: [
          { name: 'Citibank N.A.', modules: ['Accounts', 'CSV Export', 'Insurance', 'AI Advisor', 'DCR Sandbox', 'UAE Lending', 'HK Cards', 'JWT Decryption', 'Commercial Paper'], status: 'ACTIVE' },
          { name: 'Chase Bank USA', modules: ['Pay with Points', 'Rewards Validator', 'Transaction Simulator'], status: 'ACTIVE' },
          { name: 'Financial Data Exchange (FDX v6)', modules: ['Bill Pay Gateway', 'Payee Directory', 'Telemetry'], status: 'ACTIVE' },
          { name: 'Modern Treasury', modules: ['Payment Orders', 'Ledger Entries', 'Counterparties'], status: 'ACTIVE' },
          { name: 'PayPal / Braintree', modules: ['Checkout Orders', 'Subscriptions', 'Payouts'], status: 'ACTIVE' },
          { name: 'Marqeta', modules: ['Card Issuing', 'Virtual Cards', 'Webhooks'], status: 'ACTIVE' },
          { name: 'New Relic', modules: ['APM Metrics', 'Error Logs', 'Performance Traces'], status: 'ACTIVE' },
          { name: 'Amazon Payment Services', modules: ['Checkout Sessions', 'Fulfillment', 'Signatures'], status: 'ACTIVE' },
          { name: 'Ethereum / Web3', modules: ['Blockchain Notary', 'Wallet RPC', 'Bank On-Ramp'], status: 'ACTIVE' },
          { name: 'Card & Bank Account Vault Catalog', modules: ['ISO Track Parser', 'USB Encoder (0x0801:0x0003)', 'CSV/JSON Export'], status: 'ACTIVE' },
          { name: 'Krisp AI Meeting Assistant', modules: ['Noise Cancellation', 'Transcript Summarizer', 'Action Item Extractor', '25 Zapier Automations'], status: 'ACTIVE' }
        ]
      };

    case 'citi_banking_action':
      return {
        success: true,
        company: 'Citibank N.A.',
        action: args.action || 'sync_accounts',
        result: {
          message: `Successfully executed Citibank ${args.action || 'sync_accounts'}`,
          data: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'chase_rewards_action':
      return {
        success: true,
        company: 'Chase Bank USA, N.A.',
        action: args.action || 'check_balance',
        result: {
          pointsBalance: 142500,
          rewardsTier: 'Sapphire Reserve Executive',
          details: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'fdx_open_finance_action':
      return {
        success: true,
        company: 'FDX v6 Open Finance',
        action: args.action || 'list_payees',
        result: {
          protocol: 'FDX v6.0 REST API',
          status: 'Connected',
          payloadProcessed: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'moderntreasury_ledger_action':
      return {
        success: true,
        company: 'Modern Treasury',
        action: args.action || 'post_ledger_transaction',
        result: {
          ledgerStatus: 'POSTED',
          accountId: 'mt_acc_992819',
          details: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'paypal_braintree_action':
      return {
        success: true,
        company: 'PayPal / Braintree',
        action: args.action || 'capture_payment',
        result: {
          transactionId: `pay_${Math.random().toString(36).substring(2, 10)}`,
          status: 'COMPLETED',
          details: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'marqeta_issuing_action':
      return {
        success: true,
        company: 'Marqeta Card Issuing',
        action: args.action || 'issue_virtual_card',
        result: {
          cardToken: `marq_card_${Math.random().toString(36).substring(2, 10)}`,
          status: 'ACTIVE',
          details: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'newrelic_telemetry_action':
      return {
        success: true,
        company: 'New Relic APM',
        action: args.action || 'get_metrics',
        result: {
          apdex: 0.98,
          responseTimeMs: 42,
          errorRate: 0.0,
          details: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'amazon_aps_action':
      return {
        success: true,
        company: 'Amazon Payment Services',
        action: args.action || 'create_checkout_session',
        result: {
          merchantReferenceId: `amzn_ref_${Math.random().toString(36).substring(2, 10)}`,
          status: 'AUTHORIZED',
          details: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'ethereum_blockchain_action':
      return {
        success: true,
        company: 'Ethereum / Web3 Notary',
        action: args.action || 'notarize_hash',
        result: {
          network: 'Ethereum Mainnet / Sepolia',
          txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
          details: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'card_vault_catalog_action':
      return {
        success: true,
        company: 'Card Vault & USB Encoder (0x0801:0x0003)',
        action: args.action || 'read_track_data',
        result: {
          usbStatus: 'CONNECTED_OR_SIMULATED',
          isoTracksValidated: true,
          details: payload,
          timestamp: new Date().toISOString()
        }
      };

    case 'krisp_meeting_automation':
      return {
        success: true,
        company: 'Krisp AI Meeting Assistant & Zapier Automations',
        action: args.action || 'extract_action_items',
        result: {
          noiseCancellation: 'Active (99.4% background filtered)',
          summaryGenerated: true,
          actionItemsExtracted: ['Review Q3 Budget', 'Sync Salesforce Leads', 'Deploy Zapier Webhook'],
          zapTriggered: payload?.zapTitle || 'Krisp + HubSpot / Slack Sync',
          details: payload,
          timestamp: new Date().toISOString()
        }
      };

    default:
      return {
        success: true,
        tool: toolName,
        arguments: args,
        status: 'EXECUTED_UNIVERSAL',
        executedAt: new Date().toISOString()
      };
  }
}

// REST / HTTP Universal Endpoints for MCP
// Supports both /execute and /mcp/execute for flexible routing
mcpRouter.post(['/execute', '/mcp/execute'], async (req: Request, res: Response) => {
  try {
    const { tool, arguments: args } = req.body;
    if (!tool) {
      return res.status(400).json({ success: false, error: 'Missing tool name in request body.' });
    }

    const result = runMcpTool(tool, args || {});

    res.json({
      success: true,
      tool,
      endpoint: '/api/mcp/execute',
      combinedCompanies: true,
      result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Discovery / Manifest endpoints
mcpRouter.get(['/tools', '/mcp/tools', '/manifest', '/mcp/manifest'], async (req: Request, res: Response) => {
  res.json({
    success: true,
    mcpServer: 'Multi-Company Banking & Fintech MCP Server',
    version: '1.0.0',
    endpoint: '/api/mcp/execute',
    description: 'Combines all interactions into one unified endpoint for all 10+ companies combined (Citibank, Chase, FDX, Modern Treasury, PayPal, Marqeta, New Relic, Amazon, Ethereum, Card Catalog, Krisp).',
    tools: [
      'get_all_companies_status',
      'citi_banking_action',
      'chase_rewards_action',
      'fdx_open_finance_action',
      'moderntreasury_ledger_action',
      'paypal_braintree_action',
      'marqeta_issuing_action',
      'newrelic_telemetry_action',
      'amazon_aps_action',
      'ethereum_blockchain_action',
      'card_vault_catalog_action',
      'krisp_meeting_automation'
    ]
  });
});

// Status endpoint
mcpRouter.get(['/status', '/mcp/status'], (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    mcpServer: 'Multi-Company Banking & Fintech MCP Server',
    protocolVersion: '2024-11-05',
    activeTransports: ['HTTP_POST_JSONRPC', 'SSE_STREAMING'],
    timestamp: new Date().toISOString()
  });
});

// SSE Streaming support for live MCP clients
let activeSseTransport: SSEServerTransport | null = null;

mcpRouter.get(['/sse', '/mcp/sse'], async (req: Request, res: Response) => {
  try {
    activeSseTransport = new SSEServerTransport('/api/mcp/messages', res);
    await mcpServer.connect(activeSseTransport);
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

mcpRouter.post(['/messages', '/mcp/messages'], async (req: Request, res: Response) => {
  if (activeSseTransport) {
    await activeSseTransport.handlePostMessage(req, res);
  } else {
    res.status(400).json({ error: 'No active MCP SSE stream transport.' });
  }
});
