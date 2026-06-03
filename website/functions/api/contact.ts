/**
 * Cloudflare Pages Function: /api/contact
 *
 * Receives the general contact form POST, validates, and emails it to the
 * founder via MailChannels (default) or Resend (if RESEND_API_KEY set).
 * Spam protected by honeypot field. Mirrors functions/api/audit.ts.
 *
 * Env vars (Cloudflare Pages dashboard):
 *   AUDIT_TO_EMAIL    — destination address
 *   AUDIT_FROM_EMAIL  — verified sender address
 *   RESEND_API_KEY    — optional
 */

interface Env {
  AUDIT_TO_EMAIL?: string;
  AUDIT_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  firm?: string;
  message: string;
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

function buildEmailHtml(p: ContactPayload): string {
  const safe = (s: string | undefined) => htmlEscape(s ?? '');
  return `
    <h1>New contact message</h1>
    <p><strong>Name:</strong> ${safe(p.name)}<br>
       <strong>Email:</strong> ${safe(p.email)}<br>
       <strong>Firm:</strong> ${safe(p.firm)}</p>
    <h2>Message</h2>
    <p>${safe(p.message).replace(/\n/g, '<br>')}</p>
  `;
}

async function sendViaMailChannels(env: Env, p: ContactPayload): Promise<Response> {
  const body = {
    personalizations: [{ to: [{ email: env.AUDIT_TO_EMAIL! }] }],
    from: { email: env.AUDIT_FROM_EMAIL!, name: 'GEO Marketing Group — Contact Form' },
    reply_to: { email: p.email, name: p.name },
    subject: `[Contact] ${p.name}${p.firm ? ' — ' + p.firm : ''}`,
    content: [{ type: 'text/html', value: buildEmailHtml(p) }],
  };
  return await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function sendViaResend(env: Env, p: ContactPayload): Promise<Response> {
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
      subject: `[Contact] ${p.name}${p.firm ? ' — ' + p.firm : ''}`,
      html: buildEmailHtml(p),
    }),
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: ContactPayload;
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
        message: String(fd.get('message') ?? ''),
        hp_field: String(fd.get('hp_field') ?? ''),
      };
    }
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  if (payload.hp_field) {
    return Response.redirect(new URL('/contact/thanks', request.url).toString(), 303);
  }
  if (!payload.name || !payload.email || !payload.message) {
    return new Response('Missing required fields', { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return new Response('Invalid email', { status: 400 });
  }
  if (!env.AUDIT_TO_EMAIL || !env.AUDIT_FROM_EMAIL) {
    return new Response('Server misconfigured: missing email env vars', { status: 500 });
  }

  const res = env.RESEND_API_KEY ? await sendViaResend(env, payload) : await sendViaMailChannels(env, payload);
  if (!res.ok) {
    console.error('Contact email send failed', res.status, await res.text());
    return new Response('Failed to deliver message. Please email us directly.', { status: 502 });
  }
  return Response.redirect(new URL('/contact/thanks', request.url).toString(), 303);
};
