import type { Metadata } from 'next';
import Link from 'next/link';
import { GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Legal', description: 'SecretChip legal and compliance documents.' };

const links = [
  ['/legal/privacy-notice', 'Privacy Notice'],
  ['/legal/cookie-policy', 'Cookie Policy'],
  ['/legal/cookie-preferences', 'Cookie Preferences'],
  ['/legal/terms-and-conditions', 'Terms and Conditions'],
  ['/legal/acceptable-use-policy', 'Acceptable Use Policy'],
  ['/legal/privacy-requests', 'Privacy Requests']
];

export default function LegalHubPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-16">
      <SectionHeading title="Legal and compliance" description="Policy pages are published as structured draft production content with clear placeholders where legal entity specifics are still pending." />
      <GlassCard>
        <ul className="space-y-3">
          {links.map(([href, label]) => (
            <li key={href} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
              <span className="text-slate-200">{label}</span>
              <Link href={href} className="text-brandBlue">Open</Link>
            </li>
          ))}
        </ul>
      </GlassCard>
      <p className="text-slate-400">For privacy or policy questions, contact <a className="text-brandBlue" href="mailto:hello@secretchip.net">hello@secretchip.net</a>. Cookie settings remain available via footer and this hub.</p>
    </main>
  );
}
