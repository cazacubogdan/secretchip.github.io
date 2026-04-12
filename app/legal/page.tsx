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
      <SectionHeading title="Legal and compliance" description="This area provides policy documents, data handling disclosures, and user rights resources." />
      <GlassCard>
        <ul className="space-y-3">
          {links.map(([href, label]) => (
            <li key={href}><Link href={href} className="text-brandBlue">{label}</Link></li>
          ))}
        </ul>
      </GlassCard>
      <p className="text-slate-400">For privacy or policy questions, contact <a className="text-brandBlue" href="mailto:hello@secretchip.net">hello@secretchip.net</a>.</p>
    </main>
  );
}
