import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BadRequestError,
  MAX_REQUEST_BYTES,
  parseStringPayload,
} from '../functions/_shared/forms.ts';
import { verifyTurnstile } from '../functions/_shared/turnstile.ts';

const RULES = {
  name: { label: 'name', maxLength: 10, required: true },
  note: { label: 'note', maxLength: 20, multiline: true },
  'cf-turnstile-response': { label: 'verification', maxLength: 2048, required: true },
};

const jsonRequest = (value) =>
  new Request('https://example.test/api', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof value === 'string' ? value : JSON.stringify(value),
  });

test('parses and trims runtime-safe JSON strings', async () => {
  const parsed = await parseStringPayload(
    jsonRequest({ name: ' Ada ', note: ' hello\nworld ', 'cf-turnstile-response': 'token' }),
    RULES,
  );
  assert.deepEqual(parsed, {
    name: 'Ada',
    note: 'hello\nworld',
    'cf-turnstile-response': 'token',
  });
});

test('rejects malformed, null, non-string, and oversized JSON payloads', async () => {
  for (const request of [
    jsonRequest('{'),
    jsonRequest(null),
    jsonRequest({ name: null, 'cf-turnstile-response': 'token' }),
    jsonRequest({ name: 42, 'cf-turnstile-response': 'token' }),
    jsonRequest({ name: 'too-long-name', 'cf-turnstile-response': 'token' }),
    jsonRequest(' '.repeat(MAX_REQUEST_BYTES + 1)),
  ]) {
    await assert.rejects(() => parseStringPayload(request, RULES), BadRequestError);
  }
});

test('parses URL-encoded and multipart forms and rejects duplicate fields', async () => {
  const encoded = new URLSearchParams({
    name: 'Grace',
    note: '',
    'cf-turnstile-response': 'token',
  });
  assert.equal(
    (
      await parseStringPayload(
        new Request('https://example.test/api', { method: 'POST', body: encoded }),
        RULES,
      )
    ).name,
    'Grace',
  );

  const multipart = new FormData();
  multipart.set('name', 'Lin');
  multipart.set('cf-turnstile-response', 'token');
  assert.equal(
    (
      await parseStringPayload(
        new Request('https://example.test/api', { method: 'POST', body: multipart }),
        RULES,
      )
    ).name,
    'Lin',
  );

  const duplicate = new URLSearchParams();
  duplicate.append('name', 'one');
  duplicate.append('name', 'two');
  duplicate.append('cf-turnstile-response', 'token');
  await assert.rejects(
    () =>
      parseStringPayload(
        new Request('https://example.test/api', { method: 'POST', body: duplicate }),
        RULES,
      ),
    BadRequestError,
  );
});

test('Siteverify sends the token and Cloudflare IP and enforces action', async () => {
  let submitted;
  const fetchImpl = async (_url, init) => {
    submitted = init.body;
    return Response.json({ success: true, action: 'contact' });
  };
  assert.deepEqual(
    await verifyTurnstile({
      secret: 'secret',
      token: 'token',
      remoteIp: '203.0.113.9',
      expectedAction: 'contact',
      fetchImpl,
    }),
    { ok: true },
  );
  assert.equal(submitted.get('secret'), 'secret');
  assert.equal(submitted.get('response'), 'token');
  assert.equal(submitted.get('remoteip'), '203.0.113.9');

  const mismatch = await verifyTurnstile({
    secret: 'secret',
    token: 'token',
    remoteIp: null,
    expectedAction: 'audit',
    fetchImpl,
  });
  assert.deepEqual(mismatch, { ok: false, kind: 'invalid', reason: 'action-mismatch' });
});

test('Siteverify fails closed for missing config, long tokens, and network errors', async () => {
  assert.equal(
    (await verifyTurnstile({ secret: '', token: 'token', remoteIp: null, expectedAction: 'audit' })).ok,
    false,
  );
  assert.equal(
    (
      await verifyTurnstile({
        secret: 'secret',
        token: 'x'.repeat(2049),
        remoteIp: null,
        expectedAction: 'audit',
      })
    ).ok,
    false,
  );
  assert.deepEqual(
    await verifyTurnstile({
      secret: 'secret',
      token: 'token',
      remoteIp: null,
      expectedAction: 'audit',
      fetchImpl: async () => {
        throw new Error('offline');
      },
    }),
    { ok: false, kind: 'unavailable', reason: 'request-failed' },
  );
});
