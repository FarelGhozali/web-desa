import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function DebugAuthPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-4">Debug: No Session</h1>
          <p className="mb-4">You are not logged in.</p>
          <Link href="/login" className="text-blue-600 underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  const canAccessAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6">Session Debug (Server Side)</h1>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <p className="font-semibold text-green-800">✅ Session Found!</p>
          </div>

          <div className="bg-stone-50 p-4 rounded">
            <h2 className="font-semibold mb-2">User Information:</h2>
            <div className="space-y-1 text-sm">
              <p><strong>ID:</strong> {session.user.id}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Name:</strong> {session.user.name || "N/A"}</p>
              <p><strong>Role:</strong> <span className="bg-emerald-100 px-2 py-1 rounded font-mono">{session.user.role}</span></p>
            </div>
          </div>

          <div className={`p-4 rounded border ${canAccessAdmin ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h2 className="font-semibold mb-2">Admin Access Check:</h2>
            {canAccessAdmin ? (
              <p className="text-green-700">✅ You have ADMIN role - Can access /admin</p>
            ) : (
              <p className="text-red-700">❌ You have USER role - Cannot access /admin</p>
            )}
          </div>

          <div className="flex gap-4">
            {canAccessAdmin && (
              <Link href="/admin" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
                Go to Admin Dashboard
              </Link>
            )}
            <Link href="/test-auth" className="bg-stone-600 text-white px-4 py-2 rounded hover:bg-stone-700">
              Client Side Test
            </Link>
            <Link href="/" className="bg-stone-200 text-stone-900 px-4 py-2 rounded hover:bg-stone-300">
              Home
            </Link>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Full Session Data:</h3>
            <pre className="text-xs overflow-auto bg-white p-4 rounded">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
