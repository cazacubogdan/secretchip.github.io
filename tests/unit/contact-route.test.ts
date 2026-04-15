import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { contactRateLimiter } from '@/lib/rate-limit';

const sendMail = vi.fn();

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail }))
  }
}));

function buildRequest(body: Record<string, unknown>, ip = '198.51.100.10') {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip
    }
  });
}

describe('/api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    contactRateLimiter.clear();
    delete process.env.TURNSTILE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    process.env.SMTP_HOST = 'smtp.example.test';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';
    process.env.SMTP_FROM = 'noreply@secretchip.net';
    process.env.CONTACT_TO = 'hello@secretchip.net';
    sendMail.mockResolvedValue({ messageId: 'abc' });
  });

  it('rejects missing fields', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const response = await POST(buildRequest({}));
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.error).toContain('Validation failed');
    expect(json.fieldErrors.name).toBeDefined();
  });

  it('rejects invalid email', async () => {
    const { POST } = await import('@/app/api/contact/route');
    const response = await POST(
      buildRequest({
        name: 'Taylor',
        email: 'not-an-email',
        topic: 'AEGIS PDNS',
        message: 'Need more details.'
      })
    );

    const json = await response.json();
    expect(response.status).toBe(422);
    expect(json.fieldErrors.email).toContain('invalid');
  });

  it('returns controlled error when SMTP is not configured', async () => {
    delete process.env.SMTP_HOST;
    const { POST } = await import('@/app/api/contact/route');

    const response = await POST(
      buildRequest({
        name: 'Taylor',
        email: 'taylor@example.com',
        topic: 'AEGIS PDNS',
        message: 'Need more details.'
      })
    );

    const json = await response.json();
    expect(response.status).toBe(503);
    expect(json.code).toBe('CONTACT_NOT_CONFIGURED');
  });

  it('returns success when SMTP transport succeeds', async () => {
    const { POST } = await import('@/app/api/contact/route');

    const response = await POST(
      buildRequest({
        name: 'Taylor',
        email: 'taylor@example.com',
        topic: 'AEGIS PDNS',
        message: 'Need more details.'
      })
    );

    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it('does not return fake success when SMTP send fails', async () => {
    sendMail.mockRejectedValueOnce(new Error('smtp down'));
    const { POST } = await import('@/app/api/contact/route');

    const response = await POST(
      buildRequest({
        name: 'Taylor',
        email: 'taylor@example.com',
        topic: 'AEGIS PDNS',
        message: 'Need more details.'
      })
    );

    const json = await response.json();
    expect(response.status).toBe(500);
    expect(json.error).toBe('Contact submission failed.');
  });

  it('rejects honeypot submissions', async () => {
    const { POST } = await import('@/app/api/contact/route');

    const response = await POST(
      buildRequest({
        name: 'Taylor',
        email: 'taylor@example.com',
        topic: 'AEGIS PDNS',
        message: 'Need more details.',
        companyWebsite: 'https://spam.invalid'
      })
    );

    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.code).toBe('ABUSE_DETECTED');
  });

  it('enforces rate limits', async () => {
    const { POST } = await import('@/app/api/contact/route');

    const payload = {
      name: 'Taylor',
      email: 'taylor@example.com',
      topic: 'AEGIS PDNS',
      message: 'Need more details.'
    };

    for (let i = 0; i < 5; i += 1) {
      const response = await POST(buildRequest(payload, '203.0.113.200'));
      expect(response.status).toBe(200);
    }

    const blocked = await POST(buildRequest(payload, '203.0.113.200'));
    expect(blocked.status).toBe(429);
  });
});
