import type { Metadata } from 'next';
import Link from 'next/link';
import { GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Client Login', description: 'SecretChip client portal placeholder page.' };

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <SectionHeading title="Client Portal Coming Soon" description="This route is intentionally reserved for future secure customer portal workflows. Access controls and account onboarding are not active in this release." />
      <GlassCard className="space-y-4">
        <p className="text-slate-300">If you need immediate assistance, contact SecretChip and we will route you through the correct support path.</p>
        <div className="flex gap-3">
          <Link href="/" className="rounded-lg bg-brandBlue px-4 py-2 font-medium text-slate-950 transition hover:bg-sky-400">Back to homepage</Link>
          <Link href="/contact" className="rounded-lg border border-brandPurple/60 px-4 py-2 text-white transition hover:bg-brandPurple/20">Contact SecretChip</Link>
        </div>
      </GlassCard>
    </main>
  );
}
