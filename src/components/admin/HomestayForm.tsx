'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileInput from '@/components/ui/FileInput';
import { Card } from '@/components/ui/Card';
import { generateSlug, formatPrice } from '@/lib/utils';

interface HomestayFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    address: string;
    pricePerNight: number;
    maxGuests: number;
    photos: string[];
    amenities: string[];
    latitude?: number;
    longitude?: number;
    featured: boolean;
    published: boolean;
  };
  isLoading?: boolean;
}

export default function HomestayForm({ initialData, isLoading: externalLoading }: HomestayFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(externalLoading || false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [pricePerNight, setPricePerNight] = useState(initialData?.pricePerNight.toString() || '');
  const [maxGuests, setMaxGuests] = useState(initialData?.maxGuests.toString() || '');
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
  const [newAmenity, setNewAmenity] = useState('');
  const [latitude, setLatitude] = useState(initialData?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(initialData?.longitude?.toString() || '');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [published, setPublished] = useState(initialData?.published || false);

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug when name changes
  const handleNameChange = (value: string) => {
    setName(value);
    if (!initialData) {
      // Only auto-generate slug if it's a new homestay
      setSlug(generateSlug(value));
    }
  };

  // Add amenity
  const handleAddAmenity = () => {
    const trimmed = newAmenity.trim();
    if (!trimmed) {
      setErrors({ ...errors, amenity: 'Amenitas tidak boleh kosong' });
      return;
    }

    if (amenities.includes(trimmed)) {
      setErrors({ ...errors, amenity: 'Amenitas sudah ditambahkan' });
      return;
    }

    setAmenities([...amenities, trimmed]);
    setNewAmenity('');
    setErrors({ ...errors, amenity: '' });
  };

  // Remove amenity
  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nama homestay wajib diisi';
    if (name.length < 3) newErrors.name = 'Nama minimal 3 karakter';
    if (name.length > 100) newErrors.name = 'Nama maksimal 100 karakter';

    if (!slug.trim()) newErrors.slug = 'Slug wajib diisi';
    if (!/^[a-z0-9-]+$/.test(slug)) newErrors.slug = 'Slug hanya boleh huruf kecil, angka, dan dash';

    if (!description.trim()) newErrors.description = 'Deskripsi wajib diisi';
    if (description.length < 10) newErrors.description = 'Deskripsi minimal 10 karakter';

    if (!address.trim()) newErrors.address = 'Alamat wajib diisi';

    if (!pricePerNight || Number(pricePerNight) <= 0) {
      newErrors.pricePerNight = 'Harga harus lebih dari 0';
    }

    if (!maxGuests || Number(maxGuests) < 1) {
      newErrors.maxGuests = 'Kuota tamu minimal 1 orang';
    }

    if (photos.length === 0) newErrors.photos = 'Minimal 1 foto harus diunggah';

    if (amenities.length === 0) newErrors.amenities = 'Minimal 1 amenitas harus ditambahkan';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const payload = {
        name,
        slug,
        description,
        address,
        pricePerNight: Number(pricePerNight),
        maxGuests: Number(maxGuests),
        photos,
        amenities,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        featured,
        published,
      };

      const url = initialData
        ? `/api/admin/homestays/${initialData.id}`
        : '/api/homestays';
      const method = initialData ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Gagal menyimpan homestay');
        return;
      }

      setSuccess(
        initialData
          ? 'Homestay berhasil diupdate'
          : 'Homestay berhasil dibuat'
      );

      // Redirect after success
      setTimeout(() => {
        router.push('/admin/homestays');
      }, 1000);
    } catch (err) {
      console.error('Error:', err);
      setError('Terjadi kesalahan saat menyimpan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Card className="border-rose-200 bg-rose-50 p-4">
          <p className="text-sm text-rose-700">{error}</p>
        </Card>
      )}

      {success && (
        <Card className="border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">{success}</p>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">Informasi Dasar</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Nama Homestay *
            </label>
            <Input
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChange(e.target.value)}
              placeholder="Contoh: Traditional Village House"
              error={errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Slug (URL-friendly) *
            </label>
            <Input
              value={slug}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
              placeholder="traditional-village-house"
              error={errors.slug}
            />
            <p className="mt-1 text-xs text-stone-500">
              Preview: /homestays/{slug || 'slug-homestay'}
            </p>
            {errors.slug && <p className="mt-1 text-xs text-rose-600">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Deskripsi *
            </label>
            <Textarea
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Jelaskan fitur dan kelebihan homestay..."
              rows={5}
              error={errors.description}
            />
            <p className="mt-1 text-xs text-stone-500">
              {description.length}/5000 karakter
            </p>
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Alamat *
            </label>
            <Input
              value={address}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
              placeholder="Jl. Main Street, Village Center"
              error={errors.address}
            />
            {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
          </div>
        </div>
      </Card>

      {/* Pricing & Capacity */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">Harga & Kapasitas</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Harga per Malam (IDR) *
            </label>
            <Input
              type="number"
              value={pricePerNight}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPricePerNight(e.target.value)
              }
              placeholder="250000"
              error={errors.pricePerNight}
            />
            {pricePerNight && (
              <p className="mt-1 text-xs text-stone-500">
                {formatPrice(Number(pricePerNight))} / malam
              </p>
            )}
            {errors.pricePerNight && (
              <p className="mt-1 text-xs text-rose-600">{errors.pricePerNight}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Kuota Tamu *
            </label>
            <Input
              type="number"
              value={maxGuests}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxGuests(e.target.value)}
              placeholder="4"
              error={errors.maxGuests}
            />
            {errors.maxGuests && (
              <p className="mt-1 text-xs text-rose-600">{errors.maxGuests}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Photos */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">Foto Homestay</h2>
        <FileInput
          value={photos}
          onChange={setPhotos}
          error={errors.photos}
          maxFiles={10}
          label="Unggah Foto Homestay"
          hint="Seret dan lepas foto atau klik untuk memilih (maks 10 foto)"
        />
      </Card>

      {/* Amenities */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">Amenitas</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newAmenity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setNewAmenity(e.target.value);
                setErrors({ ...errors, amenity: '' });
              }}
              placeholder="Contoh: WiFi, Kitchen, AC"
              error={errors.amenity}
            />
            <Button
              type="button"
              onClick={handleAddAmenity}
              variant="outline"
            >
              Tambah
            </Button>
          </div>
          {errors.amenity && (
            <p className="text-xs text-rose-600">{errors.amenity}</p>
          )}

          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.amenities && (
            <p className="text-xs text-rose-600">{errors.amenities}</p>
          )}
        </div>
      </Card>

      {/* Location (Optional) */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">Lokasi (Opsional)</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Latitude
            </label>
            <Input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLatitude(e.target.value)
              }
              placeholder="-6.8726"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Longitude
            </label>
            <Input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLongitude(e.target.value)
              }
              placeholder="107.1886"
            />
          </div>
        </div>
      </Card>

      {/* Status */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">Status</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPublished(e.target.checked)
              }
              className="h-4 w-4 rounded border-stone-300 text-emerald-600"
            />
            <span className="text-sm text-stone-700">
              Publikasikan homestay (tampilkan di website)
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFeatured(e.target.checked)
              }
              className="h-4 w-4 rounded border-stone-300 text-emerald-600"
            />
            <span className="text-sm text-stone-700">
              Jadikan homestay unggulan (featured)
            </span>
          </label>
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Menyimpan...' : initialData ? 'Update Homestay' : 'Buat Homestay'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
