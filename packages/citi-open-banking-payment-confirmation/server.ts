import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Default server environment config endpoint
  app.get("/api/open-banking/config", (req, res) => {
    res.json({
      hasEnvToken: Boolean(process.env.CITI_OPEN_BANKING_ACCESS_TOKEN),
      envToken: process.env.CITI_OPEN_BANKING_ACCESS_TOKEN || "",
      financialId: process.env.CITI_FINANCIAL_ID || "citi-sandbox-fid-001",
      baseUrl: process.env.CITI_BASE_URL || "https://partner.citi.com/gcgapi/sandbox/prod/openapi/open-banking/v3.1",
    });
  });

  // Proxy endpoint for Open Banking requests
  app.post("/api/open-banking/proxy", async (req, res) => {
    const { url, method = "POST", headers = {}, body, simulationMode = false } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Missing required 'url' parameter" });
    }

    const startTime = Date.now();

    // If simulation mode is active or user explicitly chose mock
    if (simulationMode) {
      const mockResult = generateSimulationResponse(url, method, headers, body);
      const responseTimeMs = Date.now() - startTime;
      return res.status(mockResult.status).json({
        ...mockResult,
        responseTimeMs,
        simulated: true,
      });
    }

    try {
      // Clean headers - don't forward host or connection
      const requestHeaders: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": "application/json",
      };

      if (headers["authorization"] || headers["Authorization"]) {
        requestHeaders["Authorization"] = headers["authorization"] || headers["Authorization"];
      }
      if (headers["x-fapi-financial-id"] || headers["X-Fapi-Financial-Id"]) {
        requestHeaders["x-fapi-financial-id"] = headers["x-fapi-financial-id"] || headers["X-Fapi-Financial-Id"];
      }
      if (headers["x-fapi-customer-ip-address"]) {
        requestHeaders["x-fapi-customer-ip-address"] = headers["x-fapi-customer-ip-address"];
      }
      if (headers["x-fapi-interaction-id"]) {
        requestHeaders["x-fapi-interaction-id"] = headers["x-fapi-interaction-id"];
      } else {
        requestHeaders["x-fapi-interaction-id"] = `citi-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      }

      // Add any additional custom headers provided
      Object.entries(headers).forEach(([key, val]) => {
        if (typeof val === "string" && !requestHeaders[key] && !["host", "connection", "content-length"].includes(key.toLowerCase())) {
          requestHeaders[key] = val;
        }
      });

      const fetchOptions: RequestInit = {
        method: method.toUpperCase(),
        headers: requestHeaders,
      };

      if (method.toUpperCase() !== "GET" && method.toUpperCase() !== "HEAD" && body) {
        fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout
      fetchOptions.signal = controller.signal;

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const responseTimeMs = Date.now() - startTime;
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        responseHeaders[key] = val;
      });

      let responseData: any = null;
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }

      return res.status(200).json({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: responseHeaders,
        data: responseData,
        rawText: text,
        responseTimeMs,
        simulated: false,
      });
    } catch (err: any) {
      const responseTimeMs = Date.now() - startTime;
      const isAbort = err.name === "AbortError";

      // If live connection fails (e.g. sandbox endpoint unreachable or network error),
      // we provide helpful diagnostic message and optionally simulated fallback flag
      return res.status(502).json({
        status: 502,
        statusText: "Proxy Gateway Error",
        error: isAbort ? "Request timed out after 20 seconds" : err.message,
        message: "Failed to connect to the Open Banking endpoint. You can test using Sandbox Simulation mode or verify your token, Financial ID, and endpoint URL.",
        responseTimeMs,
        simulated: false,
      });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Open Banking Server running on http://localhost:${PORT}`);
  });
}

/**
 * High-fidelity Citi Open Banking Simulation Generator
 */
