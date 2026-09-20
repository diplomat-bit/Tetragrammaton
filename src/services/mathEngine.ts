/**
 * Sovereign Mathematical Finance Core
 * Implements high-precision financial algorithms:
 * - Merton Structural Credit Risk (Distance to Default & Default Probability)
 * - Black-Scholes European Option Pricing (Call & Put)
 * - Altman Z-Score Bankruptcy Predictor
 * - Taylor Rule Optimal Monetary Policy Rate
 * - Herfindahl-Hirschman Index (HHI) Concentration Penalty & Portfolio Haircuts
 */

export interface MertonRiskMetrics {
  firmAssetValue: number;
  debtFaceValue: number;
  assetVolatility: number;
  riskFreeRate: number;
  timeToMaturityYears: number;
  distanceToDefault: number;
  probabilityOfDefault: number;
  creditRiskRating: string;
}

export interface BlackScholesResult {
  spotPrice: number;
  strikePrice: number;
  timeToExpiry: number;
  volatility: number;
  riskFreeRate: number;
  callPrice: number;
  putPrice: number;
  deltaCall: number;
  gamma: number;
  thetaCall: number;
  vega: number;
}

export interface AltmanZScoreResult {
  zScore: number;
  zone: 'SAFE' | 'GREY' | 'DISTRESS';
  bankruptcyProbability: string;
  ratios: {
    workingCapitalToAssets: number;
    retainedEarningsToAssets: number;
    ebitToAssets: number;
    marketValEquityToDebt: number;
    salesToAssets: number;
  };
}

export interface HhiConcentrationResult {
  hhiScore: number; // 0 to 10,000
  concentrationLevel: 'HIGHLY_DIVERSIFIED' | 'MODERATE' | 'HIGHLY_CONCENTRATED';
  volatilityHaircutPercent: number;
  adjustedLtvLimit: number;
}

export class MathEngine {
  // Standard Normal Cumulative Distribution Function approximation
  private static cdf(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x) / Math.SQRT2;

    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

