

// --- CONSOLIDATED FROM: ./services/VisaGeminiBridge.ts ---

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as crypto from "crypto";

/**
 * Represents standard ISO 8583 fields used in VisaNet transactions.
 */
export interface Iso8583Payload {
  mti: string; // Message Type Identifier (e.g., "0100", "0200")
  pan?: string; // Field 2: Primary Account Number
  processingCode: string; // Field 3: Processing Code (e.g., "000000" for purchase)
  amountTransaction: number; // Field 4: Transaction Amount (in minor units, e.g., cents)
  transmissionDateTime: string; // Field 7: Transmission Date & Time (MMDDhhmmss)
  stan: string; // Field 11: System Trace Audit Number
  localTransactionTime: string; // Field 12: Local Transaction Time (hhmmss)
  localTransactionDate: string; // Field 13: Local Transaction Date (MMDD)
  expirationDate?: string; // Field 14: Expiration Date (YYMM)
  merchantType: string; // Field 18: Merchant Category Code (MCC)
  posEntryMode: string; // Field 22: Point of Service Entry Mode
  posConditionCode?: string; // Field 25: Point of Service Condition Code
  acquiringInstitutionId?: string; // Field 32: Acquiring Institution ID
  retrievalReferenceNumber?: string; // Field 37: Retrieval Reference Number (RRN)
  authorizationCode?: string; // Field 38: Authorization Identification Response
  responseCode?: string; // Field 39: Action/Response Code (e.g., "00" for approval)
  terminalId?: string; // Field 41: Card Acceptor Terminal Identification
  merchantId?: string; // Field 42: Card Acceptor Identification Code
  merchantLocation?: string; // Field 43: Card Acceptor Name/Location
  currencyCode: string; // Field 49: Transaction Currency Code (ISO 4217 numeric)
  iccData?: string; // Field 55: Integrated Circuit Card (ICC) System Related Data (Hex string)
}

/**
 * Represents parsed Track 1 and Track 2 data from magnetic stripe or contactless fallback.
 */
export interface TrackData {
  track1?: string;
  track2?: string;
  parsedName?: string;
  parsedExpiry?: string;
  parsedServiceCode?: string;
}

/**
 * Represents parsed EMV tags from Field 55 (ICC Data).
 */
export interface EmvData {
  cryptogram?: string; // Tag 9F26 (Application Cryptogram)
  cryptogramInformationData?: string; // Tag 9F27 (CID)
  issuerApplicationData?: string; // Tag 9F10 (IAD)
  unpredictableNumber?: string; // Tag 9F37 (UN)
  applicationTransactionCounter?: string; // Tag 9F36 (ATC)
  terminalVerificationResults?: string; // Tag 95 (TVR)
  transactionDate?: string; // Tag 9A
  transactionType?: string; // Tag 9C
  amountAuthorized?: string; // Tag 9F02
  transactionCurrencyCode?: string; // Tag 5F2A
  applicationInterchangeProfile?: string; // Tag 82 (AIP)
  terminalCapabilities?: string; // Tag 9F33
  cvmResults?: string; // Tag 9F34 (Cardholder Verification Method Results)
  rawTags?: Record<string, string>;
}

/**
 * Complete Visa transaction payload combining ISO 8583, Track, and EMV data.
 */
export interface VisaTransactionPayload {
  transactionId: string;
  iso8583: Iso8583Payload;
  trackData?: TrackData;
  emvData?: EmvData;
  networkRoutingInfo?: {
    incomingSource: string;
    visaBinGroup: string;
    settlementServiceIndicator?: string;
  };
}

/**
 * Structure representing a parsed EMV Tag-Length-Value (TLV) element.
 */
export interface TlvElement {
  tag: string;
  length: number;
  value: string;
}

/**
 * Dedicated bridge service that formats VisaNet Connect payloads for Gemini,
 * enabling deep semantic analysis, fraud detection, and natural language queries.
 */
export class VisaGeminiBridge {
  private gemini: GoogleGenerativeAI | null = null;
  private apiKey?: string;
  private modelName: string;

