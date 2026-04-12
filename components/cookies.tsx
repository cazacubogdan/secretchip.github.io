'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassCard } from './ui';

type CookiePrefs = { necessary: true; analytics: boolean; embeds: boolean };
const defaultPrefs: CookiePrefs = { necessary: true, analytics: false, embeds: false };

export function useCookiePrefs() {
  const [prefs, setPrefs] = useState<CookiePrefs>(defaultPrefs);

  useEffect(() => {
    const stored = localStorage.getItem('secretchip-cookie-prefs');
    if (stored) setPrefs(JSON.parse(stored));
  }, []);

  const save = (next: CookiePrefs) => {
    setPrefs(next);
    localStorage.setItem('secretchip-cookie-prefs', JSON.stringify(next));
    localStorage.setItem('secretchip-cookie-consent', 'set');
  };

  const withdraw = () => {
    setPrefs(defaultPrefs);
    localStorage.setItem('secretchip-cookie-prefs', JSON.stringify(defaultPrefs));
    localStorage.removeItem('secretchip-cookie-consent');
  };

  return { prefs, save, withdraw };
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const { save } = useCookiePrefs();

  useEffect(() => {
    setOpen(!localStorage.getItem('secretchip-cookie-consent'));
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <GlassCard className="mx-auto max-w-5xl border-brandBlue/40 bg-slate-900/95">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-200">We use strictly necessary cookies to run this site. Optional analytics and embedded content cookies require your consent.</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { save({ necessary: true, analytics: true, embeds: true }); setOpen(false); }} className="rounded-md bg-brandBlue px-3 py-2 text-sm font-medium text-slate-950">Accept</button>
            <button onClick={() => { save(defaultPrefs); setOpen(false); }} className="rounded-md border border-white/20 px-3 py-2 text-sm text-white">Reject</button>
            <Link href="/legal/cookie-preferences" className="rounded-md border border-brandPurple/60 px-3 py-2 text-sm text-white">Manage Preferences</Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export function CookiePreferencesPanel() {
  const { prefs, save, withdraw } = useCookiePrefs();
  const [analytics, setAnalytics] = useState(false);
  const [embeds, setEmbeds] = useState(false);

  useEffect(() => {
    setAnalytics(prefs.analytics);
    setEmbeds(prefs.embeds);
  }, [prefs]);

  return (
    <GlassCard>
      <div className="space-y-6">
        <p className="text-slate-300">Strictly necessary cookies are always active. You can opt in or out of optional categories below.</p>
        {[{ key: 'necessary', title: 'Strictly necessary', enabled: true, locked: true }, { key: 'analytics', title: 'Analytics (optional)', enabled: analytics, locked: false }, { key: 'embeds', title: 'Third-party embedded content (optional)', enabled: embeds, locked: false }].map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-xl border border-white/10 p-4">
            <div>
              <h3 className="font-medium text-white">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.locked ? 'Required for core functionality and security.' : 'Future-ready category. Enable when you want this behavior.'}</p>
            </div>
            <input
              type="checkbox"
              disabled={item.locked}
              checked={item.enabled}
              onChange={(e) => (item.key === 'analytics' ? setAnalytics(e.target.checked) : setEmbeds(e.target.checked))}
              className="h-5 w-5 accent-brandBlue"
            />
          </div>
        ))}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => save({ necessary: true, analytics, embeds })} className="rounded-lg bg-brandBlue px-4 py-2 font-medium text-slate-950">Save Preferences</button>
          <button onClick={withdraw} className="rounded-lg border border-brandPurple/60 px-4 py-2 text-white">Withdraw Optional Consent</button>
        </div>
      </div>
    </GlassCard>
  );
}
