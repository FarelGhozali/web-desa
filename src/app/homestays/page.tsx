
import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
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
    <div className="py-16">
      <Container className="space-y-12">
        <div className="overflow-hidden rounded-3xl border border-emerald-100/60 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <Badge className="bg-emerald-100/80 text-emerald-900 ring-emerald-300/40">Pilihan Warga</Badge>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl text-stone-600">Daftar homestay hangat untuk menyatu dengan kehidupan desa.</h1>
                <p className="text-stone-600">
                  Setiap rumah menawarkan kisah unik: dari pondok bambu di tepi sawah sampai rumah kayu di lereng bukit.
                  Nikmati sarapan rumahan, percakapan malam hari, dan panorama alam yang menenangkan.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center text-sm font-semibold uppercase tracking-[0.3em] text-emerald-800">
              <div className="rounded-3xl bg-white/70 px-6 py-4 shadow-sm">
                <p className="text-2xl text-emerald-800">82%</p>
                <p className="mt-1 text-xs">Pangan organik</p>
              </div>
              <div className="rounded-3xl bg-white/70 px-6 py-4 shadow-sm">
                <p className="text-2xl text-emerald-800">24</p>
                <p className="mt-1 text-xs">Pengalaman pemandu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section - TODO: Implement filters */}
        <div className="rounded-3xl border border-stone-200/60 bg-white/90 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Fitur pencarian segera hadir — pilih berdasarkan keluarga, aktivitas, atau lokasi favorit.
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
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(47,127,82,0.35),_rgba(47,127,82,0.05))]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-emerald-900/60" />
                <div className="relative flex h-full flex-col justify-between p-5 text-white">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900">
                    <span>{homestay.name}</span>
                    <span>{homestay.address}</span>
                  </div>
                  <p className="text-lg font-semibold line-clamp-2">{homestay.description}</p>
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
