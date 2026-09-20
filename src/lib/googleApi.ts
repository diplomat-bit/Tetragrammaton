import { auth, googleProvider, getGoogleWorkspaceToken, setGoogleWorkspaceToken, clearGoogleWorkspaceToken } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export interface GoogleUserInfo {
  displayName?: string;
  email?: string;
  photoURL?: string;
  uid?: string;
}

export const executeGoogleSignIn = async (): Promise<{ token: string; user: GoogleUserInfo }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Extract access token from credential or STS
    const credential = (result as any)._tokenResponse?.oauthAccessToken || 
                       (result as any).credential?.accessToken;
    
    // In Firebase auth, the OAuth access token is returned in the auth result
    const accessToken = credential || (result.user as any).accessToken || (auth.currentUser as any)?.stsTokenManager?.accessToken;
    
    if (accessToken) {
      setGoogleWorkspaceToken(accessToken);
    }
    
    return {
      token: accessToken || getGoogleWorkspaceToken() || '',
      user: {
        displayName: result.user.displayName || 'Google Workspace User',
        email: result.user.email || '',
        photoURL: result.user.photoURL || '',
        uid: result.user.uid
      }
    };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const executeGoogleSignOut = async (): Promise<void> => {
  clearGoogleWorkspaceToken();
  await signOut(auth);
};

// Common Google API Call Wrapper with Authorization Header
export async function callGoogleApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getGoogleWorkspaceToken();
  if (!token) {
    throw new Error('No Google Workspace OAuth token found. Please connect your Google Account.');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearGoogleWorkspaceToken();
      throw new Error('Google OAuth session expired. Please reconnect your Google Account.');
    }
    const errBody = await res.text();
    let errorDetail = errBody;
    try {
      const parsed = JSON.parse(errBody);
      errorDetail = parsed.error?.message || errBody;
    } catch (_) {}
    throw new Error(`Google API Error (${res.status}): ${errorDetail}`);
  }

  return res.json();
}
