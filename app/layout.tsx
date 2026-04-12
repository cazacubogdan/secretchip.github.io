import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '@/components/layout';
import { CookieBanner } from '@/components/cookies';

export const metadata: Metadata = {
  metadataBase: new URL('https://secretchip.net'),
  title: {
    default: 'SecretChip | Security Products and Services',
    template: '%s | SecretChip'
  },
  description: 'SecretChip builds practical security products and services. AEGIS PDNS is the flagship product for encrypted, policy-aware DNS protection.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