  constructor(apiKey?: string, modelName: string = "gemini-2.5-flash") {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.modelName = modelName;
    if (this.apiKey) {
      this.gemini = new GoogleGenerativeAI(this.apiKey);
    }
  }

  private getGeminiClient(): GoogleGenerativeAI {
    if (!this.gemini) {
      const key = this.apiKey || process.env.GEMINI_API_KEY;
      if (!key) {
        throw new Error("Gemini API key is required. Set GEMINI_API_KEY in your environment.");
      }
      this.gemini = new GoogleGenerativeAI(key);
    }
    return this.gemini;
  }

  /**
   * Parses raw EMV Field 55 hex string into structured Tag-Length-Value (TLV) elements.
   */
  public static parseField55(hexString: string): TlvElement[] {
    const elements: TlvElement[] = [];
    let index = 0;
    const cleanHex = hexString.replace(/\s+/g, "").toUpperCase();

    while (index < cleanHex.length) {
      if (index + 2 > cleanHex.length) break;

      // Parse Tag (can be 1 or 2 bytes)
      let tag = cleanHex.substring(index, index + 2);
      index += 2;

      const firstByte = parseInt(tag, 16);
      if ((firstByte & 0x1F) === 0x1F) {
        if (index + 2 > cleanHex.length) break;
        tag += cleanHex.substring(index, index + 2);
        index += 2;
      }

      if (index + 2 > cleanHex.length) break;

      // Parse Length
      let lengthVal = parseInt(cleanHex.substring(index, index + 2), 16);
      index += 2;
      let length = lengthVal;

      // Handle multi-byte length format (subsequent bytes specify length)
      if ((lengthVal & 0x80) === 0x80) {
        const numBytes = lengthVal & 0x7F;
        if (index + numBytes * 2 > cleanHex.length) break;
        const lengthHex = cleanHex.substring(index, index + numBytes * 2);
        length = parseInt(lengthHex, 16);
        index += numBytes * 2;
      }

      if (index + length * 2 > cleanHex.length) break;

      // Parse Value
      const value = cleanHex.substring(index, index + length * 2);
      index += length * 2;

      elements.push({
        tag,
        length,
        value,
      });
    }

    return elements;
  }

  /**
   * Maps parsed TLV elements to structured EMV fields.
   */
  public static mapTlvToEmvData(tlvList: TlvElement[]): EmvData {
    const emv: EmvData = { rawTags: {} };
    const raw: Record<string, string> = {};

    for (const elem of tlvList) {
      raw[elem.tag] = elem.value;
      switch (elem.tag) {
        case "9F26":
          emv.cryptogram = elem.value;
          break;
        case "9F27":
          emv.cryptogramInformationData = elem.value;
          break;
        case "9F10":
          emv.issuerApplicationData = elem.value;
          break;
        case "9F37":
          emv.unpredictableNumber = elem.value;
          break;
        case "9F36":
          emv.applicationTransactionCounter = elem.value;
          break;
        case "95":
          emv.terminalVerificationResults = elem.value;
          break;
        case "9A":
          emv.transactionDate = elem.value;
          break;
        case "9C":
          emv.transactionType = elem.value;
          break;
        case "9F02":
          emv.amountAuthorized = elem.value;
          break;
        case "5F2A":
          emv.transactionCurrencyCode = elem.value;
          break;
        case "82":
          emv.applicationInterchangeProfile = elem.value;
          break;
        case "9F33":
          emv.terminalCapabilities = elem.value;
          break;
        case "9F34":
          emv.cvmResults = elem.value;
          break;
      }
    }
    emv.rawTags = raw;
    return emv;
  }

