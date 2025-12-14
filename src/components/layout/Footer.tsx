import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#f7f1e3] via-[#e9f4ed] to-[#fff9ec] text-emerald-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 28%, rgba(108,167,130,0.18) 0, rgba(108,167,130,0) 58%), radial-gradient(circle at 78% 5%, rgba(255,195,128,0.2) 0, rgba(255,195,128,0) 48%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Brand Story */}
          <div>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                🌿
              </span>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-emerald-950">Desa Asri</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700/70">
                  Harmoni dengan alam
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-stone-600">
              Kami menghubungkan wisatawan yang bertanggung jawab dengan keluarga di desa kami. Setiap menginap mendukung 
              pengrajin lokal, melestarikan tradisi, dan membantu sawah serta hutan kami berkembang untuk generasi mendatang.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-12">
            {/* Jelajahi */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700/70">Jelajahi</h4>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  { href: '/homestays', label: 'Homestays' },
                  { href: '/attractions', label: 'Atraksi Alam' },
                  { href: '/culinary', label: 'Kuliner Desa' },
                  { href: '/blog', label: 'Cerita Desa' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-emerald-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kunjungi Kami */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700/70">Kunjungi Kami</h4>
              <ul className="mt-5 space-y-3 text-sm text-stone-600">
                <li>
                  <span className="block font-semibold text-emerald-950">Desa Asri</span>
                  Jl. Persawahan No. 12<br />
                  Desa Asri, Jawa Barat
                </li>
                <li>
                  <span className="block font-semibold text-emerald-950">Email</span>
                  <a href="mailto:hello@desaasri.com" className="transition hover:text-emerald-600">
                    hello@desaasri.com
                  </a>
                </li>
                <li>
                  <span className="block font-semibold text-emerald-950">Telepon</span>
                  <a href="tel:+621234567890" className="transition hover:text-emerald-600">
                    +62 123 456 7890
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 text-sm text-stone-600">
          <div className="flex flex-col gap-4 text-center lg:flex-row lg:items-center lg:justify-between">
            <p>&copy; {new Date().getFullYear()} Desa Asri. Dibuat dengan cinta dari desa kami.</p>
            <div className="flex items-center justify-center gap-6">
              <Link href="/about" className="transition hover:text-emerald-600">
                Tentang Kami
              </Link>
              <Link href="/blog" className="transition hover:text-emerald-600">
                Jurnal Desa
              </Link>
              <Link href="/contact" className="transition hover:text-emerald-600">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
