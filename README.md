# SecretChip website

This repository contains the SecretChip company site and AEGIS PDNS product pages built with Next.js.

## Setup

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Fill environment variables for your environment.

## Environment variables

### DNS test configuration
- `NEXT_PUBLIC_DOH_FILTERED` default: `https://dns.secretchip.net/dns-query`
- `NEXT_PUBLIC_DOH_OPEN` default: `https://nofilter.dns.secretchip.net/dns-query`
- `DNS_TEST_QUERY_DOMAIN` default: `example.com`
- `BLOCK_TEST_DOMAIN` default: `dns-block-test.secretchip.net`
- Optional UI labels:
  - `NEXT_PUBLIC_DNS_TEST_QUERY_DOMAIN`
  - `NEXT_PUBLIC_BLOCK_TEST_DOMAIN`

### SMTP configuration for `/api/contact`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `CONTACT_TO`

If SMTP values are missing, `/api/contact` returns a controlled `CONTACT_NOT_CONFIGURED` error.

### Optional Turnstile configuration
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

If Turnstile variables are set, the API requires a valid Turnstile token. If they are not set, contact protection still uses rate limiting and honeypot validation.

## Security and secrets guidance

- Never hardcode credentials or secret values in this repository.
- Store production secrets in GitHub Actions **Repository Secrets** or **Environment Secrets**.
- Reference those values in workflow `env` blocks.
- Keep `.env.local` and any secret-bearing files out of version control.

## Commands

- Lint:
  ```bash
  npm run lint
  ```
- Build:
  ```bash
  npm run build
  ```
- Unit and integration tests (Vitest):
  ```bash
  npm run test:unit
  ```
- End-to-end tests (Playwright):
  ```bash
  npm run test:e2e
  ```
- CI-oriented checks:
  ```bash
  npm run test:ci
  ```
