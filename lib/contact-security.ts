const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const allowedTopics = new Set(['AEGIS PDNS', 'Services', 'Partnership', 'General Inquiry']);

export function sanitize(value: unknown, max = 5000) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

export type ContactFieldErrors = Record<string, string>;

export function validateContactPayload(body: unknown): {
  values: { name: string; email: string; topic: string; message: string; companyWebsite: string; turnstileToken: string };
  fieldErrors: ContactFieldErrors;
} {
  const record = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;

  const name = sanitize(record.name, 120);
  const email = sanitize(record.email, 200).toLowerCase();
  const topic = sanitize(record.topic, 80);
  const message = sanitize(record.message, 4000);
  const companyWebsite = sanitize(record.companyWebsite, 200);
  const turnstileToken = sanitize(record.turnstileToken, 2048);

  const fieldErrors: ContactFieldErrors = {};

  if (!name) fieldErrors.name = 'Name is required.';
  if (!email) fieldErrors.email = 'Email is required.';
  else if (!isValidEmail(email)) fieldErrors.email = 'Email format is invalid.';
  if (!topic) fieldErrors.topic = 'Topic is required.';
  else if (!allowedTopics.has(topic)) fieldErrors.topic = 'Topic is invalid.';
  if (!message) fieldErrors.message = 'Message is required.';

  return {
    values: { name, email, topic, message, companyWebsite, turnstileToken },
    fieldErrors
  };
}

export function isTurnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function validateTurnstileToken(token: string, ip?: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return { ok: false, code: 'TURNSTILE_NOT_CONFIGURED' } as const;
  }

  if (!token) {
    return { ok: false, code: 'TURNSTILE_TOKEN_REQUIRED' } as const;
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token
  });

  if (ip) {
    body.set('remoteip', ip);
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store'
    });

    if (!response.ok) {
      return { ok: false, code: 'TURNSTILE_UNAVAILABLE' } as const;
    }

    const json = (await response.json()) as { success?: boolean };

    if (!json.success) {
      return { ok: false, code: 'TURNSTILE_REJECTED' } as const;
    }

    return { ok: true, code: 'TURNSTILE_OK' } as const;
  } catch {
    return { ok: false, code: 'TURNSTILE_UNAVAILABLE' } as const;
  }
}
