
import { GoogleGenAI, Type } from "@google/genai";
import { RepoDossier, ChatMessage } from "../types";

const TEXT_MODEL = "gemini-3-flash-preview";

export const geminiService = {
  async generateProjectDossier(repoName: string, description: string, fileContents: {path: string, content: string}[]): Promise<RepoDossier> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const context = fileContents.map(f => `FILE: ${f.path}\nCONTENT: ${f.content.slice(0, 2000)}`).join('\n\n');
    
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `You are an elite CTO. Analyze this repository: "${repoName}". 
      Description: ${description}
      Code Samples:
      ${context}
      
      Generate a professional project dossier in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pitch: { type: Type.STRING, description: "A high-impact elevator pitch for this project." },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of technologies detected." },
            keyFeatures: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  title: { type: Type.STRING }, 
                  description: { type: Type.STRING } 
                },
                required: ["title", "description"]
              } 
            },
            architectureSummary: { type: Type.STRING, description: "Analysis of the codebase structure." },
            growthPotential: { type: Type.STRING, description: "Future improvement suggestions." }
          },
          required: ["pitch", "techStack", "keyFeatures", "architectureSummary", "growthPotential"]
        }
      }
    });

    return JSON.parse(response.text);
  },

  async chatWithRepo(repoName: string, dossier: RepoDossier | null, message: string, history: ChatMessage[]): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const system = `You are an expert technical consultant for the project "${repoName}". 
    Use the following dossier as context: ${JSON.stringify(dossier)}.
    Be professional, helpful, and technically precise.`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [
        ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: { systemInstruction: system }
    });

    return response.text || '';
  },

  async produceEpicScreenplay(repoName: string, fileContents: { path: string; content: string }[], setStatus?: (s: string) => void): Promise<any> {
    if (setStatus) setStatus("Generating dramatic screenplay narrative...");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const context = fileContents.map(f => `FILE: ${f.path}\n${f.content.slice(0, 1000)}`).join('\n\n');
    
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `Generate a dramatic 5-act cinematic tech screenplay based on repository "${repoName}".\nFiles:\n${context}`,
    });

    return {
      title: `${repoName.toUpperCase()}: THE CHRONICLES`,
      logline: `An architectural odyssey into ${repoName}.`,
      worldBuilding: `In a world constructed of modular code and asynchronous queues, ${repoName} emerges as a sovereign artifact.`,
      scenes: [
        {
          id: 1,
          heading: "GENESIS & ARCHITECTURE INITIALIZATION",
          content: response.text || "The architecture awakens under luminous fiber streams.",
        }
      ],
      rawText: response.text || ''
    };
  },

  async queryVirtualRepo(virtualRepo: any, message: string, history: ChatMessage[]): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [
        ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: `Virtual Repo context: ${JSON.stringify(virtualRepo || {})}\n\nQuery: ${message}` }] }
      ]
    });
    return response.text || '';
  }
};
