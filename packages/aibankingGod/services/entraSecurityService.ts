import { CertRotationRecord, SovereignGraphOutput } from '../types/security';

export class EntraSecurityService {
  public static readonly TENANT_ID = "6666f090-016a-494b-b11a-4d3e01febe95";
  public static readonly MASTER_CLIENT_ID = "5058b232-bf3f-4de1-aa75-afdbad959a59";

  /**
   * Executes full directory X.509 Certificate Swarm rotation across registered app nodes.
   */
  public static async rotateCertificates(): Promise<{
    totalRotated: number;
    ledger: CertRotationRecord[];
    logs: string[];
  }> {
    const response = await fetch("/api/v1/orchestrator/cert-rotation", {
      method: "POST",
      headers: { "content-type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Entra Rotation Endpoint Error: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Retrieves the current Sovereign Universe Graph topology and active bridges.
   */
  public static async getUniverseGraph(): Promise<SovereignGraphOutput> {
    const response = await fetch("/api/v1/orchestrator/sovereign-graph", {
      method: "POST",
      headers: { "content-type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Sovereign Graph Endpoint Error: ${response.statusText}`);
    }

    return await response.json();
  }
}
