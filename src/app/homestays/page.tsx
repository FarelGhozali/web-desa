
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
    <div className="bg-gradient-to-br from-[#fdf8f1] via-[#edf7ef] to-[#fffaf0] py-16">
      <Container className="space-y-14">
        <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-800/70">
          <Link href="/" className="transition hover:text-emerald-700">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-emerald-900">Homestay</span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-emerald-100/70 bg-white/90 shadow-[0_30px_100px_-60px_rgba(15,118,110,0.45)]">
          <div className="relative grid gap-10 p-10 md:grid-cols-[1.7fr_1fr]">
            <div className="space-y-5">
              <Badge className="bg-emerald-100/80 text-emerald-900 ring-emerald-300/50">Pilihan Warga</Badge>
              <h1 className="text-4xl leading-tight text-emerald-950 md:text-5xl">
                Daftar homestay hangat untuk menyatu dengan kehidupan desa.
              </h1>
              <p className="text-lg text-stone-600">
                Setiap rumah menawarkan kisah unik: dari pondok bambu di tepi sawah sampai rumah kayu di lereng bukit.
                Nikmati sarapan rumahan, percakapan malam hari, dan panorama alam yang menenangkan.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {[{
                  title: 'Keluarga tuan rumah',
                  value: '58',
                  description: 'siap menyambut dengan cerita khas desa',
                }, {
                  title: 'Pengalaman lokal',
                  value: '24',
                  description: 'aktivitas yang bisa dikurasi untuk Anda',
                }, {
                  title: 'Rating tamu',
                  value: '4.8/5',
                  description: 'rerata ulasan sepanjang tahun ini',
                }].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5">
                    <p className="text-2xl font-semibold text-emerald-900">{item.value}</p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700/80">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-emerald-700/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-8 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-emerald-950">Temukan rumah tinggal terbaik</h2>
                <p className="text-sm leading-relaxed text-emerald-800/80">
                  Filter berdasarkan kapasitas, fasilitas, atau pengalaman yang ingin Anda rasakan. Tim kami siap
                  memberi rekomendasi personal jika diperlukan.
                </p>
              </div>
              <div className="space-y-3 text-sm text-emerald-700">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-700">🌾</span>
                  Sawah, bukit, dan desa hutan sebagai pilihan lokasi.
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-700">🍲</span>
                  Sarapan rumahan dan kelas masak tradisional tersedia.
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-700">🛶</span>
                  Paket aktivitas akhir pekan dapat dicustom sesuai minat.
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-800"
              >
                Konsultasi itinerary gratis →
              </Link>
            </div>
          </div>
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

        <div className="grid gap-6 rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-sm md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-emerald-950">Butuh inspirasi akhir pekan?</h2>
            <p className="text-sm leading-relaxed text-stone-600">
              Kami dapat menyusun itinerary 2-3 hari termasuk homestay, kuliner rumahan, serta kegiatan alam.
              Ceritakan preferensi Anda dan tim kami akan menyiapkan opsi terbaik.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-stone-600">
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-700">🗓</span>
              Rencana perjalanan fleksibel sesuai jadwal Anda.
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-700">🧺</span>
              Paket piknik sawah dan kelas masak keluarga.
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-700">🚲</span>
              Sesi sepeda kampung bersama pemandu lokal.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
