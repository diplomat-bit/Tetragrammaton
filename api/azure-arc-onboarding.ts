import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { quickbooksBridgeLedger, recordBridgeEvent } from './intuit/quickbooks-bridge.js';

export const azureArcRouter = Router();

// HARDCODED AZURE ARC ONBOARDING PARAMETERS
export const AZURE_ARC_HARDCODED_CONFIG = {
  SUBSCRIPTION_ID: '0001726b-15a4-4c12-b0d0-16971405fa7d',
  RESOURCE_GROUP: 'james-rg',
  TENANT_ID: '6666f090-016a-494b-b11a-4d3e01febe95',
  LOCATION: 'eastus',
  AUTH_TYPE: 'token',
  CORRELATION_ID: '176a1b5b-86ef-4921-8fa5-4d4b4225c9f1',
  CLOUD: 'AzureCloud',
  TAGS: "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'",
  DATACENTER_TAG: 'James@citibankdemobusiness.com',
  CONTROL_ACCOUNT: 'citibank; control account number 05329451; balance $532,000,000',
  AUTOMANAGE_PROFILE: '/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction',
  PACKAGE_URI: 'https://aka.ms/azcmagent',
  PACKAGE_URI_WINDOWS: 'https://aka.ms/azcmagent-windows',
  LOG_ENDPOINT: 'https://gbl.his.arc.azure.com/log',
  SCRIPT_NAME_LINUX: 'install_linux_azcmagent.sh',
  SCRIPT_NAME_WINDOWS: 'install_windows_azcmagent.ps1',
};

// Exact PowerShell Onboarding Script
export const RAW_POWERSHELL_ARC_SCRIPT = `try {
    $env:SUBSCRIPTION_ID = "0001726b-15a4-4c12-b0d0-16971405fa7d";
    $env:RESOURCE_GROUP = "james-rg";
    $env:TENANT_ID = "6666f090-016a-494b-b11a-4d3e01febe95";
    $env:LOCATION = "eastus";
    $env:AUTH_TYPE = "token";
    $env:CORRELATION_ID = "176a1b5b-86ef-4921-8fa5-4d4b4225c9f1";
    $env:CLOUD = "AzureCloud";
    

    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor 3072;

    # Download the installation package
    Invoke-WebRequest -UseBasicParsing -Uri "https://aka.ms/azcmagent-windows" -TimeoutSec 30 -OutFile "$env:TEMP\\install_windows_azcmagent.ps1";

    # Install the hybrid agent
    & "$env:TEMP\\install_windows_azcmagent.ps1";
    if ($LASTEXITCODE -ne 0) { exit 1; }

    # Run connect command
    & "$env:ProgramW6432\\AzureConnectedMachineAgent\\azcmagent.exe" connect --resource-group "$env:RESOURCE_GROUP" --tenant-id "$env:TENANT_ID" --location "$env:LOCATION" --subscription-id "$env:SUBSCRIPTION_ID" --cloud "$env:CLOUD" --tags "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'" --automanage-profile "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction" --correlation-id "$env:CORRELATION_ID";
}
catch {
    $logBody = @{subscriptionId="$env:SUBSCRIPTION_ID";resourceGroup="$env:RESOURCE_GROUP";tenantId="$env:TENANT_ID";location="$env:LOCATION";correlationId="$env:CORRELATION_ID";authType="$env:AUTH_TYPE";operation="onboarding";messageType=$_.FullyQualifiedErrorId;message="$_";};
    Invoke-WebRequest -UseBasicParsing -Uri "https://gbl.his.arc.azure.com/log" -Method "PUT" -Body ($logBody | ConvertTo-Json) | out-null;
    Write-Host  -ForegroundColor red $_.Exception;
}`;

