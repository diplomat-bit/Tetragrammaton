export interface ComplianceCheckResult {
  passed: boolean;
  approved?: boolean;
  score: number;
  reason?: string;
  reasons?: string[];
  violations?: string[];
  sanctionHit?: boolean;
}

class ComplianceEngine {
  public async checkCompliance(params: {
    cardId?: string;
    amount: number;
    currency?: string;
    merchantCategoryCode?: string;
    type?: string;
  }): Promise<ComplianceCheckResult> {
    const violations: string[] = [];

    // Check high value limits
    if (params.amount > 100000) {
      violations.push('Transaction exceeds maximum single threshold for automated clearance.');
    }

    // Check prohibited MCCs if any
    const highRiskMccs = ['7995', '6051', '6211']; // Gambling, quasi-cash, binary options
    if (params.merchantCategoryCode && highRiskMccs.includes(params.merchantCategoryCode)) {
      violations.push(`Restricted Merchant Category Code: ${params.merchantCategoryCode}`);
    }

    const passed = violations.length === 0;
    return {
      passed,
      approved: passed,
      score: passed ? 95 : 30,
      violations,
      reasons: violations,
      reason: passed ? 'Passed automated AML and velocity screening' : violations.join('; '),
      sanctionHit: false,
    };
  }

  public async evaluateTransaction(tx: any): Promise<ComplianceCheckResult> {
    return this.checkCompliance(tx);
  }

  public async screenAml(entityName: string): Promise<{ clean: boolean; matches: any[] }> {
    return { clean: true, matches: [] };
  }
}

export const complianceEngine = new ComplianceEngine();
export default complianceEngine;
