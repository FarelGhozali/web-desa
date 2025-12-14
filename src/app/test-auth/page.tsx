'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function TestAuthPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <Card className="p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold font-heading mb-6">Auth Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Session Status</h2>
            <p className="text-lg">
              Status: <span className="font-mono bg-stone-100 px-2 py-1 rounded">{status}</span>
            </p>
          </div>

          {status === 'authenticated' && session ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">Session Data</h2>
              <div className="bg-stone-100 p-4 rounded-lg space-y-2">
                <p><strong>User ID:</strong> {session.user?.id || 'N/A'}</p>
                <p><strong>Name:</strong> {session.user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
                <p><strong>Role:</strong> <span className="font-mono bg-emerald-100 px-2 py-1 rounded">{session.user?.role || 'N/A'}</span></p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Access Control Test:</h3>
                  <div className="space-y-2">
                    {session.user?.role === 'ADMIN' ? (
                      <p className="text-green-600 font-medium">✅ You have ADMIN role - should be able to access /admin</p>
                    ) : (
                      <p className="text-red-600 font-medium">❌ You have USER role - cannot access /admin</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <a href="/admin">
                    <Button>Go to Admin Dashboard</Button>
                  </a>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-red-600 mb-4">Not authenticated</p>
              <a href="/login">
                <Button>Go to Login</Button>
              </a>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <pre className="text-xs overflow-auto bg-white p-4 rounded">
              {JSON.stringify({ status, session }, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}
