import { ReactNode } from 'react';
import Link from 'next/link';
import { GlassCard } from './ui';

export function LegalLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-brandPurple">Structured draft production content</p>
        <h1 className="text-4xl font-semibold text-white">{title}</h1>
        <p className="text-slate-300">{intro}</p>
      </header>
      <GlassCard className="space-y-7">{children}</GlassCard>
      <p className="text-sm text-slate-400">Need a different policy page? Visit the <Link href="/legal" className="text-brandBlue">Legal hub</Link> or update cookie settings in <Link href="/legal/cookie-preferences" className="text-brandBlue">Cookie Preferences</Link>.</p>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
      <h2 className="text-xl font-semibold text-brandBlue">{title}</h2>
      <div className="space-y-2 text-slate-300">{children}</div>
    </section>
  );
}
