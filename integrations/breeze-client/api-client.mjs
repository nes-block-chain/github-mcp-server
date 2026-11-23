/**
 * Optional authenticated JSON API adapter for a Breeze-backed dashboard.
 * This is NOT a direct MCP transport; expose only an authorized application API.
 */
export function createApiClient({ baseUrl, getAccessToken, fetchImpl = globalThis.fetch }) {
  if (typeof baseUrl !== 'string') throw new TypeError('baseUrl is required');
  const url = new URL(baseUrl);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
    throw new Error('API baseUrl must use HTTPS (HTTP allowed for localhost only)');
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error('API baseUrl must not contain credentials, query, or fragment');
  }
  if (typeof getAccessToken !== 'function') throw new TypeError('getAccessToken must be a function');
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');

  return async function request(path, { method = 'GET', body, signal } = {}) {
    if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
      throw new TypeError('path must be a root-relative API path');
    }
    const target = new URL(path, url.origin);
    if (target.origin !== url.origin) throw new Error('Cross-origin requests are forbidden');
    const token = await getAccessToken();
    if (typeof token !== 'string' || !token.trim()) throw new Error('Access token unavailable');
    const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const response = await fetchImpl(target, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body),
      signal, redirect: 'error', credentials: 'omit'
    });
    if (!response.ok) throw new Error(`API request failed: HTTP ${response.status}`);
    if (response.status === 204) return null;
    return response.json();
  };
}
