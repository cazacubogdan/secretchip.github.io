import type { Metadata } from 'next';
import Link from 'next/link';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Solutions', description: 'Security solutions by audience segment from SecretChip.' };

export default function SolutionsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-14 px-6 py-16">
      <SectionHeading
        title="Solutions aligned to operational context"
        description="SecretChip solutions are organized by audience so teams can evaluate fit quickly, understand where AEGIS PDNS applies, and identify when services support is useful."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Personal & Home', 'Encrypted DNS defaults, clear policy options, and low-friction setup for privacy and security hygiene.'],
          ['SMB & MSP', 'Multi-tenant policy control, practical operations, and customer-ready deployment paths.'],
          ['Enterprise', 'Governance-aligned DNS controls with integration options for security and infrastructure teams.']
        ].map(([title, text]) => (
          <GlassCard key={title}><h3 className="text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-slate-400">{text}</p></GlassCard>
        ))}
      </div>

      <section className="space-y-5" id="personal-home">
        <SectionHeading title="Personal & Home" description="Who it is for: individuals, families, and home-lab operators who want stronger DNS security without enterprise complexity." />
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <h3 className="font-semibold text-white">Problems it solves</h3>
            <p className="mt-2 text-slate-300">Reduces exposure to malicious domains, improves DNS privacy through encrypted protocols, and creates clearer default behavior than unmanaged resolver choices.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-semibold text-white">How AEGIS PDNS fits</h3>
            <p className="mt-2 text-slate-300">Start with direct resolver configuration in browsers, devices, or routers. Use filtered mode by default and open mode when compatibility testing is needed.</p>
          </GlassCard>
        </div>
        <p className="text-slate-400">When services may help: households with advanced networking setups or small local operations that want structured hardening beyond resolver configuration.</p>
      </section>

      <section className="space-y-5" id="smb-msp">
        <SectionHeading title="SMB & MSP" description="Who it is for: internal IT teams and managed service providers that operate multiple customer environments and need repeatable security controls." />
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <h3 className="font-semibold text-white">Problems it solves</h3>
            <p className="mt-2 text-slate-300">Improves policy consistency, reduces DNS-based threat exposure across tenants, and provides a more coherent control baseline for day-to-day operations.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-semibold text-white">How AEGIS PDNS fits</h3>
            <p className="mt-2 text-slate-300">Use resolver mode separation for different client profiles, then move into managed deployment patterns as account volume and policy needs increase.</p>
          </GlassCard>
        </div>
        <p className="text-slate-400">When services may help: onboarding design, profile modeling, deployment standards, and operational runbooks for support teams.</p>
      </section>

      <section className="space-y-5" id="enterprise">
        <SectionHeading title="Enterprise" description="Who it is for: security, network, and platform teams that need governance-ready DNS controls and integration with existing operating models." />
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <h3 className="font-semibold text-white">Problems it solves</h3>
            <p className="mt-2 text-slate-300">Supports encrypted resolution, policy enforcement, and control clarity where decentralized DNS behavior creates governance and risk management gaps.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-semibold text-white">How AEGIS PDNS fits</h3>
            <p className="mt-2 text-slate-300">Acts as a protective DNS control layer that can be mapped to segmented environments, staged rollout plans, and enterprise change management requirements.</p>
          </GlassCard>
        </div>
        <p className="text-slate-400">When services may help: architecture review, phased implementation planning, integration support, and operational enablement for internal teams.</p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/aegis-pdns" className="rounded-lg bg-brandBlue px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-400">View AEGIS PDNS</Link>
        <Link href="/contact" className="rounded-lg border border-brandPurple/70 px-5 py-3 font-medium text-white transition hover:bg-brandPurple/20">Contact SecretChip</Link>
      </div>

      <CTA
        title="Move from audience fit to rollout"
        text="Use AEGIS PDNS as your starting control, then bring in SecretChip services when design, integration, or operational depth is required."
        primary={{ label: 'Explore AEGIS PDNS', href: '/aegis-pdns' }}
        secondary={{ label: 'Discuss your environment', href: '/contact' }}
      />
    </main>
  );
}
