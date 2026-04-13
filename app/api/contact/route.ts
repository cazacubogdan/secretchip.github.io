import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const allowedTopics = new Set(['AEGIS PDNS', 'Services', 'Partnership', 'General Inquiry']);

function sanitize(value: unknown, max = 5000) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = sanitize(body?.name, 120);
    const email = sanitize(body?.email, 200).toLowerCase();
    const topic = sanitize(body?.topic, 80);
    const message = sanitize(body?.message, 4000);

    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = 'Name is required.';
    if (!email) fieldErrors.email = 'Email is required.';
    else if (!isValidEmail(email)) fieldErrors.email = 'Email format is invalid.';
    if (!topic) fieldErrors.topic = 'Topic is required.';
    else if (!allowedTopics.has(topic)) fieldErrors.topic = 'Topic is invalid.';
    if (!message) fieldErrors.message = 'Message is required.';

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ error: 'Validation failed.', fieldErrors }, { status: 422 });
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

    await transporter.sendMail({
      from: smtpFrom,
      to: contactTo,
      replyTo: email,
      subject: `[SecretChip Contact] ${topic} - ${name}`,
      text: `New contact request\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`,
      html: `<p><strong>New contact request</strong></p><p><strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}<br/><strong>Topic:</strong> ${topic}</p><p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`
    });

    return NextResponse.json({ ok: true, message: 'Your inquiry was sent successfully.' });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Contact submission failed.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
