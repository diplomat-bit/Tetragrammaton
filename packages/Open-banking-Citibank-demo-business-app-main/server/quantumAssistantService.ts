import { getGeminiAI } from './gemini';
import { getEffectiveCredentials, fetchOBPAccounts } from './obpService';
import { getCommercialPaperNotes, calculateCommercialPaper } from './commercialPaperService';
import { getModernTreasuryData } from './modernTreasuryService';
import { recordApiCall } from './telemetryService';

export async function askQuantumAssistant(prompt: string, history: Array<{ role: 'user' | 'model'; parts: string }> = []) {
  const startTime = Date.now();
  const ai = getGeminiAI();
  const creds = getEffectiveCredentials();
  const accounts = await fetchOBPAccounts();
  const cpNotes = getCommercialPaperNotes();
  const mtData = getModernTreasuryData();

  // Summary context
  const totalCash = accounts.reduce((acc, a) => acc + (a.balance.currency === 'USD' ? parseFloat(a.balance.amount) : 0), 0);
  const activeCp = cpNotes.filter(n => n.status === 'ACTIVE' || n.status === 'MATURING_SOON');
  const totalCpFaceValue = activeCp.reduce((acc, n) => acc + n.faceValue, 0);

  const contextData = {
    application: 'Citibank Demo Business App',
    developerEmail: 'diplomat@citibankdemobusiness.dev',
    userRedirectUrl: 'https://citibankdemobusiness.dev',
    openBankProject: {
      apiBaseUrl: creds.apiBaseUrl,
      directLoginEndpoint: creds.directLoginEndpoint,
      oauth1Endpoint: creds.oauthInitiateEndpoint,
      consumerIdConfigured: Boolean(creds.consumerId),
      consumerKeyConfigured: Boolean(creds.consumerKey),
      consumerSecretConfigured: Boolean(creds.consumerSecret),
      sessionLoggedIn: Boolean(creds.activeSessionToken),
      activeAccounts: accounts.map(a => ({
        id: a.id,
        label: a.label,
        balance: `${a.balance.currency} ${parseFloat(a.balance.amount).toLocaleString()}`,
        number: a.number,
      })),
    },
    commercialPaperPortfolio: {
      totalOutstandingPar: `$${totalCpFaceValue.toLocaleString()}`,
      activeNotesCount: activeCp.length,
      notes: activeCp.map(n => ({
        cusip: n.cusip,
        faceValue: `$${n.faceValue.toLocaleString()}`,
        discountRate: `${n.discountRate}%`,
        bondEquivalentYield: `${n.bondEquivalentYield}%`,
        maturityDate: n.maturityDate,
        tenorDays: n.tenorDays,
        status: n.status,
      })),
    },
    modernTreasury: {
      ledgerAssets: `$${mtData.ledger.totalAssets.toLocaleString()}`,
      pendingOutflows: `$${mtData.ledger.pendingOutflow.toLocaleString()}`,
      paymentOrdersCount: mtData.paymentOrders.length,
    },
  };

  const systemInstruction = `You are the Quantum Assistant — the enterprise-grade AI Banking & Treasury Copilot inside the Citibank Demo Business App.
You possess deep expertise in:
1. Open Bank Project (OBP) API (v5.1.0): Direct Login authentication (using Authorization: DirectLogin username="...", password="...", consumer_key="..."), OBP token usage (Authorization: DirectLogin token="..."), accounts, transactions, payment requests, KYC customers, products, and branches.
2. Commercial Paper (CP) Mechanics: US 4(a)(2) / 3(a)(3) short-term money market notes, discount pricing (P = F * (1 - (d*t)/360)), Bond Equivalent Yield (BEY), CUSIP issuance, dealer placements, and maturity rollover ladders.
3. Modern Treasury multi-rail infrastructure (Fedwire, ACH, RTP, Book transfer, Ledger accounts).
4. Real-time liquidity forecasting, cash concentration sweeps, and institutional risk management.

Current Real-Time Financial Snapshot:
${JSON.stringify(contextData, null, 2)}

Communication Style:
- Professional, analytical, precise, and highly competent institutional banking advisor tone.
- When doing calculations (such as CP discount price, interest savings, or liquidity shortfalls), show the exact mathematical steps clearly.
- Provide practical recommendations and if requested, provide code snippets (cURL, TypeScript, Python) adhering to Open Bank Project and Modern Treasury standards.
- Keep your answers clean, structured with markdown bold headings or bullet points.`;

  if (!ai) {
    const query = prompt.toLowerCase();
    let responseText = '';

    if (query.includes('commercial paper') || query.includes('discount') || query.includes('yield') || query.includes('cp')) {
      const calc90 = calculateCommercialPaper(5000000, 4.80, 90);
      responseText = `### 🏛️ Commercial Paper Analytics & Liquidity Desk

**Current Portfolio Overview:**
- **Active Outstanding CP Par Value:** $${totalCpFaceValue.toLocaleString()} across ${activeCp.length} tranches.
- **Top Maturity Alert:** CUSIP **172967AD7** ($3.0M Par) is maturing in 48 hours.

**Benchmark 90-Day Calculation on $5,000,000 Par at 4.80% Discount:**
- **Issue Proceeds ($P$):** $${calc90.issuePrice.toLocaleString()} ($988.00 per $1,000)
- **Dollar Discount:** $${calc90.discountAmount.toLocaleString()}
- **Bond Equivalent Yield (BEY):** **${calc90.bondEquivalentYield}%** (365-day basis)

*Tip: Connect your \`GEMINI_API_KEY\` in Settings to unlock deep real-time conversational reasoning.*`;
    } else if (query.includes('obp') || query.includes('open bank') || query.includes('login') || query.includes('token') || query.includes('key')) {
      responseText = `### 🔑 Open Bank Project (OBP) API Architecture

**Direct Login Syntax:**
To authenticate against \`${creds.directLoginEndpoint}\`:
\`\`\`bash
curl -X POST "${creds.directLoginEndpoint}" \\
  -H "Content-Type: application/json" \\
  -H 'Authorization: DirectLogin username="diplomat@citibankdemobusiness.dev",password="YOUR_PASS",consumer_key="${creds.consumerKey || 'YOUR_CONSUMER_KEY'}"'
\`\`\`

**Subsequent API Calls:**
\`\`\`bash
curl -X GET "${creds.apiBaseUrl}/obp/v5.1.0/banks/rbs/accounts" \\
  -H 'Authorization: DirectLogin token="YOUR_OBP_TOKEN"'
\`\`\`

**Config Status:**
- Consumer ID: ${creds.consumerId ? '✅ Configured' : '⚠️ Pending .env configuration'}
- Consumer Key: ${creds.consumerKey ? '✅ Configured' : '⚠️ Pending .env configuration'}
- Consumer Secret: ${creds.consumerSecret ? '✅ Configured' : '⚠️ Pending .env configuration'}`;
    } else {
      responseText = `### 🌐 Quantum Assistant Treasury Briefing

**Consolidated Liquidity Position:**
- **Total OBP Bank Balances:** **$${totalCash.toLocaleString()} USD** across Operating and Treasury accounts.
- **Commercial Paper Outstanding:** **$${totalCpFaceValue.toLocaleString()} USD**
- **Modern Treasury Master Ledger Assets:** **$${mtData.ledger.totalAssets.toLocaleString()} USD**
- **Net Available Liquidity (T+0):** **$${(totalCash - 3000000).toLocaleString()} USD**

**Recommended Action Items:**
1. **Prepare Rollover for CUSIP 172967AD7:** $3.0M matures within 48 hours. Issue a 60-day replacement tranche at 4.80% discount rate.
2. **Review Modern Treasury Pending Outflows:** $850,000 pending via Fedwire/ACH.
3. **Verify OBP Consumer Credentials:** Check Settings to ensure your Consumer Key and Secret are loaded from environment variables.`;
    }

    const duration = Date.now() - startTime;
    const result = {
      content: responseText,
      source: 'local_quantum_engine',
      financialMetrics: {
        totalCash: `$${totalCash.toLocaleString()}`,
        cpOutstanding: `$${totalCpFaceValue.toLocaleString()}`,
        liquidityGap: `+$${(totalCash - 3000000).toLocaleString()}`,
        recommendedRate: `4.80%`,
      },
    };

    recordApiCall({
      service: 'QUANTUM_COPILOT',
      method: 'POST',
      url: '/api/quantum-assistant/chat',
      targetUrl: 'internal://quantum-assistant-engine',
      status: 200,
      statusText: 'OK (Local Intelligence Copilot)',
      durationMs: duration,
      requestBody: { prompt, historyLength: history.length },
      responseBody: result,
      mode: 'INTERNAL_ENGINE',
    });

    return result;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const duration = Date.now() - startTime;
    const result = {
      content: response.text || 'Unable to generate Quantum Assistant response.',
      source: 'gemini-3.7-flash',
      financialMetrics: {
        totalCash: `$${totalCash.toLocaleString()}`,
        cpOutstanding: `$${totalCpFaceValue.toLocaleString()}`,
        liquidityGap: `+$${(totalCash - 3000000).toLocaleString()}`,
        recommendedRate: `4.80%`,
      },
    };

    recordApiCall({
      service: 'QUANTUM_COPILOT',
      method: 'POST',
      url: '/api/quantum-assistant/chat',
      targetUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash',
      status: 200,
      statusText: 'OK (Gemini 3.7 Flash)',
      durationMs: duration,
      requestBody: { prompt },
      responseBody: result,
      mode: 'INTERNAL_ENGINE',
    });

    return result;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errResult = {
      content: `### ⚠️ Quantum Assistant Alert\n\nGemini API request encountered an error: ${error.message || 'Check GEMINI_API_KEY'}.\n\n**Current System Balances:**\n- Total OBP Cash: **$${totalCash.toLocaleString()}**\n- Commercial Paper Par Value: **$${totalCpFaceValue.toLocaleString()}**`,
      source: 'fallback_error',
    };

    recordApiCall({
      service: 'QUANTUM_COPILOT',
      method: 'POST',
      url: '/api/quantum-assistant/chat',
      targetUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash',
      status: 500,
      statusText: 'Gemini API Error',
      durationMs: duration,
      requestBody: { prompt },
      responseBody: { error: error.message },
      mode: 'INTERNAL_ENGINE',
      isError: true,
    });

    return errResult;
  }
}
