'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import MapEmbedDisplay from '@/components/MapEmbedDisplay';

interface ContactFormData {
  email: string;
  phone: string;
  address: string;
  mapsEmbedCode?: string;
}

interface ContactFormProps {
  initialData?: ContactFormData;
  isLoading?: boolean;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export default function ContactForm({ 
  initialData, 
  isLoading: externalLoading,
  onSubmit 
}: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(externalLoading || false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [mapsEmbedCode, setMapsEmbedCode] = useState(initialData?.mapsEmbedCode || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!phone.trim()) newErrors.phone = 'Telepon wajib diisi';
    if (!address.trim()) newErrors.address = 'Alamat wajib diisi';

    // Validate embed code if provided
    if (mapsEmbedCode.trim()) {
      const hasIframe = mapsEmbedCode.includes('<iframe') && mapsEmbedCode.includes('src=');
      const hasEmbed = mapsEmbedCode.includes('<embed') && mapsEmbedCode.includes('src=');
      
      if (!hasIframe && !hasEmbed) {
        newErrors.mapsEmbedCode = 'Kode embed harus berisi tag iframe atau embed dengan atribut src';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const payload: ContactFormData = {
        email,
        phone,
        address,
        mapsEmbedCode: mapsEmbedCode || undefined,
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // Default API call
        const response = await fetch('/api/contact', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Gagal menyimpan informasi kontak');
        }
      }

      setSuccess('Informasi kontak berhasil disimpan');
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
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

      {/* Informasi Dasar */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">Informasi Kontak</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="hello@village.com"
              error={errors.email}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Telepon *
            </label>
            <Input
              value={phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              placeholder="+62 123 456 7890"
              error={errors.phone}
            />
            {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Alamat *
            </label>
            <Textarea
              value={address}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)}
              placeholder="Jl. Persawahan No. 12, Kabupaten Ciamis, Jawa Barat"
              rows={4}
              error={errors.address}
            />
            {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
          </div>
        </div>
      </Card>

      {/* Peta Google Maps */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-stone-900">Peta Google Maps (Opsional)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-900 mb-1">
              Kode Embed Google Maps
            </label>
            <Textarea
              value={mapsEmbedCode}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setMapsEmbedCode(e.target.value)
              }
              placeholder='Paste kode embed dari Google Maps di sini, contoh: <iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" ...></iframe>'
              rows={4}
              error={errors.mapsEmbedCode}
            />
            <p className="mt-2 text-xs text-stone-500">
              💡 Cara: Buka Google Maps, cari lokasi, klik tombol &quot;Share&quot;, pilih &quot;Embed a map&quot;, copy kode iframe lengkap dan paste di sini.
            </p>
            {errors.mapsEmbedCode && (
              <p className="mt-1 text-xs text-rose-600">{errors.mapsEmbedCode}</p>
            )}
          </div>

          {/* Preview Peta */}
          {mapsEmbedCode && (
            <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
              <p className="text-sm font-semibold text-emerald-900 mb-3">📍 Preview Peta:</p>
              <div className="w-full rounded border border-emerald-300 overflow-hidden bg-white">
                <MapEmbedDisplay embedCode={mapsEmbedCode} />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
