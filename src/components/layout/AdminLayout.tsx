'use client';

import { useSession, signOut } from 'next-auth/react';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Button from '../ui/Button';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-heading text-stone-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-stone-600">
                Kelola konten dan data website Village Stay
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-stone-900">
                  {session?.user?.name || session?.user?.email}
                </p>
                <p className="text-xs text-stone-500">Administrator</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