  /**
   * Parses Track 1 and Track 2 data securely, extracting non-sensitive metadata.
   */
  public static parseTrackData(track1?: string, track2?: string): TrackData {
    const result: TrackData = { track1, track2 };

    if (track1) {
      // Format: B[PAN]^[Name]^[Expiry][ServiceCode][DiscretionaryData]
      const match = track1.match(/B(\d{13,19})\^([^^]{2,26})\^(\d{4})(\d{3})/);
      if (match) {
        result.parsedName = match[2].trim();
        result.parsedExpiry = match[3]; // YYMM
        result.parsedServiceCode = match[4];
      }
    } else if (track2) {
      // Format: [PAN]=[Expiry][ServiceCode][DiscretionaryData]
      const match = track2.match(/(\d{13,19})=(\d{4})(\d{3})/);
      if (match) {
        result.parsedExpiry = match[2]; // YYMM
        result.parsedServiceCode = match[3];
      }
    }

    return result;
  }

  /**
   * Masks sensitive data (PAN, Track 1/2, CVV) to maintain strict PCI-DSS compliance
   * before sending any payload to Gemini.
   */
  public maskPayload(payload: VisaTransactionPayload): VisaTransactionPayload {
    const masked = JSON.parse(JSON.stringify(payload)) as VisaTransactionPayload;

    // Mask PAN in ISO 8583
    if (masked.iso8583.pan) {
      masked.iso8583.pan = this.maskPanString(masked.iso8583.pan);
    }

    // Mask Track Data completely except for parsed metadata
    if (masked.trackData) {
      if (masked.trackData.track1) {
        masked.trackData.track1 = "[MASKED TRACK 1 DATA]";
      }
      if (masked.trackData.track2) {
        masked.trackData.track2 = "[MASKED TRACK 2 DATA]";
      }
    }

    // Mask sensitive EMV tags if present (e.g., Tag 5A PAN, Tag 57 Track 2 Equivalent)
    if (masked.emvData?.rawTags) {
      const sensitiveTags = ["5A", "57", "9F1F", "9F20"];
      for (const tag of sensitiveTags) {
        if (masked.emvData.rawTags[tag]) {
          masked.emvData.rawTags[tag] = "[MASKED SENSITIVE EMV TAG]";
        }
      }
    }

    return masked;
  }

  /**
   * Helper to mask a PAN string (keeps first 6 and last 4 digits).
   */
  private maskPanString(pan: string): string {
    const clean = pan.replace(/\D/g, "");
    if (clean.length < 10) {
      return "************";
    }
    const first6 = clean.substring(0, 6);
    const last4 = clean.substring(clean.length - 4);
    const maskedLength = clean.length - 10;
    return `${first6}${"*".repeat(maskedLength)}${last4}`;
  }

