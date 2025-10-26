'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-amber-900">Pilihan Lain yang Tersedia</p>
        <p className="mt-1 text-xs text-amber-700">
          Homestay pilihan kami yang lain masih tersedia untuk tanggal Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {alternatives.map((homestay) => (
          <Card key={homestay.id} hover className="bg-white">
            {/* Image */}
            <div className="relative h-40 overflow-hidden rounded-2xl bg-stone-200">
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
            </div>

            <CardContent className="space-y-3">
              {/* Name & Price */}
              <div>
                <h4 className="font-semibold text-stone-900 line-clamp-2">
                  {homestay.name}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1">
                  {homestay.address}
                </p>
              </div>

              {/* Price & Capacity */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-xs text-stone-600">Harga/malam</p>
                  <p className="font-semibold text-emerald-700">
                    Rp {homestay.pricePerNight.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-600">Kapasitas</p>
                  <p className="font-semibold text-stone-900">
                    {homestay.maxGuests} tamu
                  </p>
                </div>
              </div>

              {/* Facilities */}
              {homestay.facilities.length > 0 && (
                <div className="space-y-1 border-t border-stone-200 pt-2">
                  <p className="text-xs font-semibold text-stone-600">Fasilitas:</p>
                  <ul className="text-xs text-stone-600 space-y-0.5">
                    {homestay.facilities.slice(0, 2).map((facility) => (
                      <li key={facility} className="flex items-center gap-1">
                        <span>•</span>
                        <span>{facility}</span>
                      </li>
                    ))}
                    {homestay.facilities.length > 2 && (
                      <li className="text-emerald-600 font-semibold">
                        +{homestay.facilities.length - 2} lainnya
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Action */}
              <Link
                href={`/homestays/${homestay.slug}?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${numberOfGuests || 1}`}
              >
                <Button variant="secondary" size="sm" className="w-full">
                  Lihat Detail
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
