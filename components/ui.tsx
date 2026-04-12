import Link from 'next/link';
import { ReactNode } from 'react';

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-brandBlue">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      {description ? <p className="text-base text-slate-300">{description}</p> : null}
    </div>
  );
}

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur ${className}`}>{children}</div>;
}

export function CTA({ title, text, primary, secondary }: { title: string; text: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <GlassCard className="shadow-glow">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <p className="mt-2 max-w-2xl text-slate-300">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={primary.href} className="rounded-lg bg-brandBlue px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-400">
            {primary.label}
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="rounded-lg border border-brandPurple/70 px-5 py-3 font-medium text-white transition hover:bg-brandPurple/20">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </GlassCard>
  );
}
