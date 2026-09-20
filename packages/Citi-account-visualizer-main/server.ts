import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock Citi accounts response data matching user prompt
const MOCK_CITI_RESPONSE = {
  "accountGroupSummary": [
    {
      "accountGroup": "CREDIT_CARD",
      "accounts": [
        {
          "creditCardAccountSummary": {
            "productName": "VISA GOLD",
            "productCode": "0071_VC898",
            "displayAccountNumber": "4765",
            "currencyCode": "AUD",
            "accountId": "cc_aus_01",
            "accountClassification": "LIABILITY",
            "accountStatus": "ACTIVE",
            "outstandingBalance": 0,
            "availableCredit": 25613.63,
            "creditLimit": 698000,
            "minimumDueAmount": 0,
            "alternateCurrencyCurrentBalance": 0,
            "cardHolderType": "PRIMARY"
          }
        }
      ],
      "totalAvailableBalance": {
        "localCurrencyCode": "HKD",
        "localCurrencyBalanceAmount": 0,
        "foreignCurrencyCode": "USD",
        "foreignCurrencyBalanceAmount": 88694.748
      },
      "totalOutstandingBalance": {
        "localCurrencyCode": "HKD",
        "localCurrencyBalanceAmount": 0,
        "foreignCurrencyCode": "USD",
        "foreignCurrencyBalanceAmount": 0
      }
    },
    {
      "accountGroup": "LOANS",
      "accounts": [
        {
          "loanAccountSummary": {
            "productName": "CITIBANK MORTGAGE POWER PLAN 2",
            "productCode": "0302_RPI0",
            "displayAccountNumber": "8645",
            "accountId": "loan_hk_02",
            "currencyCode": "HKD",
            "accountClassification": "LIABILITY",
            "accountStatus": "DELINQUENT",
            "originalPrincipalAmount": 1000000,
            "outstandingBalance": 1000000,
            "nextPaymentAmount": 0,
            "nextPaymentDate": "9999-12-31"
          }
        }
      ],
      "totalOutstandingBalance": {
        "localCurrencyCode": "HKD",
        "localCurrencyBalanceAmount": 5596000,
        "foreignCurrencyCode": "USD",
        "foreignCurrencyBalanceAmount": 714687.09
      }
    },
    {
      "accountGroup": "SAVINGS_AND_INVESTMENTS",
      "accounts": [
        {
          "savingsAccountSummary": {
            "productName": "SAVINGS",
            "productCode": "0101_SATHB",
            "displayAccountNumber": "3225",
            "accountId": "d3508kR20tSKak",
            "currencyCode": "HKD",
            "accountClassification": "ASSET",
            "accountStatus": "NO_DEBIT_ACTIVITY",
            "currentBalance": 9743468.24,
            "availableBalance": 9743468.24,
            "localCurrencyCurrentBalance": 9743468.24
          }
        }
      ],
      "totalCurrentBalance": {
        "localCurrencyCode": "HKD",
        "localCurrencyBalanceAmount": 55898018.57,
        "foreignCurrencyCode": "USD",
        "foreignCurrencyBalanceAmount": 7169800.78
      },
      "totalAvailableBalance": {
        "localCurrencyCode": "HKD",
        "localCurrencyBalanceAmount": 14848815.514,
        "foreignCurrencyCode": "USD",
        "foreignCurrencyBalanceAmount": 1896400.453
      }
    },
    {
      "accountGroup": "CHECKING",
      "accounts": [
        {
          "checkingAccountSummary": {
            "productName": "HKD CHECKING ACCOUNT",
            "productCode": "0001_HKCA",
            "displayAccountNumber": "9854",
            "accountId": "chk_hk_04",
            "currencyCode": "HKD",
            "accountClassification": "ASSET",
            "accountStatus": "NO_DEBIT_ACTIVITY",
            "currentBalance": -117.76,
            "availableBalance": -117.76,
            "localCurrencyCurrentBalance": -117.76
          }
        }
      ],
      "totalCurrentBalance": {
        "localCurrencyCode": "HKD",
        "localCurrencyBalanceAmount": 29.05,
        "foreignCurrencyCode": "USD",
        "foreignCurrencyBalanceAmount": 3.72
      },
      "totalAvailableBalance": {
        "localCurrencyCode": "HKD",
        "localCurrencyBalanceAmount": 29.052,
        "foreignCurrencyCode": "USD",
        "foreignCurrencyBalanceAmount": 3.711
      }
    },
    {
      "accountGroup": "INSURANCE",
      "insurancePolicies": [
        {
          "productName": "ZURICH FLYAWAY ANNUAL TRAVEL INSURANCE",
          "productCode": "ZAT1",
          "displayAccountNumber": "7764",
          "accountId": "ins_05",
          "currencyCode": "HKD",
          "accountClassification": "ASSET",
          "accountStatus": "ACTIVE",
          "displayPolicyNumber": "B810201549",
          "insuranceApplicationId": "#I2017051200011",
          "totalPremiumPaidAmount": 0
        }
      ]
    }
  ]
};