  /**
   * Formats the masked Visa transaction payload into a highly structured,
   * semantically rich text representation optimized for Gemini's context window.
   */
  public formatPayloadForGemini(payload: VisaTransactionPayload): string {
    const masked = this.maskPayload(payload);
    const iso = masked.iso8583;
    const emv = masked.emvData;
    const track = masked.trackData;

    let text = `=== VISANET CONNECT TRANSACTION REPORT ===\n`;
    text += `Transaction ID: ${masked.transactionId}\n`;
    text += `Message Type Identifier (MTI): ${iso.mti} (${this.getMtiDescription(iso.mti)})\n`;
    text += `Primary Account Number (PAN): ${iso.pan || "N/A"}\n`;
    text += `Processing Code: ${iso.processingCode} (${this.getProcessingCodeDescription(iso.processingCode)})\n`;
    text += `Amount (Transaction): ${iso.amountTransaction} (Currency Code: ${iso.currencyCode})\n`;
    text += `Transmission Date/Time: ${iso.transmissionDateTime}\n`;
    text += `STAN (System Trace Audit Number): ${iso.stan}\n`;
    text += `Local Transaction Date/Time: ${iso.localTransactionDate} ${iso.localTransactionTime}\n`;
    text += `Merchant Category Code (MCC): ${iso.merchantType} (${this.getMccDescription(iso.merchantType)})\n`;
    text += `POS Entry Mode: ${iso.posEntryMode} (${this.getPosEntryModeDescription(iso.posEntryMode)})\n`;
    text += `Merchant ID: ${iso.merchantId || "N/A"}\n`;
    text += `Merchant Location: ${iso.merchantLocation || "N/A"}\n`;
    text += `Retrieval Reference Number (RRN): ${iso.retrievalReferenceNumber || "N/A"}\n`;
    text += `Response Code: ${iso.responseCode || "N/A"} (${this.getResponseCodeDescription(iso.responseCode)})\n`;

    if (track) {
      text += `\n--- Track Metadata ---\n`;
      text += `Cardholder Name: ${track.parsedName || "N/A"}\n`;
      text += `Expiry Date: ${track.parsedExpiry || "N/A"}\n`;
      text += `Service Code: ${track.parsedServiceCode || "N/A"} (${this.getServiceCodeDescription(track.parsedServiceCode)})\n`;
    }

    if (emv) {
      text += `\n--- EMV Online Cryptogram & ICC Data ---\n`;
      text += `Application Cryptogram (Tag 9F26): ${emv.cryptogram || "N/A"}\n`;
      text += `Cryptogram Info Data (Tag 9F27): ${emv.cryptogramInformationData || "N/A"}\n`;
      text += `Application Transaction Counter (Tag 9F36): ${emv.applicationTransactionCounter || "N/A"}\n`;
      text += `Terminal Verification Results (Tag 95): ${emv.terminalVerificationResults || "N/A"}\n`;
      text += `Issuer Application Data (Tag 9F10): ${emv.issuerApplicationData || "N/A"}\n`;
      text += `Unpredictable Number (Tag 9F37): ${emv.unpredictableNumber || "N/A"}\n`;
      text += `CVM Results (Tag 9F34): ${emv.cvmResults || "N/A"}\n`;
      text += `Terminal Capabilities (Tag 9F33): ${emv.terminalCapabilities || "N/A"}\n`;
      text += `Application Interchange Profile (Tag 82): ${emv.applicationInterchangeProfile || "N/A"}\n`;

      if (emv.rawTags && Object.keys(emv.rawTags).length > 0) {
        text += `Raw EMV TLV Tags:\n`;
        for (const [tag, val] of Object.entries(emv.rawTags)) {
          text += `  - Tag ${tag}: ${val}\n`;
        }
      }
    }

    if (masked.networkRoutingInfo) {
      text += `\n--- Network Routing Info ---\n`;
      text += `Incoming Source: ${masked.networkRoutingInfo.incomingSource}\n`;
      text += `Visa BIN Group: ${masked.networkRoutingInfo.visaBinGroup}\n`;
      text += `Settlement Service Indicator: ${masked.networkRoutingInfo.settlementServiceIndicator || "N/A"}\n`;
    }

    text += `==========================================\n`;
    return text;
  }

