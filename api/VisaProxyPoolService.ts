

// --- CONSOLIDATED FROM: ./services/VisaProxyPoolService.ts ---

import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import * as crypto from "crypto";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type SUAStatus = "Active" | "Reserved" | "Used" | "Suspended" | "Expired";

export interface VisaSUAProxy {
  id: string;
  poolId: string;
  proxyCardNumber: string; // Masked or tokenized card number
  token: string;           // Secure token representing the SUA
  expirationDate: string;
  cvv: string;
  creditLimit: number;
  availableBalance: number;
  status: SUAStatus;
  createdAt: Date;
  lastUsedAt?: Date;
}

export interface ProxyPool {
  id: string;
  name: string;
  currency: string;
  targetSize: number;
  threshold: number;       // Minimum active accounts before triggering replenishment
  currentSize: number;
  status: "Active" | "Paused" | "Depleted";
  autoReplenish: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReplenishmentRule {
  id: string;
  poolId: string;
  triggerThreshold: number;
  replenishAmount: number;
  maxLimitPerSUA: number;
  isActive: boolean;
}

export interface UtilizationRecord {
  timestamp: Date;
  activeCount: number;
  reservedCount: number;
  usedCount: number;
  totalTransactionsAmount: number;
}

export interface ForecastResult {
  forecastedUtilizationRate: number; // Percentage (0-100)
  recommendedPoolSize: number;
  riskLevel: "Low" | "Medium" | "High";
  replenishmentUrgency: "Low" | "Medium" | "High" | "Critical";
  analysis: string;
}

// ============================================================================
// VISA PROXY POOL SERVICE
// ============================================================================

export class VisaProxyPoolService {
  private geminiAI: GoogleGenerativeAI | null = null;
  
  // In-memory data stores acting as production-grade cache/fallback
  private pools: Map<string, ProxyPool> = new Map();
  private proxies: Map<string, VisaSUAProxy[]> = new Map();
  private rules: Map<string, ReplenishmentRule> = new Map();
  private utilizationHistory: Map<string, UtilizationRecord[]> = new Map();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (apiKey) {
      this.geminiAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn("VisaProxyPoolService: GEMINI_API_KEY is not set. AI forecasting features will run in fallback mode.");
    }
    this.initializeMockData();
  }

  /**
   * Seed initial mock data for commercial-grade demonstration and testing
   */
  private initializeMockData() {
    const defaultPoolId = "pool-visa-sua-usd-01";
    
    const defaultPool: ProxyPool = {
      id: defaultPoolId,
      name: "North America Corporate Procurement Pool",
      currency: "USD",
      targetSize: 50,
      threshold: 15,
      currentSize: 32,
      status: "Active",
      autoReplenish: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };

    this.pools.set(defaultPoolId, defaultPool);

    // Generate 32 active proxies
    const proxyList: VisaSUAProxy[] = [];
    for (let i = 0; i < 32; i++) {
      proxyList.push(this.generateSecureSUA(defaultPoolId, 5000));
    }
    this.proxies.set(defaultPoolId, proxyList);

    // Set replenishment rule
    const defaultRule: ReplenishmentRule = {
      id: "rule-01",
      poolId: defaultPoolId,
      triggerThreshold: 15,
      replenishAmount: 25,
      maxLimitPerSUA: 10000,
      isActive: true
    };
    this.rules.set(defaultPoolId, defaultRule);

    // Generate 14 days of utilization history
    const history: UtilizationRecord[] = [];
    for (let i = 14; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      // Simulate a weekend dip in utilization
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseUsage = isWeekend ? 5 : 20;
      const randomVariance = Math.floor(Math.random() * 8) - 4;
      const active = Math.max(5, 35 - (baseUsage + randomVariance));
      const reserved = Math.max(2, baseUsage + randomVariance - 5);
      const used = Math.max(10, 50 - active - reserved);

      history.push({
        timestamp: date,
        activeCount: active,
        reservedCount: reserved,
        usedCount: used,
        totalTransactionsAmount: (used + reserved) * 1250
      });
    }
    this.utilizationHistory.set(defaultPoolId, history);
  }

