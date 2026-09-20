import { Router } from "express";
import type { Request, Response } from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import { getGeminiClient, loadSecrets } from "../services/serverHelpers.js";
import { callGemini, Type } from "../services/geminiService.js";
import { AstraService } from "../services/astraService.js";

const router = Router();

router.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }


    let promptText = message;
    if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = history.map((h: any) => `${h.role}: ${h.content}`).join("\n");
      promptText = `Previous Conversation:\n${formattedHistory}\n\nUser: ${message}`;
    }

    let responseText = "";
    const resObj = await callGemini("gemini-2.5-flash", promptText, {
      systemInstruction: "You are the Aquarius AI Sovereign Assistant for high-net-worth banking and treasury."
    });
    responseText = typeof resObj === "string" ? resObj : (resObj.text || JSON.stringify(resObj));

    res.json({ reply: responseText });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat request" });
  }
});

router.post("/api/gemini/live-token", async (req: Request, res: Response) => {
  try {
    const secrets = loadSecrets();
    const apiKey = process.env.GEMINI_API_KEY || secrets.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "GEMINI_API_KEY is missing on server" });
    }

    const host = req.headers["x-forwarded-host"] || req.get("host");
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const referer = `${protocol}://${host}`;

    res.json({
      apiKey,
      referer,
      model: "gemini-2.5-flash",
      wssUrl: "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent"
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/financial-agent/chat", async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body || {};
    const prompt = `System: You are an autonomous AI Financial Agent for Aquarius Sovereign OS.
Context: ${JSON.stringify(context || {})}
User Query: ${message}`;

    const geminiRes = await callGemini("gemini-2.5-flash", prompt, {
      systemInstruction: "Act as an executive AI financial analyst and treasury manager. Provide concise, actionable insights."
    });
    const reply = typeof geminiRes === 'string' ? geminiRes : geminiRes.text;

    res.json({ reply });
  } catch (error: any) {
    console.error("Financial Agent Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/v1/astra/initialize", async (req: Request, res: Response) => {
  try {
    const results = await AstraService.createAllTables();
    res.json({ status: "success", results });
  } catch (error: any) {
    console.error("Astra DB Initialization Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/v1/astra/query", async (req: Request, res: Response) => {
  try {
    const { table, query } = req.body || {};
    const results = await AstraService.executeQuery(table, query || "");
    res.json({ status: "success", results });
  } catch (error: any) {
    console.error("Astra Query Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/v1/astra/index", async (req: Request, res: Response) => {
  try {
    const { table, data } = req.body || {};
    const result = await AstraService.indexDocument(table, data);
    res.json({ status: "success", result });
  } catch (error: any) {
    console.error("Astra Index Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/v1/ai/recommendations", async (req: Request, res: Response) => {
  try {
    const { portfolio } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const totalValue = (portfolio || []).reduce((sum: number, asset: any) => sum + asset.value, 0);
      return res.json({ allocations: (portfolio || []).map((a: any) => ({ name: a.name, targetValue: totalValue * 0.25, currentValue: a.value })) });
    }

    const ai = getGeminiClient(req);
    const prompt = `Given this portfolio: ${JSON.stringify(portfolio)}, recommend a balanced allocation for long-term growth. Return ONLY a JSON object with this exact structure: { "allocations": [{ "name": "Asset Name", "targetValue": 1000, "currentValue": 500 }] }`;
    
    const geminiRes = await callGemini("gemini-2.5-flash", prompt, {
      responseMimeType: "application/json"
    });
    const responseText = typeof geminiRes === 'string' ? geminiRes : geminiRes.text;

    if (responseText) {
      res.json(JSON.parse(responseText));
    } else {
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/v1/aria/process", async (req: Request, res: Response) => {
  try {
    const { channel } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.json({ message: channel === 'INTIMACY' ? 'AI Key missing, processing biometric logic locally.' : 'AI Key missing, queueing atomic settlement.'});
    }
    const prompt = channel === 'INTIMACY' ? 'Act as a highly empathetic AI OS assistant named Aria. The user just sent an audio message indicating stress. Give a soothing one-sentence response.' : 'Act as a highly deterministic financial OS named Aria. The user just gave a voice command. Confirm that a wire transaction to the primary vault has been signed and queued in one sentence.';
    
    const ariaRes = await callGemini("gemini-2.5-flash", prompt);
    const responseText = typeof ariaRes === 'string' ? ariaRes : ariaRes.text;
    res.json({ message: responseText });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
