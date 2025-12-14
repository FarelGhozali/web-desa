'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface LayoutProviderProps {
  children: ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  return (
    <SessionProvider 
      refetchInterval={60}
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
