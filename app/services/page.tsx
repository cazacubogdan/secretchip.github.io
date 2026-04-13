import type { Metadata } from 'next';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Services', description: 'Security services from SecretChip, connected to AEGIS PDNS outcomes.' };

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <SectionHeading
        title="Security services that ship outcomes"
        description="SecretChip services support architecture, deployment, integration, and operations. AEGIS PDNS is a flagship product anchor, and services extend impact around that product and beyond it."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {[
          ['Security Consulting', 'Define scope quickly, align controls to risk, and sequence implementation with practical delivery milestones.'],
          ['Protective DNS Services', 'Plan and operate protective DNS strategies including AEGIS PDNS resolver selection, policy tuning, and rollout governance.'],
          ['Infrastructure Security', 'Harden adjacent infrastructure controls so DNS improvements are supported by resilient network and platform posture.'],
          ['Operational Enablement', 'Build runbooks, roles, and internal workflows that help teams sustain security outcomes after initial deployment.']
        ].map(([s, text]) => (
          <GlassCard key={s}><h3 className="text-lg font-semibold text-white">{s}</h3><p className="mt-2 text-slate-400">{text}</p></GlassCard>
        ))}
      </div>

      <GlassCard className="space-y-3">
        <h3 className="text-lg font-semibold text-white">How SecretChip works</h3>
        <p className="text-slate-300">We use a direct operating model. First, we establish target outcomes and constraints. Next, we build a realistic deployment plan. Then we help teams operationalize and maintain the controls they adopt.</p>
      </GlassCard>

      <section className="space-y-4">
        <SectionHeading title="Product and services relationship" description="AEGIS PDNS is a product. SecretChip services help clients design, deploy, and integrate that product while also supporting broader security needs." />
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard>
            <h3 className="font-semibold text-white">Product-led engagement</h3>
            <p className="mt-2 text-sm text-slate-400">Start with AEGIS PDNS testing and deployment, then add consulting support where policy, scale, or integration complexity appears.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-semibold text-white">Services-led engagement</h3>
            <p className="mt-2 text-sm text-slate-400">Start with architecture and operations work, then adopt AEGIS PDNS when protective DNS becomes a prioritized control domain.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-semibold text-white">Combined model</h3>
            <p className="mt-2 text-sm text-slate-400">Engage around product and services together for faster implementation, cleaner handoff, and stronger long-term operational consistency.</p>
          </GlassCard>
        </div>
      </section>

      <CTA
        title="Plan your SecretChip engagement"
        text="Engage around AEGIS PDNS, services, or both. We scope quickly, communicate clearly, and focus on deployable security outcomes."
        primary={{ label: 'Contact SecretChip', href: '/contact' }}
        secondary={{ label: 'Explore AEGIS PDNS', href: '/aegis-pdns' }}
      />
    </main>
  );
}
