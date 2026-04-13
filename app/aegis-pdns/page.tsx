import type { Metadata } from 'next';
import Link from 'next/link';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'AEGIS PDNS',
  description: 'AEGIS PDNS is the flagship SecretChip product for encrypted, policy-aware DNS protection.'
};

export default function AegisPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-16 px-6 py-16">
      <section className="space-y-5">
        <SectionHeading
          eyebrow="Flagship Product"
          title="AEGIS PDNS by SecretChip"
          description="Encrypted, policy-aware DNS protection with resolver modes and setup paths for personal users, managed operators, and enterprise security teams."
        />
        <p className="text-slate-300">Protected resolver: <span className="text-brandBlue">dns.secretchip.net/dns-query</span></p>
        <p className="text-slate-300">Open resolver option: <span className="text-brandBlue">nofilter.dns.secretchip.net/dns-query</span></p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          {['Encrypted DNS transport', 'Malicious-domain blocking', 'Policy-aware access profiles', 'Product backed by SecretChip services'].map((item) => (
            <span key={item} className="rounded-full border border-white/15 px-4 py-2">{item}</span>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading title="What it does" description="AEGIS PDNS secures DNS resolution with encrypted protocols, blocks known malicious destinations, and applies policy-aware resolver profiles that fit different operating contexts." />
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white">Encrypted DNS resolution</h3>
            <p className="mt-2 text-slate-300">Queries can be sent over encrypted channels to reduce local interception risk and improve privacy posture in untrusted and mixed networks.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-lg font-semibold text-white">Malicious-domain blocking</h3>
            <p className="mt-2 text-slate-300">Filtered resolver modes are tuned to block known malicious infrastructure while still supporting practical day-to-day connectivity needs.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-lg font-semibold text-white">Policy-aware access profiles</h3>
            <p className="mt-2 text-slate-300">Different profiles support different risk tolerances so teams can separate strict filtering from open access where operationally required.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-lg font-semibold text-white">Usable across contexts</h3>
            <p className="mt-2 text-slate-300">AEGIS PDNS can be used directly by individuals, rolled out across managed customer estates, or integrated into enterprise DNS control strategies.</p>
          </GlassCard>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading title="Core capabilities" />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Threat blocking', 'Block known malicious domains as a baseline defensive control.'],
            ['Encrypted transport', 'Use encrypted protocols to reduce plaintext DNS exposure.'],
            ['Profile-based policies', 'Apply resolver behavior based on user, tenant, or environment needs.'],
            ['Operational flexibility', 'Run as quick-start resolver usage or managed deployment with service support.']
          ].map(([title, text]) => (
            <GlassCard key={title}><h3 className="text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-slate-400">{text}</p></GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading title="Resolver modes" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Filtered resolver', 'Security-oriented default mode with malicious-domain blocking and practical policy coverage.'],
            ['Open resolver option', 'Reduced filtering mode for compatibility testing and scenarios where strict filtering is not desired.'],
            ['Managed profiles', 'SecretChip-supported profile strategy for organizations that need tenant or environment-specific policy design.']
          ].map(([title, text]) => (
            <GlassCard key={title}><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm text-slate-400">{text}</p></GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading title="Protocol support" description="AEGIS PDNS is designed for modern encrypted DNS clients." />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['DoH', 'DNS over HTTPS for browser and app integrations.'],
            ['DoT', 'DNS over TLS for resolver-level encrypted transport.'],
            ['DoQ', 'DNS over QUIC for low-latency encrypted resolver communication.']
          ].map(([title, text]) => (
            <GlassCard key={title}><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm text-slate-400">{text}</p></GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading title="Who it is for" description="AEGIS PDNS is segmented for distinct operating needs, not a one-size-fits-all resolver story." />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Personal and home users', 'People who want encrypted DNS and sensible protection defaults without complex infrastructure work.'],
            ['SMB and MSP operators', 'Teams that need repeatable deployment patterns, policy consistency, and support across many endpoints or client environments.'],
            ['Enterprise teams', 'Security and infrastructure groups that need policy governance, audit-friendly control posture, and integration with broader operational controls.']
          ].map(([title, text]) => (
            <GlassCard key={title}><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm text-slate-400">{text}</p></GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading title="Setup paths" description="Choose setup depth based on scope, then expand when policy or governance requirements grow." />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Browsers and apps', 'Fastest path for individual testing. Configure resolver endpoints directly in supporting browsers or applications.'],
            ['Routers and gateways', 'Apply DNS policy across local networks for home, branch, or small office environments with centralized control.'],
            ['Managed environments', 'Use SecretChip-guided deployment patterns for multi-tenant or enterprise rollouts that require profile design and operational handoff.']
          ].map(([title, text]) => (
            <GlassCard key={title}><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm text-slate-400">{text}</p></GlassCard>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading title="FAQ" />
        <div className="space-y-3">
          {[
            ['Is AEGIS PDNS the company or the product?', 'AEGIS PDNS is a product. SecretChip is the parent company that develops products and delivers services.'],
            ['What resolver modes are available?', 'AEGIS PDNS offers filtered and open resolver options, plus managed profile approaches for organizations.'],
            ['Does AEGIS PDNS support DoH, DoT, and DoQ?', 'Yes. The product supports DoH, DoT, and DoQ for modern encrypted DNS connectivity paths.'],
            ['Can organizations request managed deployment options?', 'Yes. SecretChip can scope managed deployment and policy profile support for MSP and enterprise environments.'],
            ['What is the difference between filtered and open resolver options?', 'Filtered mode prioritizes malicious-domain blocking. Open mode is intended for compatibility and use cases where broad filtering is not desired.'],
            ['Where should I start if I want to test it?', 'Start with the DNS test page for browser-visible checks, then contact SecretChip for deeper validation and rollout planning.']
          ].map(([q, a]) => (
            <GlassCard key={q}><h3 className="font-semibold text-white">{q}</h3><p className="mt-2 text-slate-400">{a}</p></GlassCard>
          ))}
        </div>
      </section>

      <GlassCard className="space-y-3">
        <h3 className="text-xl font-semibold text-white">Test AEGIS PDNS</h3>
        <p className="text-slate-300">Run live server-assisted checks for resolver reachability, DoH behavior, and block behavior signals with honest result states.</p>
        <Link href="/aegis-pdns/test" className="inline-block text-brandBlue">Open DNS test workflow</Link>
      </GlassCard>

      <CTA
        title="Validate and deploy with confidence"
        text="Run real DNS checks, confirm resolver behavior, and engage SecretChip for policy-aware rollout support."
        primary={{ label: 'Open DNS Test', href: '/aegis-pdns/test' }}
        secondary={{ label: 'Contact SecretChip', href: '/contact' }}
      />
    </main>
  );
}
