import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  escapeHtml,
  getClientIp,
  isTurnstileConfigured,
  validateContactPayload,
  validateTurnstileToken
} from '@/lib/contact-security';
import { contactRateLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // This in-memory limiter is replaceable. For multi-instance production deployments,
    // migrate this interface to a distributed store such as Redis.
    const limitDecision = contactRateLimiter.check(ip);
    if (!limitDecision.allowed) {
      return NextResponse.json(
        {
          error: 'Too many contact submissions. Please wait and try again.',
          code: 'RATE_LIMITED'
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(limitDecision.retryAfterSeconds),
            'X-RateLimit-Limit': String(limitDecision.limit),
            'X-RateLimit-Remaining': String(limitDecision.remaining)
          }
        }
      );
    }

    const body = await request.json();
    const { values, fieldErrors } = validateContactPayload(body);

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ error: 'Validation failed.', fieldErrors }, { status: 422 });
    }

    if (values.companyWebsite) {
      return NextResponse.json(
        {
          error: 'Submission blocked.',
          code: 'ABUSE_DETECTED'
        },
        { status: 400 }
      );
    }

    if (isTurnstileConfigured()) {
      const turnstileResult = await validateTurnstileToken(values.turnstileToken, ip);
      if (!turnstileResult.ok) {
        return NextResponse.json(
          {
            error: 'Verification failed. Please try again.',
            code: turnstileResult.code
          },
          { status: 400 }
        );
      }
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;
    const contactTo = process.env.CONTACT_TO || 'hello@secretchip.net';

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom || !contactTo) {
      return NextResponse.json(
        {
          error: 'Contact delivery is not configured on this environment.',
          code: 'CONTACT_NOT_CONFIGURED'
        },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass }
    });

    const safeName = escapeHtml(values.name);
    const safeEmail = escapeHtml(values.email);
    const safeTopic = escapeHtml(values.topic);
    const safeMessageHtml = escapeHtml(values.message).replace(/\n/g, '<br/>');

    await transporter.sendMail({
      from: smtpFrom,
      to: contactTo,
      replyTo: values.email,
      subject: `[SecretChip Contact] ${values.topic} - ${values.name}`,
      text: `New contact request\n\nName: ${values.name}\nEmail: ${values.email}\nTopic: ${values.topic}\n\nMessage:\n${values.message}`,
      html: `<p><strong>New contact request</strong></p><p><strong>Name:</strong> ${safeName}<br/><strong>Email:</strong> ${safeEmail}<br/><strong>Topic:</strong> ${safeTopic}</p><p><strong>Message:</strong><br/>${safeMessageHtml}</p>`
    });

    return NextResponse.json({ ok: true, message: 'Your inquiry was sent successfully.' });
  } catch {
    return NextResponse.json(
      {
        error: 'Contact submission failed.'
      },
      { status: 500 }
    );
  }
}
