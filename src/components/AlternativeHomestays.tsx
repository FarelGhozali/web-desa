'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { calculateNights, formatPrice } from '@/lib/utils';

interface Alternative {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  address: string;
  photos: string[];
  facilities: string[];
}

interface AlternativeHomestaysProps {
  alternatives: Alternative[];
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests?: number;
}

export default function AlternativeHomestays({
  alternatives,
  checkInDate,
  checkOutDate,
  numberOfGuests,
}: AlternativeHomestaysProps) {
  if (!alternatives || alternatives.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm text-amber-800">
          Maaf, tidak ada homestay lain yang tersedia untuk tanggal tersebut. Silakan{' '}
          <Link href="/contact" className="font-semibold underline hover:text-amber-900">
            hubungi kami
          </Link>{' '}
          untuk bantuan lebih lanjut.
        </p>
      </div>
    );
  }

  const parseDate = (value: string): Date | null => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const checkIn = parseDate(checkInDate);
  const checkOut = parseDate(checkOutDate);
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : null;

  const formattedCheckIn = checkIn
    ? checkIn.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    : null;
  const formattedCheckOut = checkOut
    ? checkOut.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    : null;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-900">
              Pilihan Homestay Alternatif
            </p>
            <p className="text-sm text-amber-700">
              Daftar homestay lain yang cocok untuk jadwal perjalanan Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-emerald-700">
            {formattedCheckIn && (
              <span className="rounded-full border border-emerald-200 px-3 py-1">
                Check-in {formattedCheckIn}
              </span>
            )}
            {formattedCheckOut && (
              <span className="rounded-full border border-emerald-200 px-3 py-1">
                Check-out {formattedCheckOut}
              </span>
            )}
            {typeof numberOfGuests === 'number' && numberOfGuests > 0 && (
              <span className="rounded-full border border-emerald-200 px-3 py-1">
                {numberOfGuests} tamu
              </span>
            )}
            {nights && nights > 0 && (
              <span className="rounded-full border border-emerald-200 px-3 py-1">
                {nights} malam
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {alternatives.map((homestay) => (
          <Card
            key={homestay.id}
            hover
            className="flex flex-col border-transparent bg-white/95 shadow-md ring-1 ring-transparent transition hover:ring-emerald-200/80 sm:flex-row"
          >
            <div className="relative min-h-[160px] overflow-hidden border-b border-emerald-50 sm:w-64 sm:border-b-0 sm:border-r">
              {homestay.photos[0] ? (
                <Image
                  src={homestay.photos[0]}
                  alt={homestay.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-200 via-emerald-50 to-amber-100">
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                    {homestay.name}
                  </span>
                </div>
              )}

              <div className="absolute right-4 top-4 flex flex-col items-end gap-2 text-[10px] font-semibold uppercase tracking-[0.3em]">
                <span className="rounded-full bg-white/85 px-3 py-1 text-emerald-700">
                  Rekomendasi
                </span>
                {nights && nights > 0 && (
                  <span className="rounded-full bg-emerald-600/85 px-3 py-1 text-white">
                    {nights} malam
                  </span>
                )}
              </div>
            </div>

            <CardContent className="flex flex-1 flex-col justify-between gap-4 p-6 pt-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold leading-tight text-stone-900 line-clamp-2">
                      {homestay.name}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-1">{homestay.address}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    {homestay.maxGuests} tamu
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-2 text-stone-700">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                    Mulai dari
                  </span>
                  <span className="text-2xl font-semibold text-emerald-700">
                    {formatPrice(homestay.pricePerNight)}
                  </span>
                  <span className="text-xs text-stone-500">/ malam</span>
                </div>

                {homestay.description && (
                  <p className="text-sm leading-relaxed text-stone-600 line-clamp-2">
                    {homestay.description}
                  </p>
                )}

                {homestay.facilities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {homestay.facilities.slice(0, 3).map((facility) => (
                      <span
                        key={facility}
                        className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        {facility}
                      </span>
                    ))}
                    {homestay.facilities.length > 3 && (
                      <span className="inline-flex items-center rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                        +{homestay.facilities.length - 3} lainnya
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100 pt-4">
                <div className="flex flex-col text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  {formattedCheckIn && formattedCheckOut ? (
                    <span>
                      {formattedCheckIn} – {formattedCheckOut}
                    </span>
                  ) : (
                    <span>Sesuaikan tanggal Anda</span>
                  )}
                  <span className="text-[10px] text-emerald-600">
                    Pilih untuk melihat ketersediaan lengkap
                  </span>
                </div>
                <Link
                  href={`/homestays/${homestay.slug}?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${numberOfGuests || 1}`}
                >
                  <Button variant="secondary" size="sm">
                    Lihat Detail
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