function generateSimulationResponse(url: string, method: string, headers: any, body: any) {
  const token = headers["Authorization"] || headers["authorization"] || "";
  const fid = headers["x-fapi-financial-id"] || headers["X-Fapi-Financial-Id"] || "citi-sandbox-fid-001";
  
  // Extract debtor account from body if provided
  let debtorName = "James";
  let identification = "GB29CITI60161331926819";
  let schemeName = "UK.OBIE.BBAN";
  let secondaryId = "ROLL-882910";

  if (body) {
    let parsedBody = typeof body === "string" ? null : body;
    if (typeof body === "string") {
      try { parsedBody = JSON.parse(body); } catch {}
    }
    if (parsedBody?.Data?.DebtorAccount) {
      const da = parsedBody.Data.DebtorAccount;
      if (da.Name) debtorName = da.Name;
      if (da.Identification) identification = da.Identification;
      if (da.SchemeName) schemeName = da.SchemeName;
      if (da.SecondaryIdentification) secondaryId = da.SecondaryIdentification;
    }
  }

  const now = new Date();
  const consentId = `citi-consent-${Math.floor(100000 + Math.random() * 900000)}`;
  const confirmationNumber = `CONF-${Math.floor(10000000 + Math.random() * 90000000)}`;
  
  const creationDateTime = now.toISOString();
  const expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const expirationDateTime = expiryDate.toISOString();

  // If this is a GET on a self-url or consent URL
  if (method.toUpperCase() === "GET" || url.includes("/funds-confirmation-consents/")) {
    const existingConsentMatch = url.match(/funds-confirmation-consents\/([a-zA-Z0-9_-]+)/);
    const resolvedConsentId = existingConsentMatch ? existingConsentMatch[1] : consentId;
    
    // Determine realistic balance for this account
    const availableAmount = (14250.75).toFixed(2);
    const bookedAmount = (15600.00).toFixed(2);

    return {
      status: 200,
      statusText: "OK",
      ok: true,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-fapi-interaction-id": `citi-resp-${Date.now()}`,
        "x-fapi-financial-id": fid,
      },
      data: {
        Data: {
          ConsentId: resolvedConsentId,
          CreationDateTime: creationDateTime,
          Status: "Authorised",
          StatusUpdateDateTime: creationDateTime,
          ExpirationDateTime: expirationDateTime,
          DebtorAccount: {
            SchemeName: schemeName,
            Identification: identification,
            Name: debtorName,
            SecondaryIdentification: secondaryId,
          },
          // Extended Open Banking Balance Info
          AccountBalance: {
            AccountId: `ACC-${identification.slice(-6)}`,
            Currency: "GBP",
            AvailableBalance: {
              Amount: availableAmount,
              Currency: "GBP",
              CreditDebitIndicator: "Credit",
              Type: "InterimAvailable",
              DateTime: creationDateTime,
            },
            BookedBalance: {
              Amount: bookedAmount,
              Currency: "GBP",
              CreditDebitIndicator: "Credit",
              Type: "ClosingBooked",
              DateTime: creationDateTime,
            },
            AccountType: "Personal Current Account",
            AccountStatus: "Enabled",
          },
        },
        Links: {
          Self: `https://partner.citi.com/open-banking/v3.1/cbpii/funds-confirmation-consents/${confirmationNumber}`,
          Balances: `https://partner.citi.com/open-banking/v3.1/aisp/accounts/ACC-${identification.slice(-6)}/balances`,
        },
        Meta: {
          TotalPages: 1,
          FirstAvailableDateTime: creationDateTime,
        },
      },
    };
  }

  // If this is a POST to funds-confirmations (checking if amount is available)
  if (url.includes("/funds-confirmations") && method.toUpperCase() === "POST") {
    let instructedAmount = "500.00";
    let currency = "GBP";
    if (body) {
      let parsed = typeof body === "string" ? null : body;
      if (typeof body === "string") {
        try { parsed = JSON.parse(body); } catch {}
      }
      if (parsed?.Data?.InstructedAmount) {
        instructedAmount = parsed.Data.InstructedAmount.Amount || "500.00";
        currency = parsed.Data.InstructedAmount.Currency || "GBP";
      }
    }

    const isAvailable = parseFloat(instructedAmount) <= 14250.75;

    return {
      status: 201,
      statusText: "Created",
      ok: true,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-fapi-interaction-id": `citi-resp-${Date.now()}`,
        "x-fapi-financial-id": fid,
      },
      data: {
        Data: {
          FundsConfirmationId: `fc-${Math.floor(100000 + Math.random() * 900000)}`,
          ConsentId: consentId,
          CreationDateTime: creationDateTime,
          FundsAvailable: isAvailable,
          InstructedAmount: {
            Amount: instructedAmount,
            Currency: currency,
          },
          Reference: `CBPII-VERIF-${Date.now()}`,
        },
        Links: {
          Self: `https://partner.citi.com/open-banking/v3.1/cbpii/funds-confirmations/${confirmationNumber}`,
        },
      },
    };
  }

  // Default POST /funds-confirmation-consents (matching user's exact specification)
  return {
    status: 201,
    statusText: "Created",
    ok: true,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-fapi-interaction-id": `citi-resp-${Date.now()}`,
      "x-fapi-financial-id": fid,
    },
    data: {
      Data: {
        ConsentId: consentId,
        CreationDateTime: creationDateTime,
        Status: "AwaitingAuthorisation",
        ExpirationDateTime: expirationDateTime,
        DebtorAccount: {
          SchemeName: schemeName,
          Identification: identification,
          Name: debtorName,
          SecondaryIdentification: secondaryId,
        },
        // Also include the realistic calculated balance representation for rendering
        AccountBalance: {
          AccountId: `ACC-${identification.slice(-6)}`,
          Currency: "GBP",
          AvailableBalance: {
            Amount: "14250.75",
            Currency: "GBP",
            CreditDebitIndicator: "Credit",
            Type: "InterimAvailable",
            DateTime: creationDateTime,
          },
          BookedBalance: {
            Amount: "15600.00",
            Currency: "GBP",
            CreditDebitIndicator: "Credit",
            Type: "ClosingBooked",
            DateTime: creationDateTime,
          },
          AccountType: "Personal Checking Account",
          AccountStatus: "Enabled",
        },
      },
      Links: {
        Self: `https://partner.citi.com/open-banking/v3.1/cbpii/funds-confirmation-consents/${confirmationNumber}`,
        Balances: `https://partner.citi.com/open-banking/v3.1/aisp/accounts/ACC-${identification.slice(-6)}/balances`,
      },
      Meta: {
        TotalPages: 1,
        FirstAvailableDateTime: creationDateTime,
      },
    },
  };
}

startServer();
