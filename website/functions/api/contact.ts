/** Cloudflare Pages Function: POST /api/contact */
import type { FormEnv } from '../_shared/env';
import {
  BadRequestError,
  isValidEmail,
  parseStringPayload,
  type ParsedStringPayload,
} from '../_shared/forms';
import { verifyTurnstile } from '../_shared/turnstile';

const CONTACT_FIELDS = {
  name: { label: 'name', maxLength: 120, required: true },
  email: { label: 'email', maxLength: 254, required: true },
  firm: { label: 'firm', maxLength: 200 },
  message: { label: 'message', maxLength: 5000, required: true, multiline: true },
  hp_field: { label: 'spam check', maxLength: 200 },
  'cf-turnstile-response': {
    label: 'verification',
    maxLength: 2048,
    required: true,
  },
} as const;

type ContactPayload = ParsedStringPayload<typeof CONTACT_FIELDS>;
type EmailEnv = Required<Pick<FormEnv, 'AUDIT_TO_EMAIL' | 'AUDIT_FROM_EMAIL' | 'RESEND_API_KEY'>>;

function hasEmailConfig(env: FormEnv): env is FormEnv & EmailEnv {
  return Boolean(env.AUDIT_TO_EMAIL && env.AUDIT_FROM_EMAIL && env.RESEND_API_KEY);
}

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml(payload: ContactPayload): string {
  const safe = (value: string) => htmlEscape(value);
  return `
    <h1>New contact message</h1>
    <p><strong>Name:</strong> ${safe(payload.name)}<br>
       <strong>Email:</strong> ${safe(payload.email)}<br>
       <strong>Firm:</strong> ${safe(payload.firm)}</p>
    <h2>Message</h2>
    <p>${safe(payload.message).replace(/\n/g, '<br>')}</p>
  `;
}

async function sendViaResend(env: EmailEnv, payload: ContactPayload): Promise<Response> {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.AUDIT_FROM_EMAIL,
      to: [env.AUDIT_TO_EMAIL],
      reply_to: payload.email,
      subject: `[Contact] ${payload.name}${payload.firm ? ` — ${payload.firm}` : ''}`,
      html: buildEmailHtml(payload),
    }),
  });
}

export const onRequestPost: PagesFunction<FormEnv> = async ({ request, env }) => {
  let payload: ContactPayload;
  try {
    payload = await parseStringPayload(request, CONTACT_FIELDS);
  } catch (error) {
    const message = error instanceof BadRequestError ? error.message : 'Bad request';
    return new Response(message, { status: 400 });
  }

  if (!isValidEmail(payload.email)) return new Response('Invalid email', { status: 400 });

  const turnstile = await verifyTurnstile({
    secret: env.TURNSTILE_SECRET_KEY,
    token: payload['cf-turnstile-response'],
    remoteIp: request.headers.get('CF-Connecting-IP'),
    expectedAction: 'contact',
  });
  if (!turnstile.ok) {
    console.warn('Turnstile rejected contact submission', turnstile.kind, turnstile.reason);
    const unavailable = turnstile.kind !== 'invalid';
    return new Response(
      unavailable ? 'Verification service unavailable. Please try again later.' : 'Verification failed. Please try again.',
      { status: unavailable ? 503 : 400 },
    );
  }

  // Preserve the honeypot's silent drop, but only after mandatory Turnstile validation.
  if (payload.hp_field) {
    return Response.redirect(new URL('/contact/thanks', request.url).toString(), 303);
  }

  if (!hasEmailConfig(env)) {
    console.error('Email service is missing required Resend configuration');
    return new Response('Email service unavailable. Please email us directly.', { status: 503 });
  }

  let response: Response;
  try {
    response = await sendViaResend(env, payload);
  } catch {
    console.error('Contact email request failed');
    return new Response('Failed to deliver message. Please email us directly.', { status: 502 });
  }

  if (!response.ok) {
    console.error('Contact email send failed', response.status, await response.text());
    return new Response('Failed to deliver message. Please email us directly.', { status: 502 });
  }
  return Response.redirect(new URL('/contact/thanks', request.url).toString(), 303);
};
