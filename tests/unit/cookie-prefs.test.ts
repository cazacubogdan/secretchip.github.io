import { describe, expect, it } from 'vitest';
import { defaultCookiePrefs, parseCookiePrefs } from '@/lib/cookie-prefs';

describe('cookie preference helpers', () => {
  it('returns defaults on empty values', () => {
    expect(parseCookiePrefs(null)).toEqual(defaultCookiePrefs);
  });

  it('returns defaults on invalid json', () => {
    expect(parseCookiePrefs('{')).toEqual(defaultCookiePrefs);
  });

  it('normalizes provided values safely', () => {
    expect(parseCookiePrefs(JSON.stringify({ analytics: true, embeds: false }))).toEqual({
      necessary: true,
      analytics: true,
      embeds: false
    });
  });
});
