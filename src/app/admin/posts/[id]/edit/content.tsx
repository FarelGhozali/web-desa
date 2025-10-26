'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import CreatePostForm from '@/components/CreatePostForm';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  categoryId: string;
}

interface EditPostPageContentProps {
  postId: string;
}

export default function EditPostPageContent({ postId }: EditPostPageContentProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/posts/${postId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Artikel tidak ditemukan');
          } else if (response.status === 401) {
            router.push('/login');
            return;
          } else {
            setError('Gagal memuat artikel');
          }
          return;
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Terjadi kesalahan saat memuat artikel');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-stone-500">Memuat artikel...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Link href="/admin/posts" className="hover:text-emerald-600">
              Kelola Artikel
            </Link>
            <span>/</span>
            <span>Edit Artikel</span>
          </div>

          <div className="rounded-lg bg-red-50 p-8 text-center text-red-900">
            <p className="mb-4 text-lg font-semibold">{error}</p>
            <Link href="/admin/posts">
              <Button variant="outline">Kembali ke Daftar Artikel</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <Container>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-stone-600">
            <Link href="/admin/posts" className="hover:text-emerald-600">
              Kelola Artikel
            </Link>
            <span>/</span>
            <span>Edit Artikel</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900">Edit Artikel</h1>
          <p className="mt-1 text-stone-600">
            Perbarui konten artikel untuk memastikan informasi tetap relevan dan menarik.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-stone-200 bg-white p-8">
          <CreatePostForm
            mode="edit"
            postId={post.id}
            initialData={post}
          />
        </div>

        {/* Tips Section */}
        <div className="rounded-lg bg-blue-50 p-6 text-blue-900">
          <h3 className="mb-2 font-semibold">💡 Tips Mengedit Artikel</h3>
          <ul className="space-y-1 text-sm">
            <li>• Perbarui judul jika ingin meningkatkan SEO atau kejelasan konten</li>
            <li>• Edit konten untuk tetap akurat dan relevan dengan informasi terbaru</li>
            <li>• Ganti gambar cover jika diperlukan untuk visual yang lebih menarik</li>
            <li>• Ubah kategori jika artikel termasuk dalam kategori yang lebih sesuai</li>
            <li>• Publikasikan kembali jika artikel telah diperbarui dengan konten penting</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
