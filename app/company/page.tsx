import type { Metadata } from 'next';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Company', description: 'SecretChip company profile and approach.' };

export default function CompanyPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <SectionHeading title="SecretChip is the company. AEGIS PDNS is a flagship product." description="SecretChip builds practical security capabilities across products and services with direct technical accountability." />
      <div className="grid gap-5 md:grid-cols-2">
        <GlassCard><h3 className="text-lg font-semibold text-white">Principles</h3><p className="mt-2 text-slate-300">Clarity over noise, measurable controls over vague claims, and deployable architecture over slideware.</p></GlassCard>
        <GlassCard><h3 className="text-lg font-semibold text-white">Portfolio snapshot</h3><p className="mt-2 text-slate-300">AEGIS PDNS is the flagship product. Additional services extend operational resilience and infrastructure security.</p></GlassCard>
      </div>
      <CTA title="Work with SecretChip" text="Discuss product rollout, consulting scope, or partnership opportunities." primary={{ label: 'Contact us', href: '/contact' }} secondary={{ label: 'See Services', href: '/services' }} />
    </main>
  );
}
