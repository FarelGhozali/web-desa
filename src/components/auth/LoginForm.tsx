"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Login result:", result);

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Force refresh to get new session
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md">
      <div className="rounded-[32px] border border-white/10 bg-white/95 p-10 shadow-2xl backdrop-blur">
        <header className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
            <span className="text-lg font-semibold">VS</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-stone-900 sm:text-3xl">
            Masuk ke akun Anda
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Silakan masukkan kredensial Anda untuk melanjutkan perjalanan.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="nama@villagestay.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between text-xs text-stone-500">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              Ingat saya
            </label>
            <Link href="/contact" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Lupa password?
            </Link>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-8 rounded-2xl bg-stone-100/70 p-4 text-center text-sm text-stone-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Daftar sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
