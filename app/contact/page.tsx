import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Contact', description: 'Contact SecretChip for AEGIS PDNS, services, and partnership inquiries.' };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <SectionHeading
        title="Contact SecretChip"
        description="Direct contact for AEGIS PDNS, services, partnership discussions, and general inquiries. Share your context and we will route the inquiry to the right team."
      />

      <GlassCard>
        <ContactForm />
      </GlassCard>

      <GlassCard className="space-y-4">
        <p className="text-slate-300">
          Direct contact: <a href="mailto:hello@secretchip.net" className="text-brandBlue">hello@secretchip.net</a>
        </p>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Contact FAQ</h3>
          <div>
            <p className="font-medium text-white">How quickly does SecretChip respond?</p>
            <p className="text-sm text-slate-400">Initial responses are typically sent within two business days.</p>
          </div>
          <div>
            <p className="font-medium text-white">Can I use this form for product and services questions?</p>
            <p className="text-sm text-slate-400">Yes. Select the topic that best matches your request and include your environment details.</p>
          </div>
          <div>
            <p className="font-medium text-white">Can organizations request managed deployment options?</p>
            <p className="text-sm text-slate-400">Yes. Use topic selection for Services or AEGIS PDNS and describe scope, timeline, and operating model.</p>
          </div>
          <div>
            <p className="font-medium text-white">What happens if contact delivery is not configured?</p>
            <p className="text-sm text-slate-400">The form returns a clear configuration error instead of showing a false success state.</p>
          </div>
        </div>
      </GlassCard>
    </main>
  );
}
