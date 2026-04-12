import type { Metadata } from 'next';
import { CTA, GlassCard, SectionHeading } from '@/components/ui';

export const metadata: Metadata = { title: 'Solutions', description: 'Security solutions by audience segment from SecretChip.' };

export default function SolutionsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <SectionHeading title="Solutions aligned to operational context" description="What this is: audience-based security design. Who it is for: personal users, SMB and MSP operators, and enterprise teams. Next step: review AEGIS PDNS and contact SecretChip." />
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Personal & Home', 'Encrypted DNS defaults, clear policy options, and low-friction setup.'],
          ['SMB & MSP', 'Multi-tenant policy control, practical operations, and client-ready deployment paths.'],
          ['Enterprise', 'Controlled DNS enforcement, governance alignment, and integration with existing security workflows.']
        ].map(([title, text]) => (
          <GlassCard key={title}><h3 className="text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-slate-400">{text}</p></GlassCard>
        ))}
      </div>
      <CTA title="Move from evaluation to rollout" text="Review AEGIS PDNS capabilities or discuss architecture and services with SecretChip." primary={{ label: 'View AEGIS PDNS', href: '/aegis-pdns' }} secondary={{ label: 'Contact SecretChip', href: '/contact' }} />
    </main>
  );
}
