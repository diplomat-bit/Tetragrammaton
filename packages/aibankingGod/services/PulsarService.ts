
/**
 * PULSAR STREAMING SERVICE v1.0
 * Direct integration with Datastax Astra Streaming / Apache Pulsar.
 * Handles authenticated WebSocket connections for real-time sovereign telemetry.
 */

export interface PulsarConfig {
  webServiceUrl: string;
  brokerServiceUrl: string;
  authPlugin: string;
  authParams: string;
  tlsAllowInsecureConnection: boolean;
  tlsEnableHostnameVerification: boolean;
}

export class PulsarService {
  private static instance: PulsarService;
  private config: PulsarConfig;
  private ws: WebSocket | null = null;

  private constructor() {
    this.config = {
      webServiceUrl: import.meta.env.VITE_PULSAR_WEB_SERVICE_URL || 'https://pulsar-gcp-australiase1.api.streaming.datastax.com',
      brokerServiceUrl: import.meta.env.VITE_PULSAR_BROKER_SERVICE_URL || 'pulsar+ssl://pulsar-gcp-australiase1.streaming.datastax.com:6651',
      authPlugin: import.meta.env.VITE_PULSAR_AUTH_PLUGIN || 'org.apache.pulsar.client.impl.auth.AuthenticationToken',
      authParams: import.meta.env.VITE_PULSAR_AUTH_TOKEN || '',
      tlsAllowInsecureConnection: import.meta.env.VITE_PULSAR_TLS_ALLOW_INSECURE_CONNECTION === 'true',
      tlsEnableHostnameVerification: import.meta.env.VITE_PULSAR_TLS_ENABLE_HOSTNAME_VERIFICATION !== 'false',
    };
  }

  public static getInstance(): PulsarService {
    if (!PulsarService.instance) {
      PulsarService.instance = new PulsarService();
    }
    return PulsarService.instance;
  }

  /**
   * Connects to a Pulsar topic via WebSocket (Datastax Astra Streaming)
   */
  public connect(tenant: string, namespace: string, topic: string, mode: 'producer' | 'consumer' = 'producer'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Construct WebSocket URL for Astra Streaming
        // wss://<broker-service-url>/ws/v2/<mode>/persistent/<tenant>/<namespace>/<topic>
        const wsBase = this.config.brokerServiceUrl.replace('pulsar+ssl://', 'wss://').replace(':6651', '');
        const wsUrl = `${wsBase}/ws/v2/${mode}/persistent/${tenant}/${namespace}/${topic}`;

        console.log(`[PULSAR] Initializing ${mode} link to topic: ${topic}...`);
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log(`[PULSAR] WebSocket Link ESTABLISHED for ${topic}`);
          resolve();
        };

        this.ws.onerror = (err) => {
          console.error(`[PULSAR] WebSocket Link FAILURE:`, err);
          reject(err);
        };

        this.ws.onmessage = (msg) => {
          console.log(`[PULSAR] Inbound Message from ${topic}:`, msg.data);
        };

        this.ws.onclose = () => {
          console.warn(`[PULSAR] WebSocket Link CLOSED for ${topic}`);
        };

      } catch (err) {
        reject(err);
      }
    });
  }

  public sendMessage(payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        payload: btoa(JSON.stringify(payload)),
        properties: {
          timestamp: Date.now().toString(),
          origin: "AQUARIUS_SOVEREIGN_NODE"
        }
      };
      this.ws.send(JSON.stringify(msg));
    } else {
      console.error("[PULSAR] Cannot send message: WebSocket is not open.");
    }
  }

  public getConfig() { return this.config; }
}

export const pulsarService = PulsarService.getInstance();
