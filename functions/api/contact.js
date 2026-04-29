// Cloudflare Pages Function — POST /api/contact
//
// Required env vars (set in Cloudflare dashboard, NOT committed):
//   RESEND_API_KEY     — Resend API key (or substitute another HTTP mail provider)
//   CONTACT_TO         — recipient address (e.g. hello@secretchip.net)
//   CONTACT_FROM       — verified sender (e.g. "SecretChip <noreply@secretchip.net>")
//
// Optional:
//   TURNSTILE_SECRET_KEY  — server secret for Cloudflare Turnstile validation
//   TURNSTILE_SITE_KEY    — exposed at build time so the contact page renders the widget
//
// Without RESEND_API_KEY (or substitute) the function returns CONTACT_NOT_CONFIGURED (503),
// which is a controlled error state — never a fake success.

import {
  escapeHtml,
  getClientIp,
  isTurnstileConfigured,
  validateContactPayload,
  validateTurnstileToken,
} from "../_lib/contact-security.js";
import { checkRateLimit } from "../_lib/rate-limit.js";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const ip = getClientIp(request);

    const decision = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!decision.allowed) {
      return json(
        { error: "Too many contact submissions. Please wait and try again.", code: "RATE_LIMITED" },
        {
          status: 429,
          headers: {
            "Retry-After": String(decision.retryAfterSeconds),
            "X-RateLimit-Limit": String(decision.limit),
            "X-RateLimit-Remaining": String(decision.remaining),
          },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { values, fieldErrors } = validateContactPayload(body);

    if (Object.keys(fieldErrors).length > 0) {
      return json({ error: "Validation failed.", fieldErrors }, { status: 422 });
    }

    if (values.companyWebsite) {
      return json({ error: "Submission blocked.", code: "ABUSE_DETECTED" }, { status: 400 });
    }

    if (isTurnstileConfigured(env)) {
      const t = await validateTurnstileToken(env, values.turnstileToken, ip);
      if (!t.ok) {
        return json({ error: "Verification failed. Please try again.", code: t.code }, { status: 400 });
      }
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
      return json(
        { error: "Contact delivery is not configured on this environment.", code: "CONTACT_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    const safeName = escapeHtml(values.name);
    const safeEmail = escapeHtml(values.email);
    const safeTopic = escapeHtml(values.topic);
    const safeMessageHtml = escapeHtml(values.message).replace(/\n/g, "<br/>");

    const text = `New contact request

Name: ${values.name}
Email: ${values.email}
Topic: ${values.topic}

Message:
${values.message}
`;

    const html =
      `<p><strong>New contact request</strong></p>` +
      `<p><strong>Name:</strong> ${safeName}<br/>` +
      `<strong>Email:</strong> ${safeEmail}<br/>` +
      `<strong>Topic:</strong> ${safeTopic}</p>` +
      `<p><strong>Message:</strong><br/>${safeMessageHtml}</p>`;

    const sendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: values.email,
        subject: `[SecretChip Contact] ${values.topic} - ${values.name}`,
        text,
        html,
      }),
    });

    if (!sendResp.ok) {
      // Don't pretend success if delivery failed.
      return json({ error: "Contact submission failed." }, { status: 500 });
    }

    return json({ ok: true, message: "Your inquiry was sent successfully." });
  } catch (_err) {
    return json({ error: "Contact submission failed." }, { status: 500 });
  }
}

// Reject other methods cleanly so static handler doesn't try to serve HTML.
export function onRequest(context) {
  if (context.request.method === "POST") return onRequestPost(context);
  return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
}
