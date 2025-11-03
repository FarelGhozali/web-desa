'use client';

import { ReactNode, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Sidebar from './Sidebar';
import Button from '../ui/Button';
import { formatDate } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();
  const todayLabel = formatDate(new Date());

  useEffect(() => {
    document.body.dataset.adminPage = 'true';
    return () => {
      delete document.body.dataset.adminPage;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-stone-100">
      <Sidebar />
      
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-20 border-b border-stone-200/60 bg-white/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">
                Admin Dashboard
              </p>
              <h2 className="text-xl font-semibold text-stone-900 md:text-2xl">
                Kelola Desa Asri
              </h2>
              <p className="text-xs text-stone-500 md:text-sm">{todayLabel}</p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  {session?.user?.name || session?.user?.email}
                </p>
                <p className="text-xs text-stone-500">Administrator</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Keluar
              </Button>
            </div>
          </div>
        </header>

        <main className="space-y-8 px-6 py-8 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
