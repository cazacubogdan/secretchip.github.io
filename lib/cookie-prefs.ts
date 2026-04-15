export type CookiePrefs = { necessary: true; analytics: boolean; embeds: boolean };

export const COOKIE_PREFS_KEY = 'secretchip-cookie-prefs';
export const COOKIE_CONSENT_KEY = 'secretchip-cookie-consent';

export const defaultCookiePrefs: CookiePrefs = { necessary: true, analytics: false, embeds: false };

export function parseCookiePrefs(raw: string | null): CookiePrefs {
  if (!raw) return defaultCookiePrefs;

  try {
    const parsed = JSON.parse(raw) as Partial<CookiePrefs>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      embeds: Boolean(parsed.embeds)
    };
  } catch {
    return defaultCookiePrefs;
  }
}