  // ============================================================================
  // CORE POOL MANAGEMENT
  // ============================================================================

  public getAllPools(): ProxyPool[] {
    const allPools = Array.from(this.pools.values());
    for (const pool of allPools) {
      const activeProxies = this.proxies.get(pool.id)?.filter(p => p.status === "Active") || [];
      pool.currentSize = activeProxies.length;
    }
    return allPools;
  }

  public async listPools(): Promise<ProxyPool[]> {
    return this.getAllPools();
  }

  public async getPool(poolId: string): Promise<ProxyPool | null> {
    return this.pools.get(poolId) || null;
  }

  public createPool(
    nameOrData: string | Omit<ProxyPool, "id" | "currentSize" | "createdAt" | "updatedAt">,
    targetSize: number = 50,
    threshold: number = 15,
    maxCreditLimit: number = 10000,
    currency: string = "USD"
  ): ProxyPool {
    let poolConfig: Omit<ProxyPool, "id" | "currentSize" | "createdAt" | "updatedAt">;

    if (typeof nameOrData === "string") {
      poolConfig = {
        name: nameOrData,
        targetSize,
        threshold,
        currency,
        status: "Active",
        autoReplenish: true
      };
    } else {
      poolConfig = nameOrData;
    }

    const newPool: ProxyPool = {
      ...poolConfig,
      id: `pool-${uuidv4()}`,
      currentSize: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.pools.set(newPool.id, newPool);
    this.proxies.set(newPool.id, []);

    // Generate initial proxies
    const initialSize = newPool.targetSize || 25;
    const initialProxies: VisaSUAProxy[] = [];
    for (let i = 0; i < initialSize; i++) {
      initialProxies.push(this.generateSecureSUA(newPool.id, maxCreditLimit || 5000));
    }
    this.proxies.set(newPool.id, initialProxies);
    newPool.currentSize = initialProxies.length;

    // Set default replenishment rule
    this.rules.set(newPool.id, {
      id: `rule-${uuidv4().substring(0, 8)}`,
      poolId: newPool.id,
      triggerThreshold: newPool.threshold || 10,
      replenishAmount: Math.ceil((newPool.targetSize || 50) / 2),
      maxLimitPerSUA: maxCreditLimit || 10000,
      isActive: true
    });

    return newPool;
  }

  public requestProxy(poolId: string, amount: number = 1000, merchantName?: string): VisaSUAProxy {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Proxy pool ${poolId} does not exist.`);
    }

    const poolProxies = this.proxies.get(poolId) || [];
    let availableSUA = poolProxies.find(p => p.status === "Active" && p.availableBalance >= amount);

    if (!availableSUA) {
      // Auto-generate on demand
      availableSUA = this.generateSecureSUA(poolId, Math.max(amount * 1.5, 5000));
      poolProxies.push(availableSUA);
      this.proxies.set(poolId, poolProxies);
    }

    availableSUA.status = "Reserved";
    availableSUA.availableBalance = amount;
    availableSUA.lastUsedAt = new Date();
    
    // Update size
    pool.currentSize = poolProxies.filter(p => p.status === "Active").length;
    return availableSUA;
  }

  public releaseProxy(proxyId: string): void {
    let found = false;
    for (const [poolId, proxyList] of this.proxies.entries()) {
      const p = proxyList.find(x => x.id === proxyId || x.token === proxyId);
      if (p) {
        p.status = "Active";
        p.availableBalance = p.creditLimit;
        found = true;
        const pool = this.pools.get(poolId);
        if (pool) {
          pool.currentSize = proxyList.filter(x => x.status === "Active").length;
        }
        break;
      }
    }
    if (!found) {
      throw new Error(`Proxy ${proxyId} not found.`);
    }
  }

  public checkPoolHealth(poolId: string) {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found.`);
    }

