
import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Homestay Desa',
  description: 'Temukan homestay pilihan warga Desa Harmoni dengan keramahan autentik dan pengalaman lokal yang tulus.',
};
// Server Component
export default async function HomestaysPage() {
  const homestaysRaw = await prisma.homestay.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
  // Parse JSON fields
  const homestays = homestaysRaw.map((h) => ({
    ...h,
    photos: h.photos ? JSON.parse(h.photos) : [],
    amenities: h.amenities ? JSON.parse(h.amenities) : [],
  }));

  return (
    <div className="bg-gradient-to-br from-[#fdf8f1] via-[#edf7ef] to-[#fffaf0] py-16">
      <Container className="space-y-14">
        <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-800/70">
          <Link href="/" className="transition hover:text-emerald-700">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-emerald-900">Homestay</span>
        </div>

        {/* Filter Section - TODO: Implement filters */}
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700/80">
            Fitur pencarian segera hadir — pilih berdasarkan keluarga, aktivitas, atau lokasi favorit.
          </p>
          <p className="mt-2 text-sm text-stone-600">
            Sementara itu, gulir daftar homestay di bawah ini atau hubungi kami untuk rekomendasi kilat.
          </p>
        </div>

        {/* Homestay Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {homestays.map((homestay) => (
            <Card key={homestay.id} hover className="bg-white">
              <div className="relative h-48 overflow-hidden rounded-3xl">
                {homestay.photos[0] && (
                  <Image
                    src={homestay.photos[0]}
                    alt={homestay.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(47,127,82,0.28),_rgba(47,127,82,0.04))]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/12 to-emerald-400/35" />
                <div className="relative flex h-full flex-col justify-between p-5 text-emerald-50">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-white">
                    <span>{homestay.name}</span>
                    <span>{homestay.address}</span>
                  </div>
                  <p className="text-lg font-semibold line-clamp-2 text-white">{homestay.description}</p>
                </div>
              </div>
              <CardHeader className="space-y-4">
                <CardTitle>{homestay.name}</CardTitle>
                <CardDescription className="text-stone-600">
                  {homestay.amenities && Array.isArray(homestay.amenities)
                    ? homestay.amenities.join(', ')
                    : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-stone-600">
                <div className="flex items-center justify-between">
                  <span>👥 Maks {homestay.maxGuests} tamu</span>
                  <span>🛏 {homestay.amenities?.length || 0} fasilitas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-emerald-700">Rp {homestay.pricePerNight.toLocaleString('id-ID')} / malam</span>
                  <Link
                    href={`/homestays/${homestay.slug}`}
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700"
                  >
                    Lihat detail →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Minta rekomendasi personal
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
