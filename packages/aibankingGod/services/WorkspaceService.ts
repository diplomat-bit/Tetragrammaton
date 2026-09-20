
/**
 * WorkspaceService
 * Handles interactions with Google Workspace APIs (Drive, Sheets, Gmail, Meet).
 */
import { securityService } from './SecurityService';

export class WorkspaceService {
  private static instance: WorkspaceService;
  private accessToken: string | null = null;
  private dpopKey: CryptoKeyPair | null = null;

  private constructor() {
    this.initializeDPoP().catch(err => console.error("DPoP Initialization Failure:", err));
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('sovereign_google_access_token');
      if (savedToken) {
        this.accessToken = savedToken;
      }
    }
  }

  /**
   * Initializes hardware-bound proof-of-possession keys (Simulated via SubtleCrypto)
   * This aligns with FAPI 2.0 / DPoP security requirements.
   */
  private async initializeDPoP() {
    try {
      this.dpopKey = await window.crypto.subtle.generateKey(
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["sign", "verify"]
      );
    } catch (err) {
      console.warn("Hardware Attestation (DPoP) not supported in this enclave.", err);
    }
  }

  private async generateDPoPProof(method: string, url: string): Promise<string | null> {
    if (!this.dpopKey) return null;

    const header = {
      typ: "dpop+jwt",
      alg: "ES256",
      jwk: await window.crypto.subtle.exportKey("jwk", this.dpopKey.publicKey),
    };

    const payload = {
      jti: Math.random().toString(36).substring(2),
      htm: method.toUpperCase(),
      htu: url.split('?')[0],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120, // 2 minute expiry
    };

    const encoder = new TextEncoder();
    const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    
    const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
    const signature = await window.crypto.subtle.sign(
      { name: "ECDSA", hash: { name: "SHA-256" } },
      this.dpopKey.privateKey,
      data
    );

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  public static getInstance(): WorkspaceService {
    if (!WorkspaceService.instance) {
      WorkspaceService.instance = new WorkspaceService();
    }
    return WorkspaceService.instance;
  }

  public setToken(token: string) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sovereign_google_access_token', token);
    }
  }

  public getToken(): string | null {
    return this.getEffectiveToken();
  }

  private getEffectiveToken(): string | null {
    const sovereignToken = securityService.getSessionToken();
    if (sovereignToken) return sovereignToken;
    return this.accessToken;
  }

  private async fetchGoogle(url: string, options: RequestInit = {}) {
    const token = this.getEffectiveToken();
    if (!token) {
      throw new Error("Neural Workspace Link: Access Denied. Synchronize Token first.");
    }

    const method = options.method || 'GET';
    const dpopProof = await this.generateDPoPProof(method, url);

    const headers: any = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    if (dpopProof) {
      headers['DPoP'] = dpopProof;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google API Error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  // --- DRIVE API ---
  public async listFiles(pageSize: number = 50, query?: string) {
    let url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&fields=files(id,name,mimeType,modifiedTime,size,iconLink,webViewLink,webContentLink,thumbnailLink,starred,trashed,owners,shared,createdTime)`;
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    } else {
      url += `&q=${encodeURIComponent("trashed = false")}`;
    }
    return this.fetchGoogle(url);
  }

  public async getFileMetadata(fileId: string) {
    return this.fetchGoogle(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,description,webViewLink,webContentLink,thumbnailLink,starred,size,modifiedTime,owners`);
  }

  public async uploadFile(file: File) {
    const token = this.getEffectiveToken();
    if (!token) throw new Error("No Google access token available for upload");

    const metadata = {
      name: file.name,
      mimeType: file.type || 'application/octet-stream'
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink,thumbnailLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Upload failed: ${err.error?.message || res.statusText}`);
    }
    return res.json();
  }

  public async deleteFile(fileId: string) {
    return this.fetchGoogle(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE'
    });
  }

  public async starFile(fileId: string, starred: boolean) {
    return this.fetchGoogle(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'PATCH',
      body: JSON.stringify({ starred }),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // --- SHEETS API ---
  public async getSpreadsheet(spreadsheetId: string) {
    return this.fetchGoogle(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`);
  }

  public async getSheetValues(spreadsheetId: string, range: string) {
    return this.fetchGoogle(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`);
  }

  // --- GMAIL API ---
  public async listMessages(maxResults: number = 20) {
    return this.fetchGoogle(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`);
  }

  public async getMessage(messageId: string) {
    return this.fetchGoogle(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`);
  }

  // --- CALENDAR API ---
  public async listEvents(calendarId: string = "primary", maxResults: number = 20) {
    return this.fetchGoogle(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?maxResults=${maxResults}&orderBy=startTime&singleEvents=true`);
  }

  public async createEvent(calendarId: string = "primary", event: any) {
    return this.fetchGoogle(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
      method: 'POST',
      body: JSON.stringify(event),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  public async deleteEvent(calendarId: string = "primary", eventId: string) {
    return this.fetchGoogle(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`, {
      method: 'DELETE'
    });
  }

  // --- TASKS API ---
  public async listTaskLists() {
    return this.fetchGoogle('https://tasks.googleapis.com/v1/users/@me/lists');
  }

  public async listTasks(taskListId: string = "@default", maxResults: number = 20) {
    return this.fetchGoogle(`https://tasks.googleapis.com/v1/lists/${taskListId}/tasks?maxResults=${maxResults}`);
  }

  public async createTask(taskListId: string = "@default", task: any) {
    return this.fetchGoogle(`https://tasks.googleapis.com/v1/lists/${taskListId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  public async updateTask(taskListId: string = "@default", taskId: string, task: any) {
    return this.fetchGoogle(`https://tasks.googleapis.com/v1/lists/${taskListId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // --- CONTACTS / PEOPLE API ---
  public async listContacts(pageSize: number = 20) {
    return this.fetchGoogle(`https://people.googleapis.com/v1/people/me/connections?pageSize=${pageSize}&personFields=names,emailAddresses,phoneNumbers,photos`);
  }

  public async createContact(contact: any) {
    return this.fetchGoogle('https://people.googleapis.com/v1/people:createContact', {
      method: 'POST',
      body: JSON.stringify(contact),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // --- DOCS API ---
  public async createDoc(title: string) {
    return this.fetchGoogle('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  public async getDoc(documentId: string) {
    return this.fetchGoogle(`https://docs.googleapis.com/v1/documents/${documentId}`);
  }

  // --- SLIDES API ---
  public async createPresentation(title: string) {
    return this.fetchGoogle('https://slides.googleapis.com/v1/presentations', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  public async getPresentation(presentationId: string) {
    return this.fetchGoogle(`https://slides.googleapis.com/v1/presentations/${presentationId}`);
  }

  // --- FORMS API ---
  public async getForm(formId: string) {
    return this.fetchGoogle(`https://forms.googleapis.com/v1/forms/${formId}`);
  }

  // --- MEET API (via Calendar or specialized API) ---
  public async createMeetingSpace() {
    // Note: Creating highly tactical meet spaces often involves Calendar API Event creation with conferenceData
    const event = {
      summary: 'Aquarius Sovereign Strategy Session',
      description: 'Tactical Workspace Nexus Meeting',
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    return this.fetchGoogle('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
      method: 'POST',
      body: JSON.stringify(event),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // --- PICKER HELPER ---
  public async showPicker(developerKey: string, clientId: string, callback: (data: any) => void) {
    // This typically runs in the window context. 
    // We'll provide the logic to be called from the component.
    if (!(window as any).google) return;
    
    const google = (window as any).google;
    const pickerApiLoaded = true; // Assume loaded if gsi is up or handle separately

    const show = () => {
      const view = new google.picker.View(google.picker.ViewId.DOCS);
      const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(clientId)
        .setOAuthToken(this.accessToken)
        .addView(view)
        .setDeveloperKey(developerKey)
        .setCallback(callback)
        .build();
      picker.setVisible(true);
    };

    if ((window as any).gapi) {
        (window as any).gapi.load('picker', { callback: show });
    }
  }
}

export const workspaceService = WorkspaceService.getInstance();
