'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M4 4h7v7H4z" strokeLinejoin="round" />
        <path d="M13 4h7v4h-7z" strokeLinejoin="round" />
        <path d="M13 11h7v9h-7z" strokeLinejoin="round" />
        <path d="M4 13h7v7H4z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Homestays',
    href: '/admin/homestays',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M4 11L12 4l8 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10v9h12v-9" strokeLinejoin="round" />
        <path d="M10 19v-4h4v4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    href: '/admin/bookings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M7 3v4" strokeLinecap="round" />
        <path d="M17 3v4" strokeLinecap="round" />
        <rect x="4" y="7" width="16" height="14" rx="2" />
        <path d="M4 11h16" />
      </svg>
    ),
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <circle cx="12" cy="8" r="3" strokeLinejoin="round" />
        <path d="M6 20a6 6 0 0 1 12 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Blog Posts',
    href: '/admin/posts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M5 4h14v16H5z" strokeLinejoin="round" />
        <path d="M8 8h8" strokeLinecap="round" />
        <path d="M8 12h8" strokeLinecap="round" />
        <path d="M8 16h5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Attractions',
    href: '/admin/attractions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M12 2a7 7 0 0 1 7 7c0 4.5-7 13-7 13s-7-8.5-7-13a7 7 0 0 1 7-7z" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'Culinary',
    href: '/admin/culinary',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path d="M7 4v5.5" strokeLinecap="round" />
        <path d="M8.75 4v5.5" strokeLinecap="round" />
        <path d="M10.5 4v5.5" strokeLinecap="round" />
        <path d="M6.5 9.5h4.5" strokeLinecap="round" />
        <path d="M8.5 9.5V17a2 2 0 0 0 4 0v-2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16.5" cy="6.5" r="2" strokeLinejoin="round" />
        <path d="M16.5 8.5v7.5" strokeLinecap="round" />
        <path d="M15.6 17.8c.8.6 2 .6 2.8 0" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Reviews',
    href: '/admin/reviews',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M12 4.5l2 4 4.5.6-3.3 3.3.8 4.6L12 15.8l-4 2.2.8-4.6L5.5 9.1 10 8.5z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Pengaturan Kontak',
    href: '/admin/settings/contact',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 overflow-hidden bg-gradient-to-b from-[#050b15] via-[#0c1624] to-[#111f34] text-stone-100 shadow-[0_10px_40px_rgba(6,16,31,0.45)] md:flex md:flex-col">
      <div className="flex h-24 items-center gap-3 px-6">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 transition hover:border-emerald-300/40"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-2xl text-emerald-200">
            🌿
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
              Desa Asri
            </p>
            <p className="text-lg font-semibold text-white">Admin Hub</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <nav className="space-y-3 pb-10">
          <p className="px-2 text-xs uppercase tracking-[0.35em] text-white/40">
            Navigasi
          </p>
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white shadow-[0_12px_40px_rgba(16,185,129,0.22)] ring-1 ring-emerald-400/40'
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-200 transition group-hover:bg-emerald-500/20 group-hover:text-emerald-100">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="absolute right-2 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:border-emerald-400/40 hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-base">🏡</span>
          <span>Kembali ke Website</span>
        </Link>
      </div>
    </aside>
  );
}
