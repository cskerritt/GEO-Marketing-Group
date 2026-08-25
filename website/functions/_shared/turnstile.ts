export const TURNSTILE_SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';
export const TURNSTILE_TOKEN_MAX_LENGTH = 2048;

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type TurnstileResult =
  | { ok: true }
  | { ok: false; kind: 'configuration' | 'invalid' | 'unavailable'; reason: string };

interface VerifyTurnstileOptions {
  secret: unknown;
  token: unknown;
  remoteIp: string | null;
  expectedAction: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function verifyTurnstile({
  secret,
  token,
  remoteIp,
  expectedAction,
  fetchImpl = fetch,
  timeoutMs = 8_000,
}: VerifyTurnstileOptions): Promise<TurnstileResult> {
  if (typeof secret !== 'string' || secret.trim().length === 0) {
    return { ok: false, kind: 'configuration', reason: 'missing-secret' };
  }
  if (
    typeof token !== 'string' ||
    token.length === 0 ||
    token.length > TURNSTILE_TOKEN_MAX_LENGTH
  ) {
    return { ok: false, kind: 'invalid', reason: 'invalid-token' };
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);
  if (remoteIp) formData.append('remoteip', remoteIp.slice(0, 128));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(TURNSTILE_SITEVERIFY_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    if (!response.ok) {
      return { ok: false, kind: 'unavailable', reason: `http-${response.status}` };
    }

    const result: unknown = await response.json();
    if (!isRecord(result)) {
      return { ok: false, kind: 'unavailable', reason: 'malformed-response' };
    }
    if (result.success !== true) {
      return { ok: false, kind: 'invalid', reason: 'siteverify-rejected' };
    }
    if (result.action !== expectedAction) {
      return { ok: false, kind: 'invalid', reason: 'action-mismatch' };
    }
    return { ok: true };
  } catch {
    return { ok: false, kind: 'unavailable', reason: 'request-failed' };
  } finally {
    clearTimeout(timeout);
  }
}
