import { expect, test } from '@playwright/test';

test('homepage shows SecretChip and AEGIS hierarchy', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('SecretChip is the company. AEGIS PDNS is the flagship product.')).toBeVisible();
});

test('main navigation works for key routes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'AEGIS PDNS' }).first().click();
  await expect(page).toHaveURL(/\/aegis-pdns$/);

  await page.getByRole('link', { name: 'Contact' }).first().click();
  await expect(page).toHaveURL(/\/contact$/);
});

test('pdns page and dns test page load with controls', async ({ page }) => {
  await page.goto('/aegis-pdns');
  await expect(page.getByRole('heading', { name: 'AEGIS PDNS by SecretChip' })).toBeVisible();

  await page.goto('/aegis-pdns/test');
  await expect(page.getByText('Resolver endpoint selector')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Run all checks' })).toBeVisible();
});

test('contact page loads and validates form', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByText('Please correct the highlighted fields and try again.')).toBeVisible();
});

test('legal hub, client login, and cookie preferences routes are reachable', async ({ page }) => {
  await page.goto('/legal');
  await expect(page.getByRole('heading', { name: 'Legal and compliance' })).toBeVisible();

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Client Portal Coming Soon' })).toBeVisible();

  await page.goto('/legal/cookie-preferences');
  await expect(page.getByRole('heading', { name: 'Cookie preferences' })).toBeVisible();
});

test('cookie banner appears before consent', async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/');
  await expect(page.getByText('Optional analytics and embedded content cookies require your consent.')).toBeVisible();
});
