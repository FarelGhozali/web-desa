import { Suspense } from "react";
import Container from "@/components/ui/Container";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f5f0e6] via-[#e6f4ec] to-[#fff8ea]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl lg:h-[28rem] lg:w-[28rem]" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-amber-200/40 blur-[140px] lg:h-[32rem] lg:w-[32rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(98,156,122,0.18),_transparent_60%)]" />
      </div>

      <Container
        size="full"
        className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16"
      >
        <Suspense fallback={<div className="h-96 w-full max-w-md rounded-[32px] bg-white/50 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </Container>
    </div>
  );
}
