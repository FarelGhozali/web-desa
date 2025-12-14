'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ImageUpload from '@/components/ui/ImageUpload';
import MapEmbedDisplay from '@/components/MapEmbedDisplay';

interface Culinary {
  id: string;
  name: string;
  description: string;
  location: string;
  photos: string;
  latitude: number | null;
  longitude: number | null;
  priceRange: string | null;
  featured: boolean;
  published: boolean;
  mapsEmbedCode?: string | null;
}

interface CulinaryFormProps {
  mode?: 'create' | 'edit';
  culinaryId?: string;
  initialData?: Partial<Culinary>;
}

export default function CulinaryForm({ mode = 'create', culinaryId, initialData }: CulinaryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [photos, setPhotos] = useState<string[]>(
    initialData?.photos ? JSON.parse(initialData.photos) : []
  );
  const [latitude, setLatitude] = useState(initialData?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(initialData?.longitude?.toString() || '');
  const [priceRange, setPriceRange] = useState(initialData?.priceRange || '');
  const [mapsEmbedCode, setMapsEmbedCode] = useState(initialData?.mapsEmbedCode || '');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [published, setPublished] = useState(initialData?.published || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!name.trim()) {
      setError('Nama kuliner tidak boleh kosong');
      return;
    }

    if (name.trim().length < 3) {
      setError('Nama minimal 3 karakter');
      return;
    }

    if (!description.trim()) {
      setError('Deskripsi tidak boleh kosong');
      return;
    }

    if (description.trim().length < 20) {
      setError('Deskripsi minimal 20 karakter');
      return;
    }

    if (!location.trim()) {
      setError('Lokasi tidak boleh kosong');
      return;
    }

    setLoading(true);

    try {
      const url = mode === 'create' ? '/api/admin/culinary' : `/api/admin/culinary/${culinaryId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          location: location.trim(),
          photos: JSON.stringify(photos),
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          priceRange: priceRange || null,
          mapsEmbedCode: mapsEmbedCode.trim() || null,
          featured,
          published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Gagal ${mode === 'create' ? 'membuat' : 'memperbarui'} kuliner`);
      }

      setSuccess(true);

      // Redirect to culinary page after 2 seconds
      setTimeout(() => {
        router.push('/admin/culinary');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-8 text-center text-green-900">
        <p className="mb-2 text-2xl font-bold">
          ✓ Kuliner berhasil {mode === 'create' ? 'ditambahkan' : 'diperbarui'}!
        </p>
        <p className="text-sm">Anda akan diarahkan kembali ke daftar kuliner...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-900">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Nama Kuliner *
        </label>
        <Input
          type="text"
          placeholder="Masukkan nama kuliner..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          maxLength={100}
        />
        <p className="text-xs text-stone-500 mt-1">{name.length} / 100 karakter</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Deskripsi *
        </label>
        <Textarea
          placeholder="Jelaskan tentang kuliner ini, cita rasa, bahan-bahan, keunikan, dll..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={5}
        />
        <p className="text-xs text-stone-500 mt-1">{description.length} / 2000 karakter</p>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Lokasi *
        </label>
        <Input
          type="text"
          placeholder="Masukkan lokasi kuliner..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={loading}
          maxLength={150}
        />
        <p className="text-xs text-stone-500 mt-1">{location.length} / 150 karakter</p>
      </div>

      {/* Photos Upload */}
      <div>
        <ImageUpload
          value={photos}
          onChange={setPhotos}
          folder="culinary"
          label="Foto Kuliner *"
          hint="Drag and drop atau klik untuk memilih foto kuliner"
          maxFiles={10}
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Rentang Harga (Opsional)
        </label>
        <Input
          type="text"
          placeholder="Contoh: Rp 10.000 - Rp 50.000"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          disabled={loading}
          maxLength={100}
        />
        <p className="text-xs text-stone-500 mt-1">{priceRange.length} / 100 karakter</p>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Latitude (Opsional)
          </label>
          <Input
            type="number"
            placeholder="Contoh: -6.1753"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            disabled={loading}
            step="0.0001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Longitude (Opsional)
          </label>
          <Input
            type="number"
            placeholder="Contoh: 106.8271"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            disabled={loading}
            step="0.0001"
          />
        </div>
      </div>

      {/* Google Maps Embed Code */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Google Maps Embed Code (Opsional)
        </label>
        <Textarea
          placeholder={`Paste iframe dari Google Maps embed. Contoh:\n<iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="400" style="border:0;" allowFullScreen="" loading="lazy"></iframe>`}
          value={mapsEmbedCode}
          onChange={(e) => setMapsEmbedCode(e.target.value)}
          disabled={loading}
          rows={4}
        />
        <p className="text-xs text-stone-500 mt-1">
          Cara: Buka Google Maps → Pilih lokasi → Klik &quot;Share&quot; → &quot;Embed a map&quot; → Copy kode iframe
        </p>
        
        {/* Map Preview */}
        {mapsEmbedCode.trim() && (
          <div className="mt-4 border-t border-stone-200 pt-4">
            <p className="text-sm font-medium text-stone-700 mb-3">Preview Peta:</p>
            <MapEmbedDisplay embedCode={mapsEmbedCode} />
          </div>
        )}
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          disabled={loading}
          className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="featured" className="text-sm font-medium text-stone-700">
          Featured (Tampilkan di halaman utama)
        </label>
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          disabled={loading}
          className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-stone-700">
          Publikasikan sekarang
        </label>
        <p className="text-xs text-stone-500">(Biarkan unchecked untuk menyimpan sebagai draft)</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={loading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={loading}
        >
          {loading ? (mode === 'create' ? 'Membuat...' : 'Menyimpan...') : (published ? 'Publikasikan' : 'Simpan sebagai Draft')}
        </Button>
      </div>
    </form>
  );
}
