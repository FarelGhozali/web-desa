'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import AttractionForm from '@/components/AttractionForm';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface Attraction {
  id: string;
  name: string;
  description: string;
  location: string;
  photos: string;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  published: boolean;
}

interface EditAttractionPageContentProps {
  attractionId: string;
}

export default function EditAttractionPageContent({ attractionId }: EditAttractionPageContentProps) {
  const router = useRouter();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/attractions/${attractionId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Destinasi wisata tidak ditemukan');
          } else if (response.status === 401) {
            router.push('/login');
            return;
          } else {
            setError('Gagal memuat destinasi wisata');
          }
          return;
        }

        const data = await response.json();
        setAttraction(data);
      } catch (err) {
        console.error('Error fetching attraction:', err);
        setError('Terjadi kesalahan saat memuat destinasi wisata');
      } finally {
        setLoading(false);
      }
    };

    fetchAttraction();
  }, [attractionId, router]);

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-stone-500">Memuat destinasi wisata...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Link href="/admin/attractions" className="hover:text-emerald-600">
              Kelola Destinasi Wisata
            </Link>
            <span>/</span>
            <span>Edit Destinasi</span>
          </div>

          <div className="rounded-lg bg-red-50 p-8 text-center text-red-900">
            <p className="mb-4 text-lg font-semibold">{error}</p>
            <Link href="/admin/attractions">
              <Button variant="outline">Kembali ke Daftar Destinasi</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (!attraction) {
    return null;
  }

  return (
    <Container>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-stone-600">
            <Link href="/admin/attractions" className="hover:text-emerald-600">
              Kelola Destinasi Wisata
            </Link>
            <span>/</span>
            <span>Edit Destinasi</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900">Edit Destinasi Wisata</h1>
          <p className="mt-1 text-stone-600">
            Perbarui informasi destinasi untuk memastikan deskripsi selalu akurat dan menarik.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-stone-200 bg-white p-8">
          <AttractionForm
            mode="edit"
            attractionId={attraction.id}
            initialData={attraction}
          />
        </div>

        {/* Tips Section */}
        <div className="rounded-lg bg-blue-50 p-6 text-blue-900">
          <h3 className="mb-2 font-semibold">💡 Tips Mengedit Destinasi Wisata</h3>
          <ul className="space-y-1 text-sm">
            <li>• Perbarui deskripsi jika ada atraksi baru atau perubahan fasilitas</li>
            <li>• Update informasi praktis seperti jam operasional atau harga tiket</li>
            <li>• Ubah status Featured untuk promosi destinasi tertentu</li>
            <li>• Publikasikan ulang jika ada update penting</li>
            <li>• Gunakan koordinat GPS yang akurat untuk kemudahan pencarian</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
