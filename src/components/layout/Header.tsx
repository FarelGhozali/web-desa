'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/homestays', label: 'Homestays' },
  { href: '/attractions', label: 'Attractions' },
  { href: '/culinary', label: 'Culinary' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/60 bg-[rgba(253,248,241,0.92)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3" onClick={closeMenu}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700/10 text-2xl">
              🌾
            </span>
            <div>
              <p className="text-xl font-semibold tracking-tight text-stone-900 group-hover:text-emerald-800">
                Village Stay
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700/80">
                Live like a local
              </p>
            </div>
          </Link>

          {/* Desktop Navigation (centered) */}
          <div className="hidden md:flex md:items-center md:gap-8 md:flex-1 md:justify-center">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-600 transition-colors hover:text-emerald-700"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions (right) */}
          <div className="hidden items-center gap-4 md:flex">
            {!isLoading && session ? (
              <>
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm hover:bg-emerald-100 transition"
                  >
                    <span>👤</span>
                    <span className="font-medium text-stone-700">{session.user.name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center justify-center rounded-full border border-emerald-700 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-700 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-50 shadow-sm transition hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100" style={{color:'#F4F7ED'}} 
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-2 text-stone-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={cn(
            'md:hidden',
            isMenuOpen ? 'block' : 'hidden'
          )}
        >
          <div className="space-y-2 border-t border-emerald-100/60 py-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="block rounded-lg px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-stone-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile menu: include Contact and Blog explicitly */}
            <Link
              href="/contact"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-stone-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              onClick={closeMenu}
              className="block rounded-lg px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-stone-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              Blog
            </Link>
            {/* Mobile Auth Actions */}
            {!isLoading && session ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="block rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-stone-900 hover:bg-emerald-100 transition"
                >
                  👤 Profil Saya
                </Link>
                <Link
                  href="/bookings"
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-stone-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                >
                  📅 Pemesanan Saya
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    handleSignOut();
                  }}
                  className="flex w-full items-center justify-center rounded-full border border-emerald-700 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700 transition hover:bg-emerald-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center rounded-full border border-emerald-700 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700 transition hover:bg-emerald-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex items-center justify-center rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-50 shadow-sm transition hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50" style={{color:'#F4F7ED'}} 
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
