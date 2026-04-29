// Ported from old/lib/contact-security.ts. Framework-agnostic (Web standards only).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const allowedTopics = new Set([
  "AEGIS PDNS",
  "Services",
  "Partnership",
  "General Inquiry",
]);

// Strip ASCII control characters (U+0000-U+001F + U+007F) and collapse whitespace.
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");

export function sanitize(value, max = 5000) {
  if (typeof value !== "string") return "";
  return value
    .replace(CONTROL_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email);
}

export function getClientIp(request) {
  // Cloudflare provides the real client IP in this header.
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function validateContactPayload(body) {
  const record = body && typeof body === "object" ? body : {};

  const name = sanitize(record.name, 120);
  const email = sanitize(record.email, 200).toLowerCase();
  const topic = sanitize(record.topic, 80);
  const message = sanitize(record.message, 4000);
  const companyWebsite = sanitize(record.companyWebsite, 200);
  const turnstileToken = sanitize(record.turnstileToken, 2048);

  const fieldErrors = {};

  if (!name) fieldErrors.name = "Name is required.";
  if (!email) fieldErrors.email = "Email is required.";
  else if (!isValidEmail(email)) fieldErrors.email = "Email format is invalid.";
  if (!topic) fieldErrors.topic = "Topic is required.";
  else if (!allowedTopics.has(topic)) fieldErrors.topic = "Topic is invalid.";
  if (!message) fieldErrors.message = "Message is required.";

  return {
    values: { name, email, topic, message, companyWebsite, turnstileToken },
    fieldErrors,
  };
}

export function isTurnstileConfigured(env) {
  return Boolean(env && env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SITE_KEY);
}

export async function validateTurnstileToken(env, token, ip) {
  const secretKey = env && env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return { ok: false, code: "TURNSTILE_NOT_CONFIGURED" };
  if (!token) return { ok: false, code: "TURNSTILE_TOKEN_REQUIRED" };

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    );
    if (!response.ok) return { ok: false, code: "TURNSTILE_UNAVAILABLE" };
    const json = await response.json();
    if (!json.success) return { ok: false, code: "TURNSTILE_REJECTED" };
    return { ok: true, code: "TURNSTILE_OK" };
  } catch (_e) {
    return { ok: false, code: "TURNSTILE_UNAVAILABLE" };
  }
}
