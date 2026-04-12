import type { Metadata } from 'next';
import { GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Contact', description: 'Contact SecretChip for AEGIS PDNS, services, and partnership inquiries.' };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <SectionHeading title="Contact SecretChip" description="What this is: direct contact for product and services. Who it is for: operators, buyers, partners. Next step: send details and our team follows up." />
      <GlassCard>
        <form className="grid gap-4">
          <input className="rounded-lg border border-white/15 bg-slate-900 p-3" placeholder="Name" name="name" />
          <input className="rounded-lg border border-white/15 bg-slate-900 p-3" placeholder="Email" name="email" type="email" />
          <select className="rounded-lg border border-white/15 bg-slate-900 p-3" name="topic">
            {['AEGIS PDNS', 'Services', 'Partnership', 'General Inquiry'].map((t) => <option key={t}>{t}</option>)}
          </select>
          <textarea className="min-h-32 rounded-lg border border-white/15 bg-slate-900 p-3" placeholder="Message" name="message" />
          <button type="button" className="rounded-lg bg-brandBlue px-4 py-2 font-medium text-slate-950">Send inquiry</button>
        </form>
        <p className="mt-4 text-sm text-slate-400">Privacy reminder: your submission is processed per our Privacy Notice.</p>
      </GlassCard>
      <GlassCard><p className="text-slate-300">Direct contact: <a href="mailto:hello@secretchip.net" className="text-brandBlue">hello@secretchip.net</a></p><p className="mt-2 text-sm text-slate-400">FAQ: We usually respond within two business days for initial inquiries.</p></GlassCard>
    </main>
  );
}
