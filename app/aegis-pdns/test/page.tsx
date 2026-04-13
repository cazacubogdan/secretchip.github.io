import type { Metadata } from 'next';
import Link from 'next/link';
import { DnsTester } from '@/components/dns-test';
import { SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'AEGIS PDNS Test',
  description: 'Run practical checks against AEGIS PDNS endpoints with server-side DNS validation.'
};

export default function DnsTestPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-16">
      <SectionHeading
        title="Test AEGIS PDNS behavior"
        description="Run practical checks for endpoint reachability, DoH behavior, and policy outcomes. Checks run through server-side API routes to reduce browser limitations."
      />
      <DnsTester />
      <p className="text-sm text-slate-400">
        Interpretation note: results are reported as pass, fail, informational, or inconclusive based on live resolver responses.
      </p>
      <div className="flex gap-3">
        <Link href="/aegis-pdns" className="rounded-lg bg-brandBlue px-4 py-2 font-medium text-slate-950 transition hover:bg-sky-400">
          Back to AEGIS PDNS
        </Link>
        <Link href="/contact" className="rounded-lg border border-brandPurple/60 px-4 py-2 text-white transition hover:bg-brandPurple/20">
          Report an issue
        </Link>
      </div>
    </main>
  );
}
