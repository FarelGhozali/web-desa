import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Desa Serenity | Village Homestay & Tourism Portal",
    template: "%s | Desa Serenity",
  },
  description:
    "Discover authentic village stays, curated attractions, culinary delights, and inspiring stories from Desa Serenity.",
  metadataBase: new URL("https://desa-serenity.example.com"),
  openGraph: {
    title: "Desa Serenity | Village Homestay & Tourism Portal",
    description:
      "Book eco-friendly homestays, explore natural attractions, savor local cuisine, and read stories from Desa Serenity.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Serenity | Village Homestay & Tourism Portal",
    description:
      "Plan your stay and explore the natural beauty, flavors, and culture of Desa Serenity.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-emerald-50 antialiased`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 bg-white/60 pb-16 pt-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
