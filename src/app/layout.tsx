import type { Metadata } from 'next';
import { Nunito, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/providers/AuthProvider';
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
    default: 'Village Stay - Authentic Homestay Experience',
    template: '%s | Village Stay'
  },
  description: 'Discover authentic village life with our carefully selected homestays. Experience local culture, cuisine, and natural beauty.',
  keywords: ['homestay', 'village tourism', 'authentic experience', 'local culture', 'eco-tourism'],
  openGraph: {
    title: 'Village Stay - Authentic Homestay Experience',
    description: 'Discover authentic village life with our carefully selected homestays.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          bodyFont.variable,
          headingFont.variable,
          'bg-stone-50 text-stone-900 antialiased'
        )}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow" style={{ backgroundColor: 'transparent' }}>
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
