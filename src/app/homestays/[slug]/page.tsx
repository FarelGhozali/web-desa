import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import BookingForm from '@/components/BookingForm';
import MapEmbedDisplay from '@/components/MapEmbedDisplay';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const homestay = await prisma.homestay.findUnique({ where: { slug } });

  if (!homestay) {
    return {
      title: 'Homestay Tidak Ditemukan',
      description: 'Homestay yang Anda cari tidak ditemukan',
    };
  }

  return {
    title: `${homestay.name} - Pemesanan Homestay`,
    description: homestay.description,
  };
}

export default async function HomestayDetailPage({ params }: Props) {
  const { slug } = await params;
  const homestay = await prisma.homestay.findUnique({
    where: { slug },
    include: {
      reviews: {
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      },
    },
  });

  if (!homestay) {
    notFound();
  }

  const parseStringArray = (value: string | string[]): string[] => {
    if (Array.isArray(value)) {
      return value;
    }

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse string array field', error);
      return [];
    }
  };

  const photos = parseStringArray(homestay.photos);
  const facilities = parseStringArray(homestay.facilities);
  const pricePerNight = Number(homestay.pricePerNight);
  const totalReviews = homestay.reviews.length;
  const averageRating =
    totalReviews === 0
      ? null
      : homestay.reviews.reduce((acc, review) => acc + review.rating, 0) /
        totalReviews;

  const heroImage = photos[0];

  return (
    <div className="bg-gradient-to-br from-[#fdf8f1] via-[#edf7ef] to-[#fffaf0] pb-20 pt-12">
      <Container size="lg">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-emerald-700">
          <Link href="/homestays" className="transition hover:text-emerald-600/80">
            Homestay
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-emerald-900">{homestay.name}</span>
        </div>

        <div className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <div className="space-y-10">
              <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="relative h-[360px] overflow-hidden bg-stone-200 sm:h-[420px]">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={`${homestay.name} - Foto utama`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-emerald-100 to-emerald-50" />
                )}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 space-y-3 text-white">
                  <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest">
                    Homestay unggulan
                  </div>
                  <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                    {homestay.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                    <span className="inline-flex items-center gap-1">
                      <span aria-hidden="true">📍</span>
                      {homestay.address}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span aria-hidden="true">👥</span>
                      Maks {homestay.maxGuests} tamu
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span aria-hidden="true">💰</span>
                      {formatPrice(pricePerNight)}/malam
                    </span>
                  </div>
                </div>
              </div>

              {photos.length > 1 && (
                <div className="border-t border-emerald-100 bg-emerald-50/30 px-6 py-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider text-emerald-700">
                    Galeri homestay
                    <span className="h-5 w-px bg-emerald-200" />
                    <span>{photos.length} foto</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {photos.slice(1, 5).map((photo, index) => (
                      <div key={photo} className="relative h-28 overflow-hidden rounded-2xl bg-stone-200">
                        <Image
                          src={photo}
                          alt={`${homestay.name} - Foto ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {photos.length < 5 &&
                      Array.from({ length: 5 - Math.min(photos.length, 5) }).map((_, index) => (
                        <div
                          key={`placeholder-${index}`}
                          className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-emerald-200 text-xs font-semibold uppercase tracking-widest text-emerald-500"
                        >
                          Segera hadir
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  Rating tamu
                </p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <p className="text-3xl font-semibold text-stone-900">
                    {averageRating !== null ? averageRating.toFixed(1) : 'Belum ada rating'}
                  </p>
                  {averageRating !== null && (
                    <div className="flex items-center gap-1 text-amber-500">
                      {'★'.repeat(Math.round(averageRating))}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  {totalReviews > 0
                    ? `${totalReviews} ${totalReviews > 1 ? 'ulasan' : 'ulasan'}`
                    : 'Belum ada ulasan dari tamu'}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  Informasi cepat
                </p>
                <dl className="mt-3 space-y-2 text-sm text-stone-700">
                  <div className="flex justify-between">
                    <dt>Harga per malam</dt>
                    <dd className="font-semibold text-emerald-700">
                      {formatPrice(pricePerNight)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Kapasitas maksimal</dt>
                    <dd>{homestay.maxGuests} tamu</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Reservasi minimum</dt>
                    <dd>1 malam</dd>
                  </div>
                </dl>
              </div>
            </div>

            <section className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-stone-900">
                    Tentang homestay ini
                  </h2>
                  <p className="mt-2 text-sm text-stone-500">
                    Rencanakan liburan nyaman dengan fasilitas lengkap dan suasana hangat.
                  </p>
                </div>
                <div className="hidden text-right text-sm text-stone-500 md:block">
                  Dikelola dengan standar kebersihan tinggi dan keramahan khas desa.
                </div>
              </div>
              <p className="text-base leading-relaxed text-stone-700">
                {homestay.description}
              </p>
            </section>

            {facilities.length > 0 && (
              <section className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-stone-900">Fasilitas unggulan</h2>
                <p className="mt-2 text-sm text-stone-500">
                  Semua fasilitas telah disiapkan agar Anda merasa seperti di rumah sendiri.
                </p>
                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {facilities.map((facility) => (
                    <li
                      key={facility}
                      className="inline-flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-stone-700"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"
                      >
                        ✓
                      </span>
                      {facility}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-stone-900">Testimoni tamu</h2>
                  <p className="mt-2 text-sm text-stone-500">
                    Cerita asli dari tamu yang sudah menikmati pengalaman menginap.
                  </p>
                </div>
                {totalReviews > 0 && (
                  <Link href={`/homestays/${homestay.slug}/reviews`}>
                    <Button variant="secondary" size="sm">
                      Lihat semua
                    </Button>
                  </Link>
                )}
              </div>

              {totalReviews > 0 ? (
                <ul className="mt-8 grid gap-6 sm:grid-cols-2">
                  {homestay.reviews.map((review) => (
                    <li
                      key={review.id}
                      className="flex h-full flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-emerald-100">
                          {review.user.image ? (
                            <Image
                              src={review.user.image}
                              alt={review.user.name || 'Guest'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-emerald-700">
                              {(review.user.name || 'G').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-base font-semibold text-stone-900">
                            {review.user.name || 'Anonymous'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
                            <span
                              className="text-amber-500"
                              aria-label={`Rating ${review.rating} dari 5 bintang`}
                            >
                              {'★'.repeat(review.rating)}
                              {'☆'.repeat(5 - review.rating)}
                            </span>
                            <time dateTime={new Date(review.createdAt).toISOString()}>
                              {new Date(review.createdAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </time>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-stone-700">
                        “{review.comment}”
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-8 rounded-2xl border border-dashed border-emerald-200 p-6 text-sm text-stone-600">
                  Belum ada ulasan. Jadilah yang pertama memberikan pengalaman menyenangkan Anda.
                </p>
              )}
            </section>
          </div>

          <aside className="self-start lg:sticky lg:top-24 space-y-6">
            <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                    Mulai dari
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-stone-900">
                    {formatPrice(pricePerNight)}
                    <span className="ml-1 text-sm font-normal text-stone-500">/malam</span>
                  </p>
                </div>
              </div>



              <div className="mt-6">
                <BookingForm
                  homestayId={homestay.id}
                  pricePerNight={pricePerNight}
                  maxGuests={homestay.maxGuests}
                  homestayName={homestay.name}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900">Butuh bantuan?</h3>
              <p className="mt-2 text-sm text-stone-600">
                Tim kami siap membantu rekomendasi aktivitas, transportasi, dan pengalaman lokal terbaik.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Hubungi kami
              </Link>
            </div>
          </aside>
          </div>

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(homestay as any).mapsEmbedCode && (
            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-stone-900">Lokasi</h2>
                <p className="mt-2 text-sm text-stone-500">
                  Temukan homestay dengan rute terbaik menuju lokasi wisata terdekat.
                </p>
              </div>
              <div className="rounded-3xl overflow-hidden border border-emerald-100 bg-white shadow-sm">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <MapEmbedDisplay embedCode={(homestay as any).mapsEmbedCode} className="h-96" />
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
