import { ReactNode } from 'react';
import { GlassCard } from './ui';

export function LegalLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold text-white">{title}</h1>
        <p className="text-slate-300">{intro}</p>
      </header>
      <GlassCard className="space-y-7">{children}</GlassCard>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-brandBlue">{title}</h2>
      <div className="space-y-2 text-slate-300">{children}</div>
    </section>
  );
}
