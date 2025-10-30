'use client';

import Link from 'next/link';
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
      <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
          <span>Pilihan Homestay Alternatif</span>
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-emerald-600">
            {formattedCheckIn && <span className="rounded-full border border-emerald-200 px-3 py-1">Check-in {formattedCheckIn}</span>}
            {formattedCheckOut && <span className="rounded-full border border-emerald-200 px-3 py-1">Check-out {formattedCheckOut}</span>}
            {typeof numberOfGuests === 'number' && numberOfGuests > 0 && (
              <span className="rounded-full border border-emerald-200 px-3 py-1">{numberOfGuests} tamu</span>
            )}
            {nights && nights > 0 && (
              <span className="rounded-full border border-emerald-200 px-3 py-1">{nights} malam</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {alternatives.map((homestay) => (
          <Card
            key={homestay.id}
            hover
            className="flex flex-col border-emerald-100/60 bg-white/95 shadow-sm ring-1 ring-transparent transition hover:ring-emerald-200"
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-base font-semibold leading-tight text-stone-900 line-clamp-2">
                    {homestay.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2">{homestay.description}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  {homestay.maxGuests} tamu
                </span>
              </div>

              {homestay.facilities.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
                  {homestay.facilities.slice(0, 2).map((facility) => (
                    <span key={facility} className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                      {facility}
                    </span>
                  ))}
                  {homestay.facilities.length > 2 && (
                    <span className="text-[11px] font-semibold text-emerald-600">
                      +{homestay.facilities.length - 2} lainnya
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-emerald-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-baseline gap-2 text-emerald-700">
                  <span className="text-lg font-semibold">{formatPrice(homestay.pricePerNight)}</span>
                  <span className="text-[11px] text-stone-500">/ malam</span>
                </div>

                <Link
                  href={`/homestays/${homestay.slug}?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${numberOfGuests || 1}`}
                  className="inline-flex sm:ml-auto"
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
