import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/payees", async (req, res) => {
    try {
      const token = process.env.CITI_API_TOKEN;
      const actorType = process.env.FDX_API_ACTOR_TYPE || 'USER';
      const recipientId = process.env.FDX_API_DATA_RECIPIENT_ID;
      const interactionId = process.env.X_FAPI_INTERACTION_ID;

      if (!token || !recipientId || !interactionId) {
         return res.status(400).json({ 
           error: "Missing required environment variables. Please add CITI_API_TOKEN, FDX_API_DATA_RECIPIENT_ID, and X_FAPI_INTERACTION_ID to your Secrets." 
         });
      }

      const startTime = Date.now();
      const response = await fetch('https://partner.citi.com/gcgapi/sandbox/prod/api/billmgmt/billpay/v2/fdx/v6/payees', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'FDX-API-Actor-Type': actorType,
          'FDX-API-Data-Recipient-Id': recipientId,
          'x-fapi-interaction-id': interactionId
        }
      });

      const data = await response.json();
      const latency = Date.now() - startTime;

      res.json({ 
        data, 
        telemetry: { 
          latency, 
          status: response.status, 
          timestamp: new Date().toLocaleTimeString() 
        } 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.get("/api/payments", async (req, res) => {
    try {
      const token = process.env.CITI_API_TOKEN;
      const actorType = process.env.FDX_API_ACTOR_TYPE || 'USER';
      const recipientId = process.env.FDX_API_DATA_RECIPIENT_ID;
      const interactionId = process.env.X_FAPI_INTERACTION_ID;

      if (!token || !recipientId || !interactionId) {
         return res.status(400).json({ 
           error: "Missing required environment variables. Please add CITI_API_TOKEN, FDX_API_DATA_RECIPIENT_ID, and X_FAPI_INTERACTION_ID to your Secrets." 
         });
      }

      const startTime = Date.now();
      const response = await fetch('https://partner.citi.com/gcgapi/sandbox/prod/api/billmgmt/billpay/v2/fdx/v6/payments', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'FDX-API-Actor-Type': actorType,
          'FDX-API-Data-Recipient-Id': recipientId,
          'x-fapi-interaction-id': interactionId
        }
      });

      const data = await response.json();
      const latency = Date.now() - startTime;

      res.json({ 
        data, 
        telemetry: { 
          latency, 
          status: response.status, 
          timestamp: new Date().toLocaleTimeString() 
        } 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
