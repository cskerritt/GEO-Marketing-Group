export const MAX_REQUEST_BYTES = 32 * 1024;

export class BadRequestError extends Error {
  constructor(message = 'Bad request') {
    super(message);
    this.name = 'BadRequestError';
  }
}

export interface StringFieldRule {
  label: string;
  maxLength: number;
  required?: boolean;
  multiline?: boolean;
}

export type StringFieldRules = Record<string, StringFieldRule>;
export type ParsedStringPayload<T extends StringFieldRules> = {
  [K in keyof T]: string;
};

const hasOwn = (value: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

async function readBoundedBody(request: Request): Promise<Uint8Array> {
  const contentLength = request.headers.get('content-length');
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_REQUEST_BYTES) {
      throw new BadRequestError('Request body is too large');
    }
  }

  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new BadRequestError('Request body is too large');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function decodeUtf8(body: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(body);
  } catch {
    throw new BadRequestError('Malformed request body');
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function parseRawPayload(
  request: Request,
  body: Uint8Array,
  fieldNames: string[],
): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') ?? '';
  const mediaType = contentType.split(';', 1)[0]?.trim().toLowerCase();

  if (mediaType === 'application/json' || mediaType.endsWith('+json')) {
    let value: unknown;
    try {
      value = JSON.parse(decodeUtf8(body));
    } catch (error) {
      if (error instanceof BadRequestError) throw error;
      throw new BadRequestError('Malformed JSON payload');
    }
    if (!isRecord(value)) throw new BadRequestError('JSON payload must be an object');
    return value;
  }

  let formData: FormData;
  if (mediaType === 'application/x-www-form-urlencoded') {
    formData = new FormData();
    const params = new URLSearchParams(decodeUtf8(body));
    for (const [key, value] of params) formData.append(key, value);
  } else if (mediaType === 'multipart/form-data') {
    try {
      formData = await new Request(request.url, {
        method: 'POST',
        headers: { 'content-type': contentType },
        body,
      }).formData();
    } catch {
      throw new BadRequestError('Malformed form payload');
    }
  } else {
    throw new BadRequestError('Unsupported request content type');
  }

  const value: Record<string, unknown> = {};
  for (const fieldName of fieldNames) {
    const entries = formData.getAll(fieldName);
    if (entries.length > 1) throw new BadRequestError(`Duplicate field: ${fieldName}`);
    if (entries.length === 1) value[fieldName] = entries[0];
  }
  return value;
}

function normalizeField(value: string, rule: StringFieldRule): string {
  const normalized = value.trim();
  if (normalized.length > rule.maxLength) {
    throw new BadRequestError(`${rule.label} is too long`);
  }
  if (rule.required && normalized.length === 0) {
    throw new BadRequestError(`Missing required field: ${rule.label}`);
  }
  if (/\0|[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(normalized)) {
    throw new BadRequestError(`${rule.label} contains invalid characters`);
  }
  if (!rule.multiline && /[\r\n]/.test(normalized)) {
    throw new BadRequestError(`${rule.label} must be a single line`);
  }
  return normalized;
}

export async function parseStringPayload<T extends StringFieldRules>(
  request: Request,
  rules: T,
): Promise<ParsedStringPayload<T>> {
  let raw: Record<string, unknown>;
  try {
    const body = await readBoundedBody(request);
    raw = await parseRawPayload(request, body, Object.keys(rules));
  } catch (error) {
    if (error instanceof BadRequestError) throw error;
    throw new BadRequestError('Malformed request body');
  }

  const parsed: Record<string, string> = {};
  for (const [fieldName, rule] of Object.entries(rules)) {
    const value = hasOwn(raw, fieldName) ? raw[fieldName] : '';
    if (typeof value !== 'string') {
      throw new BadRequestError(`${rule.label} must be a string`);
    }
    parsed[fieldName] = normalizeField(value, rule);
  }
  return parsed as ParsedStringPayload<T>;
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname);
  } catch {
    return false;
  }
}
