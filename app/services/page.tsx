import type { Metadata } from 'next';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Services', description: 'Security services from SecretChip, connected to AEGIS PDNS outcomes.' };

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <SectionHeading title="Security services that ship outcomes" description="SecretChip services support design, deployment, and operation. AEGIS PDNS is a product anchor, not a substitute for full security operations." />
      <div className="grid gap-5 md:grid-cols-2">
        {['Security Consulting', 'Protective DNS Services', 'Infrastructure Security', 'Operational Enablement'].map((s) => (
          <GlassCard key={s}><h3 className="text-lg font-semibold text-white">{s}</h3><p className="mt-2 text-slate-400">Clear scope, technical delivery, and measurable operational impact.</p></GlassCard>
        ))}
      </div>
      <GlassCard><h3 className="text-lg font-semibold text-white">How SecretChip works</h3><p className="mt-2 text-slate-300">We define scope quickly, align controls to risk, then build repeatable operations. Services and products are delivered as one operating model.</p></GlassCard>
      <CTA title="Plan your engagement" text="Use SecretChip services with or without AEGIS PDNS, then scale coverage over time." primary={{ label: 'Contact SecretChip', href: '/contact' }} secondary={{ label: 'Explore AEGIS PDNS', href: '/aegis-pdns' }} />
    </main>
  );
}
