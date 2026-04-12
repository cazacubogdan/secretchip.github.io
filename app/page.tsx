import Link from 'next/link';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-20 px-6 py-16">
      <section className="space-y-8">
        <SectionHeading eyebrow="SecretChip" title="Practical security products and services for real environments" description="SecretChip is a security company. AEGIS PDNS is our flagship product for encrypted, policy-aware DNS protection that teams can run with confidence." />
        <div className="flex flex-wrap gap-3 text-sm">
          {['DoH / DoT / DoQ', 'Filtered, open, and managed modes', 'Company-backed product', 'Security-first DNS'].map((item) => (
            <span key={item} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-slate-300">{item}</span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <GlassCard>
          <h3 className="text-xl font-semibold text-white">SecretChip and AEGIS PDNS</h3>
          <p className="mt-2 text-slate-300">SecretChip develops security capabilities across product and services. AEGIS PDNS leads the product portfolio and anchors our DNS protection strategy.</p>
        </GlassCard>
        <GlassCard>
          <h3 className="text-xl font-semibold text-white">Featured product snapshot</h3>
          <p className="mt-2 text-slate-300">AEGIS PDNS delivers encrypted DNS, policy control, and flexible deployment paths for personal, managed, and enterprise use cases.</p>
          <Link href="/aegis-pdns" className="mt-4 inline-block text-brandBlue">Explore AEGIS PDNS</Link>
        </GlassCard>
      </section>

      <section className="space-y-6">
        <SectionHeading title="Solutions snapshot" />
        <div className="grid gap-5 md:grid-cols-3">
          {['Personal & Home', 'SMB & MSP', 'Enterprise'].map((item) => (
            <GlassCard key={item}><h3 className="font-semibold text-white">{item}</h3><p className="mt-2 text-sm text-slate-400">Clear deployment patterns and policy coverage matched to this audience.</p></GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading title="Services snapshot" />
        <div className="grid gap-5 md:grid-cols-2">
          {['Security Consulting', 'Protective DNS Products', 'Infrastructure Security', 'Operational Enablement'].map((item) => (
            <GlassCard key={item}><h3 className="font-semibold text-white">{item}</h3></GlassCard>
          ))}
        </div>
      </section>

      <CTA title="Why SecretChip" text="Teams choose SecretChip for technical clarity, practical architecture decisions, and commercially clear engagement." primary={{ label: 'Contact SecretChip', href: '/contact' }} secondary={{ label: 'View Solutions', href: '/solutions' }} />
    </main>
  );
}