// Exact Bash Onboarding Script for Linux
export const RAW_BASH_ARC_SCRIPT = `export subscriptionId="0001726b-15a4-4c12-b0d0-16971405fa7d";
export resourceGroup="james-rg";
export tenantId="6666f090-016a-494b-b11a-4d3e01febe95";
export location="eastus";
export authType="token";
export correlationId="176a1b5b-86ef-4921-8fa5-4d4b4225c9f1";
export cloud="AzureCloud";
output=$(wget https://aka.ms/azcmagent -O ~/install_linux_azcmagent.sh 2>&1);
if [ $? != 0 ]; then wget -qO- --method=PUT --body-data="{\\"subscriptionId\\":\\"$subscriptionId\\",\\"resourceGroup\\":\\"$resourceGroup\\",\\"tenantId\\":\\"$tenantId\\",\\"location\\":\\"$location\\",\\"correlationId\\":\\"$correlationId\\",\\"authType\\":\\"$authType\\",\\"operation\\":\\"onboarding\\",\\"messageType\\":\\"DownloadScriptFailed\\",\\"message\\":\\"$output\\"}" "https://gbl.his.arc.azure.com/log" &> /dev/null || true; fi;
echo "$output";
bash ~/install_linux_azcmagent.sh;
sudo azcmagent connect --resource-group "$resourceGroup" --tenant-id "$tenantId" --location "$location" --subscription-id "$subscriptionId" --cloud "$cloud" --tags "Datacenter=James@citibankdemobusiness.com,City=localhost:,StateOrDistrict=ALL,CountryOrRegion=ALL,'james ocallaghan'='citibank; control account number 05329451; balance $532,000,000'" --automanage-profile "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction" --correlation-id "$correlationId";
`;

// In-memory log of agent onboarding telemetry & states
let onboardingEvents: any[] = [
  {
    id: 'ARC-EVENT-INIT-01',
    subscriptionId: AZURE_ARC_HARDCODED_CONFIG.SUBSCRIPTION_ID,
    resourceGroup: AZURE_ARC_HARDCODED_CONFIG.RESOURCE_GROUP,
    tenantId: AZURE_ARC_HARDCODED_CONFIG.TENANT_ID,
    location: AZURE_ARC_HARDCODED_CONFIG.LOCATION,
    correlationId: AZURE_ARC_HARDCODED_CONFIG.CORRELATION_ID,
    authType: AZURE_ARC_HARDCODED_CONFIG.AUTH_TYPE,
    cloud: AZURE_ARC_HARDCODED_CONFIG.CLOUD,
    datacenterTag: 'James@citibankdemobusiness.com',
    status: 'READY_FOR_DEPLOYMENT',
    agentVersion: '1.45.02891.1092',
    timestamp: new Date().toISOString(),
    details: 'Azure Arc Connected Machine Agent pre-configured for automated onboarding on james-rg in eastus',
  }
];

/**
 * GET /api/azure/arc/config
 * Returns all hardcoded parameters and scripts
 */
