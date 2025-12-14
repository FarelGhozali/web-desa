'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Image from 'next/image';

interface EditProfileFormProps {
  initialName: string | null;
  initialImage: string | null;
  email: string;
}

export default function EditProfileForm({
  initialName,
  initialImage,
  email,
}: EditProfileFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(initialName || '');
  const [image, setImage] = useState(initialImage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal mengupdate profil');
      }

      const updatedData = await response.json();
      
      // Update session untuk trigger refetch di HeaderContent
      await update({
        name: updatedData.name,
        email: updatedData.email,
      });

      setSuccess(true);
      
      // Tunggu sebentar agar UI ter-update, baru redirect
      setTimeout(() => {
        router.push('/profile');
        // Bukan router.refresh(), tapi biarkan useSession hook handle refresh
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-3xl font-bold text-stone-900">Edit Profil</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
          ✓ Profil berhasil diperbarui! Mengalihkan...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Email (Tidak dapat diubah)
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-stone-500 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-stone-500">Email tidak dapat diubah untuk keamanan akun</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama Anda"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <p className="mt-1 text-xs text-stone-500">Nama akan ditampilkan di profil dan booking Anda</p>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            URL Foto Profil
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="mt-1 text-xs text-stone-500">
            Masukkan URL foto. Jika kosong, akan menggunakan initial dari nama Anda
          </p>

          {/* Preview */}
          {image && (
            <div className="mt-3 rounded-md bg-stone-50 p-4">
              <p className="mb-2 text-xs font-medium text-stone-700">Preview:</p>
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 overflow-hidden">
                <Image 
                  src={image} 
                  alt="Preview"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Jika foto tidak muncul di preview, URL mungkin tidak valid atau tidak dapat diakses
              </p>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="rounded-md bg-stone-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-stone-700">Informasi Akun</h3>
          <div className="space-y-1 text-xs text-stone-600">
            <p>Email: <span className="font-medium">{email}</span></p>
            <p>Nama Saat Ini: <span className="font-medium">{initialName || '-'}</span></p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 border-t border-stone-200 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500"
          >
            Batal
          </button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
}
