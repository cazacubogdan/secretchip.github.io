import Link from 'next/link';
import { footerGroups, navItems } from '@/lib/site-data';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-wide text-white">
          Secret<span className="text-brandBlue">Chip</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/login" className="rounded-lg border border-brandBlue/60 px-4 py-2 text-sm font-medium text-brandBlue transition hover:bg-brandBlue/10">
          Client Login
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-6">
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold text-white">SecretChip</h3>
          <p className="mt-3 text-sm text-slate-400">Practical security products and services. AEGIS PDNS is the flagship product for encrypted, policy-aware DNS protection.</p>
        </div>
        {Object.entries(footerGroups).map(([group, links]) => (
          <div key={group}>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brandPurple">{group}</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