  /**
   * Sends a formatted Visa transaction payload to Gemini for deep semantic analysis,
   * anomaly detection, and risk assessment.
   */
  public async analyzeTransaction(payload: VisaTransactionPayload, customQuery?: string): Promise<string> {
    const formattedContext = this.formatPayloadForGemini(payload);
    const systemInstruction = `
      You are an expert VisaNet network analyst, fraud investigator, and EMV protocol specialist.
      Analyze the provided Visa transaction payload. Look for anomalies in the ISO 8583 fields,
      inconsistencies in the EMV cryptogram data (such as TVR flags indicating terminal bypass or failed PINs),
      mismatches between POS Entry Mode and EMV presence, and potential fraud patterns (e.g., high-risk MCCs,
      unusual local times, or suspicious service codes).
      Provide a professional, structured, and highly detailed analysis.
    `;

    const prompt = customQuery 
      ? `${formattedContext}\n\nUser Query: ${customQuery}`
      : `${formattedContext}\n\nPlease perform a comprehensive security, fraud, and protocol compliance analysis on this transaction. Highlight any risk factors, EMV validation anomalies, or routing issues.`;

    try {
      const model = this.getGeminiClient().getGenerativeModel({
        model: this.modelName,
        systemInstruction,
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error calling Gemini in VisaGeminiBridge:", error);
      throw new Error(`VisaGeminiBridge failed to analyze transaction: ${(error as Error).message}`);
    }
  }

  public async analyzeTransactionWithGemini(payload: VisaTransactionPayload, customQuery?: string): Promise<string> {
    return this.analyzeTransaction(payload, customQuery);
  }

  /**
   * Performs a batch semantic analysis over multiple Visa transactions, allowing natural language queries
   * like "Find all transactions with suspicious EMV fallback or high-risk MCCs."
   */
  public async queryBatchTransactions(payloads: VisaTransactionPayload[], query: string): Promise<string> {
    let batchContext = `=== BATCH VISA TRANSACTIONS FOR ANALYSIS ===\n\n`;
    for (let i = 0; i < payloads.length; i++) {
      batchContext += `--- Transaction #${i + 1} ---\n`;
      batchContext += this.formatPayloadForGemini(payloads[i]);
      batchContext += `\n`;
    }

    const systemInstruction = `
      You are a senior VisaNet operations director and forensic auditor.
      You have been provided with a batch of Visa transaction payloads.
      Analyze the batch collectively to answer the user's natural language query.
      Correlate patterns across transactions if applicable (e.g., velocity attacks, card testing, terminal tampering).
    `;

    try {
      const model = this.getGeminiClient().getGenerativeModel({
        model: this.modelName,
        systemInstruction,
      });

      const prompt = `${batchContext}\n\nQuery: ${query}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error in batch query via VisaGeminiBridge:", error);
      throw new Error(`VisaGeminiBridge batch query failed: ${(error as Error).message}`);
    }
  }

  /**
   * Decodes MTI (Message Type Identifier) to human-readable description.
   */
  private getMtiDescription(mti: string): string {
    const descriptions: Record<string, string> = {
      "0100": "Authorization Request",
      "0110": "Authorization Response",
      "0120": "Authorization Advice",
      "0130": "Authorization Advice Response",
      "0200": "Acquirer Financial Request",
      "0210": "Acquirer Financial Response",
      "0220": "Acquirer Financial Advice",
      "0230": "Acquirer Financial Advice Response",
      "0400": "Reversal Request",
      "0410": "Reversal Response",
      "0420": "Reversal Advice",
      "0430": "Reversal Advice Response",
      "0800": "Network Management Request",
      "0810": "Network Management Response",
    };
    return descriptions[mti] || "Unknown MTI";
  }

  /**
   * Decodes Processing Code (Field 3) to human-readable description.
   */
  private getProcessingCodeDescription(code: string): string {
    if (code.length < 6) return "Invalid Processing Code";
    const transactionType = code.substring(0, 2);
    const fromAccount = code.substring(2, 4);
    const toAccount = code.substring(4, 6);

    let desc = "";
    switch (transactionType) {
      case "00": desc += "Goods/Services Purchase"; break;
      case "01": desc += "Cash Withdrawal"; break;
      case "09": desc += "Purchase with Cash Back"; break;
      case "20": desc += "Refund/Return"; break;
      case "30": desc += "Inquiry"; break;
      case "40": desc += "Transfer"; break;
      default: desc += "Generic Transaction";
    }

    const accountTypes: Record<string, string> = {
      "00": "Default/Unspecified",
      "10": "Savings",
      "20": "Checking",
      "30": "Credit",
    };

    desc += ` (From: ${accountTypes[fromAccount] || "Other"} To: ${accountTypes[toAccount] || "Other"})`;
    return desc;
  }

  /**
   * Decodes POS Entry Mode (Field 22) to human-readable description.
   */
  private getPosEntryModeDescription(mode: string): string {
    const panEntry = mode.substring(0, 2);
    const pinEntry = mode.substring(2, 3) || "";

    let desc = "";
    switch (panEntry) {
      case "01": desc += "Manual Key Entry"; break;
      case "02": desc += "Magnetic Stripe (Magstripe)"; break;
      case "05": desc += "Integrated Circuit Card (ICC/EMV) - Contact"; break;
      case "07": desc += "Contactless EMV / Chip"; break;
      case "80": desc += "Fallback to Magstripe from EMV"; break;
      case "90": desc += "Magnetic Stripe (Full Track Data)"; break;
      case "91": desc += "Contactless Magnetic Stripe (MSD)"; break;
      default: desc += `Unknown Entry Mode (${panEntry})`;
    }

    if (pinEntry) {
      switch (pinEntry) {
        case "1": desc += " [PIN Capable]"; break;
        case "2": desc += " [PIN Not Capable]"; break;
      }
    }

    return desc;
  }

  /**
   * Decodes Response Code (Field 39) to human-readable description.
   */
  private getResponseCodeDescription(code?: string): string {
    if (!code) return "No Response Code";
    const codes: Record<string, string> = {
      "00": "Approved or completed successfully",
      "01": "Refer to card issuer",
      "03": "Invalid merchant",
      "04": "Pick-up card",
      "05": "Do not honor (General decline)",
      "12": "Invalid transaction",
      "13": "Invalid amount",
      "14": "Invalid card number (no such number)",
      "30": "Format error",
      "41": "Lost card",
      "43": "Stolen card",
      "51": "Insufficient funds",
      "54": "Expired card",
      "55": "Incorrect PIN",
      "57": "Transaction not permitted to cardholder",
      "58": "Transaction not permitted to terminal",
      "61": "Exceeds withdrawal amount limit",
      "62": "Restricted card",
      "65": "Exceeds withdrawal frequency limit",
      "91": "System unavailable / Issuer inoperative",
      "96": "System malfunction / Processing error",
    };
    return codes[code] || `Other Decline/Response Code (${code})`;
  }

  /**
   * Decodes Service Code (from Track Data) to human-readable description.
   */
  private getServiceCodeDescription(code?: string): string {
    if (!code || code.length < 3) return "N/A";
    const first = code.charAt(0);
    const second = code.charAt(1);
    const third = code.charAt(2);

    let desc = "";
    switch (first) {
      case "1": desc += "International interchange / "; break;
      case "2": desc += "International interchange (ICC/EMV preferred) / "; break;
      case "5": desc += "National interchange / "; break;
      case "6": desc += "National interchange (ICC/EMV preferred) / "; break;
      default: desc += "Private/Unspecified / ";
    }

    switch (second) {
      case "0": desc += "Normal authorization / "; break;
      case "2": desc += "Positive online authorization / "; break;
      case "4": desc += "Prompt for PIN / "; break;
      default: desc += "Standard authorization / ";
    }

    switch (third) {
      case "0": desc += "No restrictions (PIN required)"; break;
      case "1": desc += "No restrictions"; break;
      case "2": desc += "Goods and services only"; break;
      case "3": desc += "ATM only"; break;
      case "5": desc += "PIN required"; break;
      case "6": desc += "Prompt for PIN if terminal capable"; break;
      default: desc += "Unspecified restrictions";
    }

    return desc;
  }

  /**
   * Decodes Merchant Category Code (MCC) to human-readable description.
   */
  private getMccDescription(mcc: string): string {
    const codes: Record<string, string> = {
      "4814": "Telecommunication Services",
      "5411": "Grocery Stores / Supermarkets",
      "5541": "Service Stations (Gas Stations)",
      "5812": "Eating Places and Restaurants",
      "5814": "Fast Food Restaurants",
      "5912": "Drug Stores and Pharmacies",
      "6011": "Financial Institutions - Automated Cash Disbursements",
      "6012": "Financial Institutions - Merchandise and Services",
      "7011": "Lodging - Hotels, Motels, Resorts",
      "7995": "Betting, including Lottery Tickets, Casino Gaming Chips",
      "8999": "Professional Services - Not Elsewhere Classified",
    };
    return codes[mcc] || "Retail / General Merchant";
  }
}

export const visaGeminiBridge = new VisaGeminiBridge();
export default VisaGeminiBridge;