// API route to fetch Citi accounts (supports live proxy or mock fallback)
app.get("/api/citi/accounts", async (req, res) => {
  const token = (req.headers["authorization"] as string)?.replace("Bearer ", "") || process.env.CITI_BEARER_TOKEN || "";
  const nextStartIndex = req.query.nextStartIndex || "11";
  const cardId = req.query.cardId || "44125873852316f2b4d4d796c344e38756339654972776f663745446e6d4c32486f455a4165374a476858343d";
  const useMock = req.query.mock === "true";

  if (useMock || !token) {
    return res.json({
      source: "mock",
      timestamp: new Date().toISOString(),
      data: MOCK_CITI_RESPONSE
    });
  }

  try {
    const citiUrl = `https://partner.citi.com/gcgapi/sandbox/prod/openapi/v1/accounts?nextStartIndex=${nextStartIndex}&cardId=${cardId}`;
    
    const response = await fetch(citiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "client_id": "8bJV5Au7B80L0yUhmmNcCznaTJKVCYKI",
        "uuid": "6852c556-7a5b-418a-95d1-90a0014c0b70"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Citi API warning (${response.status}): ${errText}. Falling back to mock data.`);
      return res.json({
        source: "mock-fallback",
        status: response.status,
        message: `Sandbox API returned ${response.status}. Showing simulated sandbox response.`,
        data: MOCK_CITI_RESPONSE
      });
    }

    const data = await response.json();
    return res.json({
      source: "live-citi-sandbox",
      data
    });
  } catch (error: any) {
    console.warn("Citi API fetch error, falling back to mock:", error.message);
    return res.json({
      source: "mock-fallback",
      error: error.message,
      data: MOCK_CITI_RESPONSE
    });
  }
});

// Gemini AI Financial Advisor route
app.post("/api/ai/insights", async (req, res) => {
  try {
    const { accountsData } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "Gemini API key is not configured in environment secrets." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";

    const prompt = `You are an expert wealth manager and financial analyst reviewing a client's multi-currency asset and liability portfolio from Citibank.
Here is the raw account and balance summary JSON:
${JSON.stringify(accountsData, null, 2)}

Provide a comprehensive, professional, and actionable financial health report containing:
1. Executive Summary of Net Worth and Liquidity.
2. Asset vs Liability Analysis (highlighting savings, investments, mortgages, and credit limits).
3. Risk & Status Alerts (e.g. delinquent loans, no-debit activity, credit utilization).
4. Strategic Recommendations for portfolio optimization.

Format your response as clean JSON with the following structure:
{
  "executiveSummary": "string",
  "netWorthOverview": "string",
  "alerts": ["string"],
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "impact": "High | Medium | Low"
    }
  ],
  "portfolioHealthScore": number (0-100)
}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Insights Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI insights." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
