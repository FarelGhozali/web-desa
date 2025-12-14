import type { Metadata } from 'next';
import { Nunito, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LayoutProvider from '@/components/providers/LayoutProvider';
import { cn } from '@/lib/utils';

const bodyFont = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
});

const headingFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: {
    default: 'Desa Asri - Pengalaman Homestay Autentik',
    template: '%s | Desa Asri'
  },
  description: 'Temukan kehidupan desa yang autentik melalui homestay pilihan kami. Rasakan budaya lokal, kuliner khas, dan keindahan alam yang menakjubkan.',
  keywords: ['homestay', 'wisata desa', 'pengalaman autentik', 'budaya lokal', 'ekowisata'],
  openGraph: {
    title: 'Desa Asri - Pengalaman Homestay Autentik',
    description: 'Temukan kehidupan desa yang autentik melalui homestay pilihan kami.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          bodyFont.variable,
          headingFont.variable,
          'bg-stone-50 text-stone-900 antialiased'
        )}
      >
        <LayoutProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow" style={{ backgroundColor: 'transparent' }}>
              {children}
            </main>
            <Footer />
          </div>
        </LayoutProvider>
      </body>
    </html>
  );
}
