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
    <aside className="w-64 bg-stone-900 text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 mb-8">
          <span className="text-2xl font-bold font-heading">Village Stay</span>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-stone-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
          >
            <span className="text-xl">🏡</span>
            <span className="font-medium">Kembali ke Website</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
