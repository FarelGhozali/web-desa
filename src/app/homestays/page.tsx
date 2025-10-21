'use client';

import Image from 'next/image';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import HomestayFilters from '@/components/HomestayFilters';
import { useState, useEffect } from 'react';

interface FilterState {
  minPrice: string;
  maxPrice: string;
  maxGuests: string;
  sortBy: string;
  facilities: string[];
}

interface ParsedHomestay {
  id: string;
  slug: string;
  name: string;
  address: string;
  description: string;
  photos: string[];
  facilities: string[];
  maxGuests: number;
  pricePerNight: number;
}

export default function HomestaysPage() {
  const [homestays, setHomestays] = useState<ParsedHomestay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch initial homestays
  useEffect(() => {
    const fetchInitialHomestays = async () => {
      try {
        const response = await fetch('/api/homestays/filter');
        const data = await response.json();
        if (data.success) {
          setHomestays(data.data);
        }
      } catch (error) {
        console.error('Error fetching homestays:', error);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchInitialHomestays();
  }, []);

  const handleFilterChange = async (filters: FilterState) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.maxGuests) params.append('maxGuests', filters.maxGuests);
      params.append('sortBy', filters.sortBy);
      if (filters.facilities.length > 0) {
        params.append('facilities', JSON.stringify(filters.facilities));
      }

      const response = await fetch(`/api/homestays/filter?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setHomestays(data.data);
      }
    } catch (error) {
      console.error('Error filtering homestays:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Filter Section */}
        <HomestayFilters onFilterChange={handleFilterChange} isLoading={isLoading} />

        {/* Loading State */}
        {initialLoad && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
              <p className="text-sm text-stone-600">Memuat homestay...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!initialLoad && homestays.length === 0 && (
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-12 text-center shadow-sm">
            <p className="text-sm text-stone-600">Tidak ada homestay yang sesuai dengan filter Anda.</p>
            <p className="mt-2 text-xs text-stone-500">Coba ubah filter atau hubungi kami untuk rekomendasi.</p>
          </div>
        )}

        {/* Homestay Grid */}
        {homestays.length > 0 && (
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
                    {homestay.facilities && Array.isArray(homestay.facilities)
                      ? homestay.facilities.join(', ')
                      : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-stone-600">
                  <div className="flex items-center justify-between">
                    <span>👥 Maks {homestay.maxGuests} tamu</span>
                    <span>🛏 {homestay.facilities?.length || 0} fasilitas</span>
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
        )}

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