azureArcRouter.get('/config', (req: Request, res: Response) => {
  res.json({
    success: true,
    hardcoded: AZURE_ARC_HARDCODED_CONFIG,
    powershellScript: RAW_POWERSHELL_ARC_SCRIPT,
    bashScript: RAW_BASH_ARC_SCRIPT,
    events: onboardingEvents,
    serverTimestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/azure/arc/download/powershell
 * Downloads install_windows_azcmagent.ps1
 */
azureArcRouter.get('/download/powershell', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="install_windows_azcmagent.ps1"');
  res.send(RAW_POWERSHELL_ARC_SCRIPT);
});

/**
 * GET /api/azure/arc/download/bash
 * Downloads install_linux_azcmagent.sh
 */
azureArcRouter.get('/download/bash', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/x-shellscript; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="install_linux_azcmagent.sh"');
  res.send(RAW_BASH_ARC_SCRIPT);
});

/**
 * POST /api/azure/arc/onboard
 * Real Azure Arc Connected Machine Agent enrollment via Azure REST API
 */
azureArcRouter.post('/onboard', async (req: Request, res: Response) => {
  try {
    const { 
      machineName = 'WIN-AZURE-JAMES01', 
      operatingSystem = 'Windows Server 2022 Datacenter',
      subscriptionId = AZURE_ARC_HARDCODED_CONFIG.SUBSCRIPTION_ID,
      resourceGroup = AZURE_ARC_HARDCODED_CONFIG.RESOURCE_GROUP,
      location = AZURE_ARC_HARDCODED_CONFIG.LOCATION,
      tenantId = AZURE_ARC_HARDCODED_CONFIG.TENANT_ID
    } = req.body;

    const authHeader = req.headers.authorization || (process.env.AZURE_ACCESS_TOKEN ? `Bearer ${process.env.AZURE_ACCESS_TOKEN}` : '');

    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No Azure Access Token available. Provide one via Authorization header or AZURE_ACCESS_TOKEN.' });
    }

    const payload = {
      location,
      identity: {
        type: 'SystemAssigned'
      },
      properties: {
        osProfile: {
          computerName: machineName,
          windowsConfiguration: {
            assessmentMode: 'AutomaticByPlatform',
            patchSettings: {
              patchMode: 'AutomaticByPlatform',
              assessmentMode: 'AutomaticByPlatform'
            }
          }
        },
        clientPublicKey: crypto.randomBytes(32).toString('base64')
      }
    };

    const azureUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.HybridCompute/machines/${machineName}?api-version=2024-07-10`;

    const azureRes = await fetch(azureUrl, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await azureRes.json().catch(() => null);

    if (azureRes.ok) {
      // Record into QuickBooks bridge ledger as infrastructure asset link
      try {
        recordBridgeEvent({
          source: 'UNIVERSAL_INGEST',
          action: 'AZURE_ARC_AGENT_CONNECTED',
          externalEntityId: data?.id || `ARC-RUN-${Date.now()}`,
          amount: 0,
          currency: 'USD',
          status: 'LOCKED_INTO_QUICKBOOKS',
          summary: `Azure Arc Hybrid Connected Machine Agent Onboarded: ${machineName} in ${resourceGroup} (Tenant: ${tenantId})`,
          rawPayload: data,
        });
      } catch (bridgeErr: any) {
        console.warn('QuickBooks Bridge event record notice:', bridgeErr.message);
      }
    }

    res.status(azureRes.status).json({
      success: azureRes.ok,
      message: azureRes.ok ? `Azure Arc Connected Machine Agent successfully connected machine [${machineName}] to ${resourceGroup}!` : `Failed to onboard machine to Azure`,
      event: data,
      rawResponse: data
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/azure/arc/log-telemetry
 * Proxy for Azure Arc Error Telemetry endpoint (https://gbl.his.arc.azure.com/log)
 */
azureArcRouter.post('/log-telemetry', async (req: Request, res: Response) => {
  try {
    const {
      subscriptionId = AZURE_ARC_HARDCODED_CONFIG.SUBSCRIPTION_ID,
      resourceGroup = AZURE_ARC_HARDCODED_CONFIG.RESOURCE_GROUP,
      tenantId = AZURE_ARC_HARDCODED_CONFIG.TENANT_ID,
      location = AZURE_ARC_HARDCODED_CONFIG.LOCATION,
      correlationId = AZURE_ARC_HARDCODED_CONFIG.CORRELATION_ID,
      authType = AZURE_ARC_HARDCODED_CONFIG.AUTH_TYPE,
      operation = 'onboarding',
      messageType = 'SimulatedTestLog',
      message = 'Azure Arc telemetry ping from QuickBooks-Citi Bridge Hub',
    } = req.body;

    const logBody = {
      subscriptionId,
      resourceGroup,
      tenantId,
      location,
      correlationId,
      authType,
      operation,
      messageType,
      message,
      timestamp: new Date().toISOString(),
    };

    // Forward to Azure Arc Telemetry API if reachable
    try {
      await fetch(AZURE_ARC_HARDCODED_CONFIG.LOG_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logBody),
      });
    } catch {
      // Ignore network errors on public Azure arc log endpoint
    }

    res.json({
      success: true,
      forwardedTo: AZURE_ARC_HARDCODED_CONFIG.LOG_ENDPOINT,
      payload: logBody,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
