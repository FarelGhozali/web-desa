'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import HomestayForm from '@/components/admin/HomestayForm';
import { Card } from '@/components/ui/Card';

interface HomestayData {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  pricePerNight: number;
  maxGuests: number;
  photos: string[];
  facilities: string[];
  latitude?: number;
  longitude?: number;
  featured: boolean;
  published: boolean;
}

export default function EditHomestayPage() {
  const params = useParams();
  const id = params.id as string;

  const [homestay, setHomestay] = useState<HomestayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomestay = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/homestays/${id}`);

        if (!response.ok) {
          setError('Homestay tidak ditemukan');
          return;
        }

        const data = await response.json();

        // Parse JSON fields if they're strings
        const parsedData = {
          ...data,
          photos: typeof data.photos === 'string' ? JSON.parse(data.photos) : data.photos,
          facilities: typeof data.facilities === 'string' ? JSON.parse(data.facilities) : data.facilities,
        };

        setHomestay(parsedData);
      } catch (err) {
        console.error('Error fetching homestay:', err);
        setError('Gagal memuat data homestay');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomestay();
  }, [id]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit Homestay"
          description="Perbarui informasi homestay untuk meningkatkan performa dan menarik lebih banyak tamu."
        />

        {error && (
          <Card className="border-rose-200 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">{error}</p>
          </Card>
        )}

        {isLoading ? (
          <Card className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <p className="text-sm text-stone-500">Memuat data homestay…</p>
          </Card>
        ) : homestay ? (
          <HomestayForm initialData={homestay} />
        ) : null}
      </div>
    </AdminLayout>
  );
}
