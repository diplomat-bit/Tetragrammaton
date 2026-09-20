import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

let chatLogs: any[] = [];

router.post("/api/v1/google/chat/webhook", async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    console.log("Google Chat Webhook received:", JSON.stringify(payload, null, 2));

    chatLogs.push({
      id: `chat_log_${Date.now()}`,
      payload,
      receivedAt: new Date().toISOString()
    });

    if (chatLogs.length > 50) {
      chatLogs.shift();
    }

    const eventType = payload.type;
    let textResponse = "Sovereign Assistant received your message.";

    if (eventType === "ADDED_TO_SPACE") {
      textResponse = "Thank you for adding Aquarius Sovereign AI Agent to this space!";
    } else if (eventType === "MESSAGE") {
      const userMessage = payload.message?.text || "";
      textResponse = `Sovereign Agent Processing: "${userMessage}". Neural link verified.`;
    }

    res.json({
      text: textResponse
    });
  } catch (error: any) {
    console.error("Google Chat Webhook Error:", error);
    res.status(500).json({ text: "Error processing Google Chat webhook event." });
  }
});

router.get("/api/v1/google/chat/logs", (req: Request, res: Response) => {
  res.json(chatLogs);
});

export default router;
