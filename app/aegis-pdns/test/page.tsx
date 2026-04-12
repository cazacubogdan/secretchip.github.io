import type { Metadata } from 'next';
import Link from 'next/link';
import { DnsTester } from '@/components/dns-test';
import { SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'AEGIS PDNS Test',
  description: 'Run practical checks against AEGIS PDNS endpoints from the browser.'
};

export default function DnsTestPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-16">
      <SectionHeading title="Test AEGIS PDNS behavior" description="Run practical checks for endpoint reachability, DoH behavior, and policy outcomes. Results indicate browser-visible behavior only." />
      <DnsTester />
      <p className="text-sm text-slate-400">Browser caveat: some reachability and protocol checks can be limited by browser security and CORS behavior even when network access works.</p>
      <div className="flex gap-3">
        <Link href="/aegis-pdns" className="rounded-lg bg-brandBlue px-4 py-2 font-medium text-slate-950">Back to setup</Link>
        <Link href="/contact" className="rounded-lg border border-brandPurple/60 px-4 py-2 text-white">Report an issue</Link>
      </div>
    </main>
  );
}
