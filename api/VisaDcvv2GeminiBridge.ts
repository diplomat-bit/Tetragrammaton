import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import { logger } from "./utils/logger.ts";

interface Dcvv2RiskAssessment {
  riskScore: number;
  recommendedIntervalSeconds: number;
  action: "APPROVE" | "CHALLENGE" | "DENY";
  reasoning: string;
}

interface Dcvv2RequestPayload {
  cardId: string;
  transactionAmount: number;
  merchantCategoryCode: string;
  deviceFingerprint: string;
  previousDcvv2Timestamp: number;
}

class VisaDcvv2GeminiBridge {
  private model: GenerativeModel;
  private readonly SYSTEM_INSTRUCTION = `
    You are the Visa dCVV2 Risk Intelligence Engine. 
    Analyze dCVV2 generation requests for potential fraud.
    Return JSON with: riskScore (0-100), recommendedIntervalSeconds (int), action (APPROVE/CHALLENGE/DENY), reasoning (string).
    High risk factors: rapid generation, high-risk MCCs, inconsistent device fingerprints.
  `;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction: this.SYSTEM_INSTRUCTION,
    });
  }

  public async assessDcvv2Request(payload: Dcvv2RequestPayload): Promise<Dcvv2RiskAssessment> {
    const requestId = uuidv4();
    logger.info(`[dCVV2] Assessing request ${requestId} for card ${payload.cardId}`);

    try {
      const prompt = `
        Assess the following dCVV2 generation request:
        ${JSON.stringify(payload)}
        
        Evaluate based on velocity, merchant risk, and device integrity.
      `;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      const assessment: Dcvv2RiskAssessment = JSON.parse(responseText);

      logger.info(`[dCVV2] Assessment complete for ${requestId}: ${assessment.action}`);
      return assessment;
    } catch (error) {
      logger.error(`[dCVV2] Gemini assessment failed for ${requestId}:`, error);
      // Fail-safe: Default to conservative security
      return {
        riskScore: 90,
        recommendedIntervalSeconds: 300,
        action: "CHALLENGE",
        reasoning: "Risk assessment engine unavailable, defaulting to challenge."
      };
    }
  }

  public async logDcvv2Event(cardId: string, eventType: string, metadata: any) {
    logger.info(`[dCVV2] Event: ${eventType} | Card: ${cardId} | Data: ${JSON.stringify(metadata)}`);
  }
}

const apiKey = process.env.GEMINI_API_KEY || "";
export const visaDcvv2GeminiBridge = new VisaDcvv2GeminiBridge(apiKey);
export default visaDcvv2GeminiBridge;