    return 0.5 * (1.0 + sign * y);
  }

  // Standard Normal Probability Density Function
  private static pdf(x: number): number {
    return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  }

  /**
   * Merton Structural Credit Risk Model
   * Distance to Default (DD) = [ln(V/D) + (r + 0.5 * sigma_V^2) * T] / (sigma_V * sqrt(T))
   * Probability of Default (PD) = N(-DD)
   */
  public static calculateMertonRisk(params: {
    firmAssetValue: number;
    debtFaceValue: number;
    assetVolatility: number; // e.g. 0.25 for 25%
    riskFreeRate: number; // e.g. 0.045 for 4.5%
    timeToMaturityYears: number;
  }): MertonRiskMetrics {
    const { firmAssetValue: V, debtFaceValue: D, assetVolatility: sigma, riskFreeRate: r, timeToMaturityYears: T } = params;

    const numerator = Math.log(V / D) + (r + 0.5 * Math.pow(sigma, 2)) * T;
    const denominator = sigma * Math.sqrt(T);
    const distanceToDefault = numerator / denominator;
    const probabilityOfDefault = this.cdf(-distanceToDefault);

    let creditRiskRating = 'AAA';
    if (distanceToDefault < 1.0) creditRiskRating = 'CCC / HIGH DEFAULT RISK';
    else if (distanceToDefault < 2.0) creditRiskRating = 'BB / SPECULATIVE';
    else if (distanceToDefault < 3.0) creditRiskRating = 'BBB / INVESTMENT GRADE';
    else if (distanceToDefault < 4.5) creditRiskRating = 'A / STRONG';
    else creditRiskRating = 'AAA / PRIME SOVEREIGN';

    return {
      firmAssetValue: V,
      debtFaceValue: D,
      assetVolatility: sigma,
      riskFreeRate: r,
      timeToMaturityYears: T,
      distanceToDefault: Number(distanceToDefault.toFixed(4)),
      probabilityOfDefault: Number((probabilityOfDefault * 100).toFixed(4)),
      creditRiskRating
    };
  }

  /**
   * Black-Scholes European Option Pricing
   */
  public static calculateBlackScholes(params: {
    spotPrice: number;
    strikePrice: number;
    timeToExpiry: number; // in years
    volatility: number;
    riskFreeRate: number;
  }): BlackScholesResult {
    const { spotPrice: S, strikePrice: K, timeToExpiry: T, volatility: sigma, riskFreeRate: r } = params;

    const d1 = (Math.log(S / K) + (r + 0.5 * Math.pow(sigma, 2)) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const callPrice = S * this.cdf(d1) - K * Math.exp(-r * T) * this.cdf(d2);
    const putPrice = K * Math.exp(-r * T) * this.cdf(-d2) - S * this.cdf(-d1);

    const deltaCall = this.cdf(d1);
    const gamma = this.pdf(d1) / (S * sigma * Math.sqrt(T));
    const thetaCall = -(S * this.pdf(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * this.cdf(d2);
    const vega = S * Math.sqrt(T) * this.pdf(d1);

    return {
      spotPrice: S,
      strikePrice: K,
      timeToExpiry: T,
      volatility: sigma,
      riskFreeRate: r,
      callPrice: Number(callPrice.toFixed(4)),
      putPrice: Number(putPrice.toFixed(4)),
      deltaCall: Number(deltaCall.toFixed(4)),
      gamma: Number(gamma.toFixed(6)),
      thetaCall: Number(thetaCall.toFixed(4)),
      vega: Number(vega.toFixed(4))
    };
  }

  /**
   * Altman Z-Score for Manufacturing / Public Enterprises
   * Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5
   */
  public static calculateAltmanZScore(params: {
    workingCapital: number;
    totalAssets: number;
    retainedEarnings: number;
    ebit: number;
    marketValueOfEquity: number;
    totalLiabilities: number;
    sales: number;
  }): AltmanZScoreResult {
    const x1 = params.workingCapital / params.totalAssets;
    const x2 = params.retainedEarnings / params.totalAssets;
    const x3 = params.ebit / params.totalAssets;
    const x4 = params.marketValueOfEquity / params.totalLiabilities;
    const x5 = params.sales / params.totalAssets;

    const zScore = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5;

    let zone: 'SAFE' | 'GREY' | 'DISTRESS' = 'SAFE';
    let bankruptcyProbability = '< 5% (Strong Balance Sheet)';

    if (zScore < 1.81) {
      zone = 'DISTRESS';
      bankruptcyProbability = '> 80% within 2 years (High Default Risk)';
    } else if (zScore <= 2.99) {
      zone = 'GREY';
      bankruptcyProbability = '15% - 30% (Watchlist)';
    }

    return {
      zScore: Number(zScore.toFixed(3)),
      zone,
      bankruptcyProbability,
      ratios: {
        workingCapitalToAssets: Number(x1.toFixed(3)),
        retainedEarningsToAssets: Number(x2.toFixed(3)),
        ebitToAssets: Number(x3.toFixed(3)),
        marketValEquityToDebt: Number(x4.toFixed(3)),
        salesToAssets: Number(x5.toFixed(3))
      }
    };
  }

  /**
   * Taylor Rule for Monetary Policy Rate
   * i = r* + pi + 0.5*(pi - pi*) + 0.5*(y - y*)
   */
  public static calculateTaylorRule(params: {
    neutralRealRate?: number; // default 2.0%
    currentInflation: number; // e.g. 3.2%
    targetInflation?: number; // default 2.0%
    outputGapPercent: number; // e.g. 0.8%
  }): { prescribedTargetRate: number; inflationGap: number; outputGap: number } {
    const rStar = params.neutralRealRate ?? 2.0;
    const pi = params.currentInflation;
    const piStar = params.targetInflation ?? 2.0;
    const yGap = params.outputGapPercent;

    const inflationGap = pi - piStar;
    const prescribedTargetRate = rStar + pi + 0.5 * inflationGap + 0.5 * yGap;

    return {
      prescribedTargetRate: Number(prescribedTargetRate.toFixed(2)),
      inflationGap: Number(inflationGap.toFixed(2)),
      outputGap: Number(yGap.toFixed(2))
    };
  }

  /**
   * Herfindahl-Hirschman Index (HHI) for Portfolio Asset Concentration
   * HHI = Sum(s_i ^ 2), where s_i is percentage weight (0 to 100)
   */
  public static calculateHhiConcentration(weightsPercent: number[], baseLtv = 75.0): HhiConcentrationResult {
    const sumWeights = weightsPercent.reduce((acc, w) => acc + w, 0);
    const normalized = sumWeights > 0 ? weightsPercent.map(w => (w / sumWeights) * 100) : weightsPercent;

    const hhiScore = normalized.reduce((acc, s) => acc + Math.pow(s, 2), 0);

    let concentrationLevel: 'HIGHLY_DIVERSIFIED' | 'MODERATE' | 'HIGHLY_CONCENTRATED' = 'HIGHLY_DIVERSIFIED';
    let volatilityHaircutPercent = 0;

    if (hhiScore > 2500) {
      concentrationLevel = 'HIGHLY_CONCENTRATED';
      volatilityHaircutPercent = 20.0; // 20% haircut for concentrated collateral
    } else if (hhiScore > 1500) {
      concentrationLevel = 'MODERATE';
      volatilityHaircutPercent = 10.0;
    } else {
      concentrationLevel = 'HIGHLY_DIVERSIFIED';
      volatilityHaircutPercent = 2.5;
    }

    const adjustedLtvLimit = Number((baseLtv * (1 - volatilityHaircutPercent / 100)).toFixed(2));

    return {
      hhiScore: Number(hhiScore.toFixed(1)),
      concentrationLevel,
      volatilityHaircutPercent,
      adjustedLtvLimit
    };
  }
}
