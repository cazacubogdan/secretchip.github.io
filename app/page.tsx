import type { Metadata } from 'next';
import Link from 'next/link';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'SecretChip Security Products and Services',
  description:
    'SecretChip is the parent security company. AEGIS PDNS is the flagship product for encrypted, policy-aware DNS protection with practical rollout support.'
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-20 px-6 py-16">
      <section className="space-y-8 fade-up">
        <SectionHeading
          eyebrow="SecretChip"
          title="Practical security products and services for real operating environments"
          description="SecretChip is the company. AEGIS PDNS is the flagship product. We help teams move from DNS exposure and policy drift to encrypted resolution, clear controls, and operational confidence."
        />
        <p className="max-w-3xl text-slate-300">
          This site is intentionally company-first so buyers, operators, and partners can evaluate the full SecretChip model. Start with AEGIS PDNS, engage services, or combine both into a scoped rollout plan.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          {[
            'DoH / DoT / DoQ support',
            'Filtered, open, and managed resolver modes',
            'Security-first product design',
            'Consulting and integration support'
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-brandBlue/40"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5 md:grid-cols-4">
        {[
          ['Company-first architecture', 'SecretChip leads strategy across products and services.'],
          ['Flagship DNS product', 'AEGIS PDNS anchors encrypted DNS protection and policy control.'],
          ['Audience-aligned delivery', 'Personal, managed, and enterprise deployment paths are supported.'],
          ['Clear engagement options', 'Start with testing, then scale into guided rollout or services.']
        ].map(([title, text]) => (
          <div key={title} className="space-y-2">
            <p className="text-sm font-semibold text-brandBlue">{title}</p>
            <p className="text-sm text-slate-300">{text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <GlassCard>
          <h3 className="text-xl font-semibold text-white">SecretChip and AEGIS PDNS</h3>
          <p className="mt-3 text-slate-300">
            SecretChip develops security capabilities across products and services. AEGIS PDNS is the flagship product in that portfolio, built for encrypted DNS, threat-aware policy enforcement, and practical deployment at different scales.
          </p>
          <p className="mt-3 text-slate-400">
            Product and services are connected by design. Teams can deploy quickly with standard resolver modes, then extend coverage with consulting, infrastructure hardening, and operational enablement.
          </p>
        </GlassCard>
        <GlassCard>
          <h3 className="text-xl font-semibold text-white">Featured AEGIS PDNS snapshot</h3>
          <ul className="mt-3 space-y-2 text-slate-300">
            <li>Encrypted DNS resolution for modern clients and managed networks.</li>
            <li>Malicious-domain filtering with open resolver options when required.</li>
            <li>Policy-aware profiles that map cleanly to personal, MSP, and enterprise contexts.</li>
            <li>Testing and rollout paths that can start in minutes and mature over time.</li>
          </ul>
          <Link href="/aegis-pdns" className="mt-5 inline-block text-brandBlue transition hover:text-sky-300">
            Explore AEGIS PDNS
          </Link>
        </GlassCard>
      </section>

      <section className="space-y-6">
        <SectionHeading
          title="Solutions snapshot"
          description="Choose the path that fits your environment, then move into full technical planning."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Personal & Home', 'Encrypted DNS with practical defaults for personal devices and home labs.', '/solutions'],
            ['SMB & MSP', 'Consistent resolver policy for managed customers, endpoints, and mixed network estates.', '/solutions'],
            ['Enterprise', 'Governance-aligned DNS controls for security and infrastructure teams.', '/solutions']
          ].map(([item, text, href]) => (
            <GlassCard key={item}>
              <h3 className="font-semibold text-white">{item}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
              <Link href={href} className="mt-3 inline-block text-sm text-brandBlue">
                Go to solution path
              </Link>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          title="Services snapshot"
          description="SecretChip services close architecture and deployment gaps around product adoption and broader security operations."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ['Security Consulting', 'Define control priorities, architecture decisions, and phased implementation plans.'],
            ['Protective DNS Services', 'Deploy AEGIS PDNS with policy tuning, resolver governance, and ongoing support.'],
            ['Infrastructure Security', 'Harden network and platform controls around DNS and adjacent security surfaces.'],
            ['Operational Enablement', 'Establish runbooks and team workflows that keep controls effective over time.']
          ].map(([item, text]) => (
            <GlassCard key={item}>
              <h3 className="font-semibold text-white">{item}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          title="Why SecretChip"
          description="A practical approach, product and consulting depth, and a security-first foundation built for long-term portfolio growth."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {[
            [
              'Practical security approach',
              'We prioritize deployable controls and operating clarity instead of abstract frameworks disconnected from daily operations.'
            ],
            [
              'Product plus consulting depth',
              'AEGIS PDNS provides the product baseline while SecretChip services support design, integration, and sustained operation.'
            ],
            [
              'Security-first thinking',
              'Security outcomes are built into resolver behavior, policy choices, and rollout plans from the first decision point.'
            ],
            [
              'Built for expansion',
              'The company-first model supports future products and service lines without fragmenting brand clarity.'
            ]
          ].map(([title, text]) => (
            <GlassCard key={title}>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-slate-400">{text}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <CTA
        title="Start with the right SecretChip path"
        text="Run the AEGIS PDNS DNS test, review solution guidance, or contact SecretChip for a scoped product and services discussion."
        primary={{ label: 'Contact SecretChip', href: '/contact' }}
        secondary={{ label: 'Run DNS Test', href: '/aegis-pdns/test' }}
      />
    </main>
  );
}
