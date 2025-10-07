"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/homestays", label: "Homestays" },
  { href: "/attractions", label: "Attractions" },
  { href: "/cuisine", label: "Cuisine" },
  { href: "/blog", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-emerald-800">
          Desa Serenity
        </Link>
        <nav className="hidden items-center gap-3 text-sm font-medium sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-1.5 transition",
                pathname?.startsWith(item.href)
                  ? "bg-emerald-200 text-emerald-900"
                  : "text-emerald-700 hover:bg-emerald-100",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="rounded-full border border-emerald-200 px-3 py-1.5 font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            Dashboard
          </Link>
          <Link
            href="/homestays"
            className="rounded-full bg-emerald-600 px-3 py-1.5 font-semibold text-white shadow hover:bg-emerald-500"
          >
            Book a Stay
          </Link>
        </div>
      </div>
    </header>
  );
}
