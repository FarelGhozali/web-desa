'use client';

import { ReactNode, useEffect } from 'react';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
        <main className="space-y-8 px-6 py-8 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
