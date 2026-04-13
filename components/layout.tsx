'use client';

import Link from 'next/link';
import { useState } from 'react';
import { footerGroups, navItems } from '@/lib/site-data';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-white/20 px-3 py-2 text-xs text-slate-200 transition hover:border-brandBlue/50 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            Menu
          </button>
          <Link href="/login" className="rounded-lg border border-brandBlue/60 px-4 py-2 text-sm font-medium text-brandBlue transition hover:bg-brandBlue/10">
            Client Login
          </Link>
        </div>
      </div>

      <div className={`overflow-hidden border-t border-white/10 transition-all duration-300 md:hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="mx-auto grid max-w-6xl gap-1 px-6 py-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-2 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white" onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
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
