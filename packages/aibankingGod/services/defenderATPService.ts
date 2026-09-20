import { IsolatedMachineRecord } from '../types/security';

export class DefenderATPService {
  /**
   * Triggers automated isolation of a compromised endpoint machine via Defender ATP.
   */
  public static async isolateMachine(
    machineId: string,
    comment?: string,
    tenantId?: string
  ): Promise<IsolatedMachineRecord> {
    const payload = {
      tenantId: tenantId || "6666f090-016a-494b-b11a-4d3e01febe95",
      machineId,
      comment: comment || "Automated isolation by AI Security Orchestration Broker"
    };

    const response = await fetch("/api/v1/orchestrator/isolate-machine", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Defender ATP Isolation Error: ${response.statusText}`);
    }

    return await response.json();
  }
}
