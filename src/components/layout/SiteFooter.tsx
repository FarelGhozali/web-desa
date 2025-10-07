import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-100 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-emerald-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold text-emerald-800">Desa Serenity</p>
          <p>Live like a local. Discover the heart of the village.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="hover:text-emerald-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-emerald-900">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-emerald-900">
            Contact
          </Link>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} Desa Serenity. All rights reserved.</p>
      </div>
    </footer>
  );
}
