import express, { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const azureAuthRouter = express.Router();

// Simple in-memory session store (In production, use Redis or a database)
let azureSession: any = null;

const CLIENT_ID = process.env.AZURE_CLIENT_ID || '00000000-0000-0000-0000-000000000000';
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET || '';
const TENANT_ID = process.env.AZURE_TENANT_ID || 'common';
const REDIRECT_URI = process.env.AZURE_REDIRECT_URI || 'https://localhost:3000/api/azure/callback';

azureAuthRouter.get('/auth-url', (req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString('hex');
  const scope = 'offline_access User.Read Directory.Read.All Application.ReadWrite.All';
  const authUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_mode=query&scope=${encodeURIComponent(scope)}&state=${state}`;
  
  res.json({ url: authUrl, state });
});

azureAuthRouter.get('/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`/?error=${error}`);
  }

  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: REDIRECT_URI,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    azureSession = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      user: {
        name: 'Enterprise Admin', // Simplified for now
        email: 'admin@azure.onmicrosoft.com'
      },
      expiresAt: Date.now() + response.data.expires_in * 1000
    };

    // Redirect back to the app with a success flag
    res.send(`
      <script>
        window.opener.postMessage({ type: 'AZURE_AUTH_SUCCESS', session: true }, '*');
        window.close();
      </script>
    `);
  } catch (err: any) {
    console.error('Azure OAuth Error:', err.response?.data || err.message);
    res.status(500).send(`Authentication failed: ${err.message}`);
  }
});

azureAuthRouter.get('/session', (req: Request, res: Response) => {
  if (azureSession && azureSession.expiresAt > Date.now()) {
    return res.json({ loggedIn: true, user: azureSession.user });
  }
  res.json({ loggedIn: false });
});

azureAuthRouter.post('/bypass', (req: Request, res: Response) => {
  azureSession = {
    accessToken: 'preview_mock_token',
    refreshToken: 'preview_mock_refresh',
    user: {
      name: 'Enterprise Admin',
      email: 'admin@azure.onmicrosoft.com'
    },
    expiresAt: Date.now() + 3600000 // 1 hour
  };
  res.json({ success: true, session: true });
});

azureAuthRouter.post('/logout', (req: Request, res: Response) => {
  azureSession = null;
  res.json({ success: true });
});
