/**
 * Cloudflare Pages Function: /api/audit
 *
 * Receives the audit form POST, validates the payload, and emails the request
 * to the founder via MailChannels (free Cloudflare-native send) or Resend
 * (configurable). Spam protected by honeypot field.
 *
 * Environment variables (set in Cloudflare Pages dashboard):
 *   AUDIT_TO_EMAIL    — destination address (e.g., chris@geostudio.io)
 *   AUDIT_FROM_EMAIL  — sender (must be on a verified domain), e.g., audit@geostudio.io
 *   RESEND_API_KEY    — optional; if set, uses Resend instead of MailChannels
 */

interface Env {
  AUDIT_TO_EMAIL?: string;
  AUDIT_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
}

interface AuditPayload {
  name: string;
  email: string;
  firm: string;
  website: string;
  industry: string;
  size: string;
  context?: string;
  hp_field?: string;
}

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml(p: AuditPayload): string {
  const safe = (s: string | undefined) => htmlEscape(s ?? '');
  return `
    <h1>New GEO Audit request</h1>
    <p><strong>Name:</strong> ${safe(p.name)}<br>
       <strong>Email:</strong> ${safe(p.email)}<br>
       <strong>Firm:</strong> ${safe(p.firm)}<br>
       <strong>Website:</strong> ${safe(p.website)}<br>
       <strong>Industry:</strong> ${safe(p.industry)}<br>
       <strong>Size:</strong> ${safe(p.size)}</p>
    <h2>Context</h2>
    <p>${safe(p.context || '(none provided)').replace(/\n/g, '<br>')}</p>
  `;
}

async function sendViaMailChannels(env: Env, p: AuditPayload): Promise<Response> {
  const to = env.AUDIT_TO_EMAIL!;
  const from = env.AUDIT_FROM_EMAIL!;
  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from, name: 'GEO Audit Form' },
    reply_to: { email: p.email, name: p.name },
    subject: `[GEO Audit] ${p.firm} — ${p.industry}`,
    content: [
      {
        type: 'text/html',
        value: buildEmailHtml(p),
      },
    ],
  };
  return await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function sendViaResend(env: Env, p: AuditPayload): Promise<Response> {
  return await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY!}`,
    },
    body: JSON.stringify({
      from: env.AUDIT_FROM_EMAIL!,
      to: [env.AUDIT_TO_EMAIL!],
      reply_to: p.email,
      subject: `[GEO Audit] ${p.firm} — ${p.industry}`,
      html: buildEmailHtml(p),
    }),
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: AuditPayload;
  const contentType = request.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else {
      const fd = await request.formData();
      payload = {
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        firm: String(fd.get('firm') ?? ''),
        website: String(fd.get('website') ?? ''),
        industry: String(fd.get('industry') ?? ''),
        size: String(fd.get('size') ?? ''),
        context: String(fd.get('context') ?? ''),
        hp_field: String(fd.get('hp_field') ?? ''),
      };
    }
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  // Honeypot — silent drop
  if (payload.hp_field) {
    return Response.redirect(new URL('/audit/thanks', request.url).toString(), 303);
  }

  // Minimum validation
  if (!payload.name || !payload.email || !payload.firm) {
    return new Response('Missing required fields', { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return new Response('Invalid email', { status: 400 });
  }

  if (!env.AUDIT_TO_EMAIL || !env.AUDIT_FROM_EMAIL) {
    return new Response('Server misconfigured: missing email env vars', { status: 500 });
  }

  let res: Response;
  if (env.RESEND_API_KEY) {
    res = await sendViaResend(env, payload);
  } else {
    res = await sendViaMailChannels(env, payload);
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Email send failed', res.status, errorText);
    return new Response('Failed to deliver request. Please email us directly.', { status: 502 });
  }

  return Response.redirect(new URL('/audit/thanks', request.url).toString(), 303);
};
