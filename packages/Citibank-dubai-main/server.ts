import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for accepting loan offer
  app.post("/api/accept-offer", async (req, res) => {
    try {
      const bearerToken = process.env.CITI_BEARER_TOKEN;
      const uuid = process.env.CITI_UUID;
      
      if (!bearerToken) {
        return res.status(400).json({ error: "CITI_BEARER_TOKEN is not configured in the environment variables." });
      }

      if (!uuid) {
        return res.status(400).json({ error: "CITI_UUID is not configured in the environment variables." });
      }

      const response = await fetch("https://partner.citi.com/gcgapi/sandbox/prod/openapi/v1/emea/onboarding/applications/ZOW9IO793859/offerAcceptance", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
          "client_id": "8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI",
          "uuid": uuid
        },
        body: JSON.stringify({
          "requestedProductConfirmation": [
            {
              "productCode": "MC450",
              "sourceCode": "0W01N500",
              "loanSpecificSelection": {
                "loanAmount": 10000,
                "pricingPlanId": "GOLD"
              },
              "creditSpecificSelection": {
                "requestedCreditLimit": 20000
              }
            }
          ],
          "controlFlowId": "55756e365150554e366f636a5a5463717775324c74787137547233616e4d56766e3978746236794a5a796f3d"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: `API call failed with status ${response.status}`, 
          details: errorText 
        });
      }

      const data = await response.json();
      res.json(data);

    } catch (error: any) {
      console.error("Error making API call:", error);
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
