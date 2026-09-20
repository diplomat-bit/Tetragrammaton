import { Router, Request, Response } from 'express';
import { 
  Configuration, 
  PlaidApi, 
  PlaidEnvironments, 
  Products, 
  CountryCode,
  ProcessorTokenCreateRequestProcessorEnum
} from 'plaid';

export const plaidApiRouter = Router();

// In-memory dynamic processor token store with environment fallback
let dynamicPlaidProcessorToken: string = process.env.PLAID_PROCESSOR_TOKEN || '';

export function getActiveProcessorToken(): string {
  return (dynamicPlaidProcessorToken || process.env.PLAID_PROCESSOR_TOKEN || '').trim();
}

export function setActiveProcessorToken(token: string): void {
  dynamicPlaidProcessorToken = (token || '').trim();
  process.env.PLAID_PROCESSOR_TOKEN = dynamicPlaidProcessorToken;
}

const getPlaidClient = () => {
  const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || '';
  const PLAID_SECRET = process.env.PLAID_SECRET || '';
  const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

  if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
    console.error('CRITICAL: Plaid credentials missing in environment.');
  }

  const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
      },
    },
  });

  return new PlaidApi(configuration);
};

// 1. Create Link Token
plaidApiRouter.post('/create-link-token', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const plaidClient = getPlaidClient();
    
    const request = {
      user: { client_user_id: userId || 'user-id' },
      client_name: 'Kronos Apex Financial',
      products: [Products.Auth],
      country_codes: [CountryCode.Us],
      language: 'en',
    };

    const response = await plaidClient.linkTokenCreate(request as any);
    res.json(response.data);
  } catch (error: any) {
    console.error('Plaid Link Token Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// 2. Exchange Public Token
plaidApiRouter.post('/exchange-public-token', async (req: Request, res: Response) => {
  try {
    const { publicToken } = req.body;
    const plaidClient = getPlaidClient();
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('Plaid Token Exchange Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// 3. Create Processor Token for Modern Treasury
plaidApiRouter.post('/create-processor-token', async (req: Request, res: Response) => {
  try {
    const { accessToken, accountId, processor = 'modern_treasury' } = req.body;
    
    if (!accessToken || !accountId) {
      return res.status(400).json({ error: 'accessToken and accountId are required' });
    }

    const plaidClient = getPlaidClient();
    const response = await plaidClient.processorTokenCreate({
      access_token: accessToken,
      account_id: accountId,
      processor: processor as ProcessorTokenCreateRequestProcessorEnum,
    });

    if (response.data?.processor_token) {
      setActiveProcessorToken(response.data.processor_token);
    }

    res.json({
      ...response.data,
      activeProcessorToken: getActiveProcessorToken(),
      persistedInSession: true,
    });
  } catch (error: any) {
    console.error('Plaid Processor Token Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// 4. Fetch Account Data via Processor Token (Transparency/Verify)
plaidApiRouter.post('/processor/auth/get', async (req: Request, res: Response) => {
  try {
    const { processorToken } = req.body;
    const effectiveToken = (processorToken || getActiveProcessorToken()).trim();
    if (!effectiveToken) {
      return res.status(400).json({ error: 'processorToken is required or must be active in session' });
    }

    const plaidClient = getPlaidClient();
    const response = await plaidClient.processorAuthGet({
      processor_token: effectiveToken,
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('Plaid Processor Auth Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// 5. Get Active Dynamically Saved Processor Token across sessions
plaidApiRouter.get('/active-processor-token', (req: Request, res: Response) => {
  const token = getActiveProcessorToken();
  res.json({
    success: true,
    processorToken: token,
    isSet: Boolean(token),
    source: dynamicPlaidProcessorToken ? 'DYNAMIC_MEMORY' : (process.env.PLAID_PROCESSOR_TOKEN ? 'ENVIRONMENT_VARIABLE' : 'UNSET'),
    updatedAt: new Date().toISOString(),
  });
});

// 6. Set/Save Active Processor Token Dynamically
plaidApiRouter.post('/active-processor-token', (req: Request, res: Response) => {
  const { processorToken } = req.body || {};
  if (typeof processorToken === 'string') {
    setActiveProcessorToken(processorToken);
  }
  const token = getActiveProcessorToken();
  res.json({
    success: true,
    processorToken: token,
    isSet: Boolean(token),
    message: token ? 'Active Plaid Processor Token dynamically persisted for session traversal.' : 'Active Processor Token cleared.',
    updatedAt: new Date().toISOString(),
  });
});

// 7. Delete Active Processor Token
plaidApiRouter.delete('/active-processor-token', (req: Request, res: Response) => {
  setActiveProcessorToken('');
  res.json({
    success: true,
    processorToken: '',
    isSet: false,
    message: 'Active Processor Token cleared from runtime memory and environment.',
  });
});
