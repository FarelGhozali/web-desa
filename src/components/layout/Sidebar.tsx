'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Homestays', href: '/admin/homestays', icon: '🏠' },
  { label: 'Bookings', href: '/admin/bookings', icon: '📅' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Blog Posts', href: '/admin/posts', icon: '📝' },
  { label: 'Categories', href: '/admin/categories', icon: '🏷️' },
  { label: 'Attractions', href: '/admin/attractions', icon: '🗺️' },
  { label: 'Culinary', href: '/admin/culinary', icon: '🍽️' },
  { label: 'Reviews', href: '/admin/reviews', icon: '⭐' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900/95 text-stone-100 shadow-xl md:flex md:flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 px-6 py-8">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 backdrop-blur transition hover:border-emerald-400"
          >
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
                Village Stay
              </p>
              <p className="text-lg font-semibold text-white">Admin Center</p>
            </div>
          </Link>

          <nav className="space-y-2">
            <p className="px-4 text-xs uppercase tracking-[0.3em] text-stone-500">
              Navigasi
            </p>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                      : 'text-stone-300 hover:bg-stone-800/70 hover:text-white',
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white/90" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-300 transition hover:bg-stone-800/70 hover:text-white"
        >
          <span>🏡</span>
          <span>Kembali ke Website</span>
        </Link>
      </div>
    </aside>
  );
}
