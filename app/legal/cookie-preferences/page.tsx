import type { Metadata } from 'next';
import { CookiePreferencesPanel } from '@/components/cookies';
import { SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Cookie Preferences', description: 'Manage cookie choices on SecretChip.' };

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <SectionHeading title="Cookie preferences" description="Manage consent for optional cookies. Strictly necessary cookies remain active to keep the site secure and functional." />
      <CookiePreferencesPanel />
    </main>
  );
}
