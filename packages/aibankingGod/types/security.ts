export interface EntraAppNode {
  id: string;
  appId: string;
  displayName: string;
  identifierUris: string[];
  keyCredentials?: Array<{
    keyId: string;
    type: string;
    usage: string;
    displayName: string;
    customKeyIdentifier?: string;
  }>;
}

export interface CertRotationRecord {
  ObjectID: string;
  ApplicationName: string;
  AppID: string;
  KeyID: string;
  Status: 'Rotated and Active' | 'Failed' | 'Pending';
  Timestamp: string;
  Scope?: string;
  PrivateKey?: string;
  PublicKeyCertificate?: string;
}

export interface IsolatedMachineRecord {
  success: boolean;
  tenantId: string;
  machineId: string;
  isolationType: 'Full' | 'Selective';
  status: 'ISOLATED' | 'FAILED';
  comment: string;
  timestamp: string;
}

export interface SovereignNode {
  ObjectID: string;
  Name: string;
  Type: 'Financial_Substrate' | 'Identity_Control_Plane' | 'Auditing_Layer' | 'Logistical_Edge';
  Scopes: string[];
  State: string;
  LastInteraction: string;
}

export interface SovereignEdge {
  source: string;
  target: string;
  relation: string;
}

export interface SovereignGraphOutput {
  Metadata: {
    GeneratedAt: string;
    TenantID?: string;
    TotalConnectedNodes: number;
    TotalActiveBridges: number;
    ExecutionStatus: string;
  };
  Nodes: Record<string, SovereignNode>;
  Edges: SovereignEdge[];
}
