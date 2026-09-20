export async function fetchApi(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Error');
    return data;
  } else {
    const text = await res.text();
    if (text.includes('__cookie_check') || text.includes('<html')) {
      throw new Error('Authentication proxy intercepted the request. Please open the app in a new tab using the icon in the top right to enable cookies.');
    }
    throw new Error('Received unexpected non-JSON response from server.');
  }
}
