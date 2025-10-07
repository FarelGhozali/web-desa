import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 text-emerald-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0, rgba(255,255,255,0) 55%), radial-gradient(circle at 75% 0%, rgba(255,255,255,0.18) 0, rgba(255,255,255,0) 45%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Story */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800/60 text-3xl">
                🌿
              </span>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-white">Village Stay</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  Harmony with nature
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-emerald-100/80">
              We connect mindful travelers with families in our village. Every stay supports local artisans,
              preserves traditions, and helps our fields and forests thrive for generations to come.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { href: '/homestays', label: 'Homestays' },
                { href: '/attractions', label: 'Nature Trails' },
                { href: '/culinary', label: 'Village Cuisine' },
                { href: '/blog', label: 'Village Stories' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-emerald-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">Visit Us</h4>
            <ul className="mt-5 space-y-3 text-sm text-emerald-100/80">
              <li>
                <span className="block font-semibold text-white">Village Stay Cooperative</span>
                Jl. Persawahan No. 12<br />
                Desa Harmoni, Jawa Barat
              </li>
              <li>
                <span className="block font-semibold text-white">Email</span>
                <a href="mailto:hello@villagestay.com" className="transition hover:text-emerald-200">
                  hello@villagestay.com
                </a>
              </li>
              <li>
                <span className="block font-semibold text-white">Phone</span>
                <a href="tel:+621234567890" className="transition hover:text-emerald-200">
                  +62 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-sm text-emerald-200/80">
          <div className="flex flex-col gap-4 text-center lg:flex-row lg:items-center lg:justify-between">
            <p>&copy; {new Date().getFullYear()} Village Stay Cooperative. Crafted with love from our village.</p>
            <div className="flex items-center justify-center gap-6">
              <Link href="/about" className="transition hover:text-emerald-200">
                Our Story
              </Link>
              <Link href="/blog" className="transition hover:text-emerald-200">
                Village Journal
              </Link>
              <Link href="/contact" className="transition hover:text-emerald-200">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
