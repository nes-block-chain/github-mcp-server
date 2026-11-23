import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient } from './api-client.mjs';

test('rejects insecure remote API URLs', () => {
  assert.throws(() => createApiClient({ baseUrl: 'http://example.com', getAccessToken: () => 'x' }), /HTTPS/);
});
test('rejects protocol-relative paths', async () => {
  const api = createApiClient({ baseUrl: 'https://example.com', getAccessToken: () => 'x', fetchImpl: () => { throw Error('must not fetch'); } });
  await assert.rejects(api('//evil.example'), /root-relative/);
});
test('sends bearer token to approved origin', async () => {
  const api = createApiClient({
    baseUrl: 'https://example.com',
    getAccessToken: async () => 'test-token',
    fetchImpl: async (url, options) => {
      assert.equal(url.href, 'https://example.com/api/items');
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      assert.equal(options.redirect, 'error');
      return { ok: true, status: 200, json: async () => ({ items: [] }) };
    }
  });
  assert.deepEqual(await api('/api/items'), { items: [] });
});
