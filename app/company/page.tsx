import type { Metadata } from 'next';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Company', description: 'SecretChip company profile and approach.' };

export default function CompanyPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <section className="space-y-5">
        <SectionHeading
          eyebrow="Company"
          title="SecretChip is the company. AEGIS PDNS is the flagship product."
          description="SecretChip is built as a company-first security brand with product and services under one operating model. This architecture keeps brand clarity strong while leaving room for future products and service lines."
        />
      </section>

      <section className="space-y-5">
        <SectionHeading title="Brand positioning" description="The site structure reflects how SecretChip operates in practice." />
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white">Company-first by design</h3>
            <p className="mt-2 text-slate-300">SecretChip represents the parent brand, accountability layer, and commercial relationship. Product and services pages are connected pathways, not isolated microsites.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-lg font-semibold text-white">Flagship product anchor</h3>
            <p className="mt-2 text-slate-300">AEGIS PDNS is positioned as a flagship product that demonstrates SecretChip execution standards and supports practical security outcomes in multiple environments.</p>
          </GlassCard>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading title="Principles and approach" description="SecretChip emphasizes technical clarity, realistic implementation, and durable operating outcomes." />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Clarity over noise', 'We communicate scope, tradeoffs, and operating responsibilities directly.'],
            ['Measurable controls', 'We prefer controls that can be validated in real environments over abstract promises.'],
            ['Deployment realism', 'Recommendations are shaped by constraints teams actually face in production.'],
            ['Security-first execution', 'Product behavior and service delivery prioritize secure defaults and operational discipline.']
          ].map(([title, text]) => (
            <GlassCard key={title}><h3 className="text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-slate-300">{text}</p></GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading title="Product portfolio snapshot" description="Current and future portfolio architecture remains coherent under the SecretChip parent brand." />
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard>
            <h3 className="font-semibold text-white">AEGIS PDNS</h3>
            <p className="mt-2 text-sm text-slate-400">Flagship SecretChip product focused on encrypted, policy-aware protective DNS.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-semibold text-white">Services portfolio</h3>
            <p className="mt-2 text-sm text-slate-400">Consulting and enablement capabilities that support product adoption and broader security outcomes.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="font-semibold text-white">Future expansion room</h3>
            <p className="mt-2 text-sm text-slate-400">Company-first architecture allows additional products and services to be added without brand fragmentation.</p>
          </GlassCard>
        </div>
      </section>

      <CTA
        title="Build your rollout with SecretChip"
        text="Start with a focused conversation on AEGIS PDNS, services delivery, or a combined model aligned to your operating context."
        primary={{ label: 'Contact SecretChip', href: '/contact' }}
        secondary={{ label: 'See Services', href: '/services' }}
      />
    </main>
  );
}
