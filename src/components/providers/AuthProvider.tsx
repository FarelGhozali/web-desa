"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider 
      refetchInterval={60} // Refetch session setiap 60 detik
      refetchOnWindowFocus={true} // Refetch ketika window focus
    >
      {children}
    </SessionProvider>
  );
}
