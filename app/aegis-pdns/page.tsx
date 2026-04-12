import type { Metadata } from 'next';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'AEGIS PDNS',
  description: 'AEGIS PDNS is the flagship SecretChip product for encrypted, policy-aware DNS protection.'
};

export default function AegisPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-16 px-6 py-16">
      <section className="space-y-4">
        <SectionHeading eyebrow="Flagship Product" title="AEGIS PDNS by SecretChip" description="Encrypted, policy-aware DNS protection with flexible deployment for individuals, MSPs, and enterprise teams." />
        <p className="text-slate-300">Protected resolver: <span className="text-brandBlue">dns.secretchip.net/dns-query</span><br/>Open resolver option: <span className="text-brandBlue">nofilter.dns.secretchip.net/dns-query</span></p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {['Threat Blocking', 'Encrypted DNS', 'Policy Control', 'Flexible Deployment'].map((c) => (
          <GlassCard key={c}><h3 className="text-lg font-semibold text-white">{c}</h3><p className="mt-2 text-slate-400">Operationally clear controls with measurable outcomes.</p></GlassCard>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {['Filtered Resolver', 'Open Resolver Option', 'Managed Profiles'].map((m) => (
          <GlassCard key={m}><h3 className="font-semibold text-white">{m}</h3><p className="mt-2 text-sm text-slate-400">Choose strict policy, open mode, or centrally managed profiles.</p></GlassCard>
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeading title="Protocol support" description="AEGIS PDNS supports DoH, DoT, and DoQ for modern encrypted DNS connectivity." />
        <SectionHeading title="Who it is for" description="Personal users, home labs, SMB and MSP operators, and enterprise security teams." />
        <SectionHeading title="Setup paths" description="Start with direct resolver configuration, then move to managed profiles for scaled policy management." />
      </section>

      <section className="space-y-3">
        <SectionHeading title="FAQ" />
        <GlassCard><h3 className="font-semibold text-white">Is this a consumer-only resolver?</h3><p className="mt-2 text-slate-400">No. AEGIS PDNS is designed for personal through enterprise deployment models.</p></GlassCard>
      </section>

      <CTA title="Test AEGIS PDNS" text="Run practical browser-based checks, then escalate to full operational validation with SecretChip support." primary={{ label: 'Open DNS Test', href: '/aegis-pdns/test' }} secondary={{ label: 'Contact Product Team', href: '/contact' }} />
    </main>
  );
}
