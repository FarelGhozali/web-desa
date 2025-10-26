'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import RichTextEditor from '@/components/ui/RichTextEditor';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  categoryId: string;
}

interface CreatePostFormProps {
  mode?: 'create' | 'edit';
  postId?: string;
  initialData?: Partial<Post>;
}

export default function CreatePostForm({ mode = 'create', postId, initialData }: CreatePostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [published, setPublished] = useState(initialData?.published || false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          // Auto-select first category if available and not already set
          if (data.length > 0 && !initialData?.categoryId) {
            setCategoryId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [initialData?.categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!title.trim()) {
      setError('Judul artikel tidak boleh kosong');
      return;
    }

    if (title.trim().length < 5) {
      setError('Judul minimal 5 karakter');
      return;
    }

    if (!content.trim()) {
      setError('Isi artikel tidak boleh kosong');
      return;
    }

    if (content.trim().length < 20) {
      setError('Isi artikel minimal 20 karakter');
      return;
    }

    if (!categoryId) {
      setError('Pilih kategori artikel');
      return;
    }

    setLoading(true);

    try {
      const url = mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${postId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          coverImage: coverImage.trim() || null,
          categoryId,
          published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Gagal ${mode === 'create' ? 'membuat' : 'memperbarui'} artikel`);
      }

      setSuccess(true);

      // Redirect to posts page after 2 seconds
      setTimeout(() => {
        router.push('/admin/posts');
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
          ✓ Artikel berhasil {mode === 'create' ? 'dibuat' : 'diperbarui'}!
        </p>
        <p className="text-sm">Anda akan diarahkan kembali ke daftar artikel...</p>
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

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Judul Artikel *
        </label>
        <Input
          type="text"
          placeholder="Masukkan judul artikel menarik..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          maxLength={200}
        />
        <p className="text-xs text-stone-500 mt-1">{title.length} / 200 karakter</p>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Ringkasan (Opsional)
        </label>
        <Textarea
          placeholder="Ringkasan singkat artikel untuk SEO dan preview..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          disabled={loading}
          rows={3}
        />
        <p className="text-xs text-stone-500 mt-1">{excerpt.length} / 500 karakter</p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Isi Artikel *
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Tulis konten artikel Anda di sini..."
        />
        <p className="text-xs text-stone-500 mt-1">{content.length} / 50000 karakter</p>
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          URL Gambar Cover (Opsional)
        </label>
        <Input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          disabled={loading}
        />
        {coverImage && (
          <div className="mt-3 rounded-lg border border-stone-200 p-2">
            <p className="text-xs font-medium text-stone-700 mb-2">Preview Gambar:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="Cover preview"
              className="max-h-48 w-auto rounded"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Kategori *
        </label>
        {categoriesLoading ? (
          <div className="text-sm text-stone-500">Memuat kategori...</div>
        ) : categories.length === 0 ? (
          <div className="text-sm text-red-600">Tidak ada kategori tersedia. Hubungi admin untuk membuat kategori.</div>
        ) : (
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={loading || categoriesLoading}
            className="block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-stone-100"
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
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
          disabled={loading || categoriesLoading || categories.length === 0}
        >
          {loading ? (mode === 'create' ? 'Membuat...' : 'Menyimpan...') : (published ? 'Publikasikan' : 'Simpan sebagai Draft')}
        </Button>
      </div>
    </form>
  );
}