    const proxyList = this.proxies.get(poolId) || [];
    const activeCount = proxyList.filter(p => p.status === "Active").length;
    const reservedCount = proxyList.filter(p => p.status === "Reserved").length;
    const usedCount = proxyList.filter(p => p.status === "Used").length;
    const healthScore = Math.min(100, Math.round((activeCount / Math.max(1, pool.targetSize)) * 100));

    return {
      poolId,
      name: pool.name,
      status: pool.status,
      currency: pool.currency,
      targetSize: pool.targetSize,
      currentActive: activeCount,
      reservedCount,
      usedCount,
      threshold: pool.threshold,
      healthScore,
      isHealthy: activeCount > pool.threshold,
      recommendedAction: activeCount <= pool.threshold ? 'TRIGGER_REPLENISHMENT' : 'NORMAL_OPERATION'
    };
  }

  public async updatePool(poolId: string, updates: Partial<Omit<ProxyPool, "id" | "createdAt" | "updatedAt">>): Promise<ProxyPool> {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Proxy pool with ID ${poolId} not found.`);
    }

    const updatedPool: ProxyPool = {
      ...pool,
      ...updates,
      updatedAt: new Date()
    };

    this.pools.set(poolId, updatedPool);
    return updatedPool;
  }

  // ============================================================================
  // PROXY ACCOUNT OPERATIONS
  // ============================================================================

  /**
   * Generates a secure, tokenized Single Use Account (SUA) proxy card
   */
  private generateSecureSUA(poolId: string, limit: number): VisaSUAProxy {
    const bin = "400000"; // Visa Classic/Commercial prefix
    const randomDigits = crypto.randomBytes(5).toString("hex").replace(/\D/g, "").substring(0, 9);
    const rawCard = bin + randomDigits;
    
    // Luhn Algorithm generator for valid card numbers
    let sum = 0;
    let shouldDouble = true;
    for (let i = rawCard.length - 1; i >= 0; i--) {
      let digit = parseInt(rawCard.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    const proxyCardNumber = rawCard + checkDigit;

    // Secure token generation
    const token = crypto.createHash("sha256").update(proxyCardNumber + uuidv4()).digest("hex").substring(0, 16).toUpperCase();
    
    const expDate = new Date();
    expDate.setMonth(expDate.getMonth() + 1); // SUAs typically expire in 30 days

    return {
      id: `sua-${uuidv4()}`,
      poolId,
      proxyCardNumber: `${proxyCardNumber.substring(0, 4)}********${proxyCardNumber.substring(12)}`,
      token,
      expirationDate: `${String(expDate.getMonth() + 1).padStart(2, "0")}/${String(expDate.getFullYear()).substring(2)}`,
      cvv: String(Math.floor(100 + Math.random() * 900)),
      creditLimit: limit,
      availableBalance: limit,
      status: "Active",
      createdAt: new Date()
    };
  }

  /**
   * Reserve an active SUA from the pool for an upcoming transaction
   */
  public async reserveSUA(poolId: string, amount: number): Promise<VisaSUAProxy> {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} does not exist.`);
    }

    const poolProxies = this.proxies.get(poolId) || [];
    const availableSUA = poolProxies.find(p => p.status === "Active" && p.availableBalance >= amount);

    if (!availableSUA) {
      // Trigger emergency replenishment alert
      await this.checkAndTriggerReplenishment(poolId);
      throw new Error(`No active SUAs available in pool ${poolId} with sufficient balance of ${amount}.`);
    }

    availableSUA.status = "Reserved";
    availableSUA.availableBalance = amount; // Lock the exact amount requested
    
    // Sync pool size
    await this.getPool(poolId);
    
    // Check if threshold is breached
    await this.checkAndTriggerReplenishment(poolId);

    return availableSUA;
  }

  /**
   * Release or settle a reserved SUA
   */
  public async settleSUA(poolId: string, suaId: string, finalAmount: number, status: "Used" | "Active"): Promise<VisaSUAProxy> {
    const poolProxies = this.proxies.get(poolId) || [];
    const sua = poolProxies.find(p => p.id === suaId);

    if (!sua) {
      throw new Error(`SUA ${suaId} not found in pool ${poolId}.`);
    }

    sua.status = status;
    sua.lastUsedAt = new Date();
    if (status === "Used") {
      sua.availableBalance = Math.max(0, sua.availableBalance - finalAmount);
    } else {
      // Returned to pool, restore original limit
      sua.availableBalance = sua.creditLimit;
    }

    await this.getPool(poolId);
    return sua;
  }

  // ============================================================================
  // REPLENISHMENT ENGINE
  // ============================================================================

  public async setReplenishmentRule(rule: ReplenishmentRule): Promise<ReplenishmentRule> {
    this.rules.set(rule.poolId, rule);
    return rule;
  }

  public async getReplenishmentRule(poolId: string): Promise<ReplenishmentRule | null> {
    return this.rules.get(poolId) || null;
  }

  /**
   * Evaluates pool health and triggers replenishment if threshold is breached
   */
  private async checkAndTriggerReplenishment(poolId: string): Promise<void> {
    const pool = this.pools.get(poolId);
    const rule = this.rules.get(poolId);

    if (!pool || !rule || !rule.isActive || !pool.autoReplenish) {
      return;
    }

    const activeCount = (this.proxies.get(poolId) || []).filter(p => p.status === "Active").length;

    if (activeCount <= rule.triggerThreshold) {
      console.log(`[VisaProxyPoolService] Threshold breached for pool ${poolId}. Active: ${activeCount}, Threshold: ${rule.triggerThreshold}. Triggering replenishment...`);
      await this.replenishPool(poolId, rule.replenishAmount);
    }
  }

  /**
   * Replenishes the pool with new secure SUAs
   */
  public async replenishPool(poolId: string, count: number): Promise<VisaSUAProxy[]> {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found.`);
    }

    const rule = this.rules.get(poolId);
    const limit = rule ? rule.maxLimitPerSUA : 5000;

    const newProxies: VisaSUAProxy[] = [];
    for (let i = 0; i < count; i++) {
      newProxies.push(this.generateSecureSUA(poolId, limit));
    }

    const currentProxies = this.proxies.get(poolId) || [];
    this.proxies.set(poolId, [...currentProxies, ...newProxies]);

    // Update pool size
    pool.currentSize = (this.proxies.get(poolId) || []).filter(p => p.status === "Active").length;
    pool.updatedAt = new Date();

    console.log(`[VisaProxyPoolService] Successfully replenished pool ${poolId} with ${count} new SUAs.`);
    return newProxies;
  }

  // ============================================================================
  // GEMINI AI INTEGRATION
  // ============================================================================

  /**
   * Forecasts pool utilization and recommends optimal pool sizes using Gemini
   */
  public async forecastPoolUtilization(poolId: string): Promise<ForecastResult> {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found.`);
    }

    const history = this.utilizationHistory.get(poolId) || [];
    const activeProxies = this.proxies.get(poolId) || [];
    const activeCount = activeProxies.filter(p => p.status === "Active").length;
    const reservedCount = activeProxies.filter(p => p.status === "Reserved").length;
    const usedCount = activeProxies.filter(p => p.status === "Used").length;

    if (!this.geminiAI) {
      // Fallback heuristic engine if Gemini API is not configured
      const historicalAvg = history.reduce((acc, curr) => acc + curr.usedCount, 0) / (history.length || 1);
      const forecastedRate = Math.min(100, Math.round((historicalAvg / pool.targetSize) * 100));
      const recommendedSize = Math.max(20, Math.round(historicalAvg * 2.5));
      const riskLevel = forecastedRate > 85 ? "High" : forecastedRate > 60 ? "Medium" : "Low";
      
      return {
        forecastedUtilizationRate: forecastedRate,
        recommendedPoolSize: recommendedSize,
        riskLevel,
        replenishmentUrgency: activeCount <= pool.threshold ? "Critical" : forecastedRate > 80 ? "High" : "Low",
        analysis: `[Fallback Mode] Based on historical average usage of ${historicalAvg.toFixed(1)} SUAs per day, the forecasted utilization rate is ${forecastedRate}%. Recommended pool size is adjusted to ${recommendedSize} to maintain a safe buffer.`
      };
    }

    try {
      const model = this.geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are an expert financial liquidity analyst specializing in Visa Single Use Account (SUA) proxy pools.
        Analyze the following pool configuration and historical utilization data to forecast utilization, recommend optimal pool sizes, and assess risk.

        POOL CONFIGURATION:
        - Pool Name: ${pool.name}
        - Currency: ${pool.currency}
        - Target Pool Size: ${pool.targetSize}
        - Replenishment Threshold: ${pool.threshold}
        - Current Active SUAs: ${activeCount}
        - Current Reserved SUAs: ${reservedCount}
        - Current Used SUAs: ${usedCount}

        HISTORICAL UTILIZATION DATA (Last 15 Days):
        ${JSON.stringify(history.map(h => ({
          date: h.timestamp.toISOString().split('T')[0],
          active: h.activeCount,
          reserved: h.reservedCount,
          used: h.usedCount,
          volume: h.totalTransactionsAmount
        })), null, 2)}

        Provide your analysis in a strict JSON format with the following keys:
        - "forecastedUtilizationRate": (number, 0 to 100 representing forecasted utilization percentage for the next 30 days)
        - "recommendedPoolSize": (number, recommended target pool size based on velocity)
        - "riskLevel": (string, "Low", "Medium", or "High")
        - "replenishmentUrgency": (string, "Low", "Medium", "High", or "Critical")
        - "analysis": (string, a concise, professional 3-4 sentence summary explaining the forecast, velocity trends, and reasoning behind the recommendation)

        Do not include any markdown formatting, code blocks, or extra text. Return raw JSON only.
      `;

      const response = await model.generateContent(prompt);
      const text = response.response.text().trim();
      
      // Clean up potential markdown code block wrappers if Gemini returned them despite instructions
      const cleanJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
      const result: ForecastResult = JSON.parse(cleanJson);
      
      return result;
    } catch (error) {
      console.error("Error generating utilization forecast with Gemini:", error);
      // Graceful fallback
      return {
        forecastedUtilizationRate: 65,
        recommendedPoolSize: pool.targetSize,
        riskLevel: "Medium",
        replenishmentUrgency: "Medium",
        analysis: "Unable to generate AI forecast due to an upstream API error. Utilizing baseline fallback metrics."
      };
    }
  }

  /**
   * Generates a natural language replenishment alert message using Gemini
   */
  public async generateReplenishmentAlert(poolId: string): Promise<string> {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found.`);
    }

    const activeCount = (this.proxies.get(poolId) || []).filter(p => p.status === "Active").length;

    if (!this.geminiAI) {
      return `[ALERT] Visa SUA Pool "${pool.name}" has breached its replenishment threshold. Current active accounts: ${activeCount}. Threshold: ${pool.threshold}. Automated replenishment has been triggered.`;
    }

    try {
      const model = this.geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Generate a professional, urgent, yet concise automated Slack/Email alert notification for a corporate treasury team.
        The Visa Single Use Account (SUA) proxy pool "${pool.name}" has breached its safety threshold.
        
        Details:
        - Current Active SUAs: ${activeCount}
        - Threshold Limit: ${pool.threshold}
        - Target Pool Size: ${pool.targetSize}
        - Currency: ${pool.currency}
        - Action Taken: Automated replenishment triggered to generate new secure proxy tokens.

        Write a 2-3 sentence alert that highlights the risk of transaction declines if replenishment fails, and confirms that the automated system is currently provisioning new accounts.
      `;

      const response = await model.generateContent(prompt);
      return response.response.text().trim();
    } catch (error) {
      console.error("Error generating replenishment alert with Gemini:", error);
      return `[ALERT] Visa SUA Pool "${pool.name}" is running low. Active accounts: ${activeCount}/${pool.targetSize}. Automated replenishment is in progress.`;
    }
  }
}

export const visaProxyPoolService = new VisaProxyPoolService();
export default visaProxyPoolService;