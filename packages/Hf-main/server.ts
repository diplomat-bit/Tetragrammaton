import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Initialize GoogleGenAI server-side client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint to analyze camera snapshot / image using Gemini Vision to find 64-digit hex private keys
app.post("/api/scan-private-key", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    let base64Data = image;
    let mimeType = "image/jpeg";
    if (image.startsWith("data:")) {
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }

    const prompt = `Analyze this image (which may be a piece of paper, backup card, notebook, or screen containing an Ethereum private key). 
Carefully scan for any 64-character hexadecimal string (0-9, a-f, A-F, ignoring any 0x prefix for length count, i.e. 64 hex nibbles = 32 bytes).
Return a JSON object with:
- "found": boolean indicating if a valid 64-hex private key was found.
- "privateKey": string (the exact 64-character hex string, ensure it has 0x prefix or is raw 64 hex chars).
- "confidence": number (0 to 1).
- "notes": brief description of what was detected.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            found: { type: Type.BOOLEAN },
            privateKey: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            notes: { type: Type.STRING },
          },
          required: ["found", "privateKey", "confidence", "notes"],
        },
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (err: any) {
    console.error("Gemini scan error:", err);
    res.status(500).json({ error: err.message || "Failed to scan image" });
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
