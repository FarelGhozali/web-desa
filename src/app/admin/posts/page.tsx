'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminToolbar from '@/components/admin/AdminToolbar';
import { Card } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  author: {
    name: string | null;
    email: string;
  };
  category: {
    name: string;
  };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/posts');
      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'PUBLISHED'
          ? post.published
          : !post.published;
      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  const stats = useMemo(() => {
    const published = posts.filter((post) => post.published).length;
    return {
      total: posts.length,
      published,
      draft: posts.length - published,
    };
  }, [posts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus post ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert('Gagal menghapus post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Terjadi kesalahan');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Konten Blog & Storytelling"
          description="Terbitkan cerita inspiratif, panduan wisata, dan konten SEO untuk menarik calon tamu."
          actions={
            <Link href="/admin/posts/new">
              <Button variant="primary">+ Tulis Artikel</Button>
            </Link>
          }
          stats={[
            { label: 'Total Artikel', value: loading ? '…' : stats.total },
            { label: 'Published', value: loading ? '…' : stats.published },
            { label: 'Draft', value: loading ? '…' : stats.draft },
            { label: 'Kategori Aktif', value: loading ? '…' : new Set(posts.map((post) => post.category.name)).size },
          ]}
        />

        <AdminToolbar>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari artikel berdasarkan judul"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={statusFilter === 'ALL' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('ALL')}
              >
                Semua
              </Button>
              <Button
                variant={statusFilter === 'PUBLISHED' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('PUBLISHED')}
              >
                Published
              </Button>
              <Button
                variant={statusFilter === 'DRAFT' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('DRAFT')}
              >
                Draft
              </Button>
            </div>
          </div>
        </AdminToolbar>

        <Card className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-sm text-stone-500">Memuat daftar artikel…</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
              <p className="text-base font-semibold text-stone-700">
                Belum ada artikel sesuai pencarian.
              </p>
              <p className="text-sm text-stone-500">
                Coba ubah filter atau tulis artikel baru.
              </p>
              <Link href="/admin/posts/new">
                <Button variant="primary">Tulis Artikel Pertama</Button>
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Penulis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-stone-900">
                            {post.title}
                          </p>
                          <p className="text-xs text-stone-500">/{post.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{post.category.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-stone-700">
                          {post.author.name || post.author.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => togglePublished(post.id, post.published)}
                          className="cursor-pointer"
                        >
                          {post.published ? (
                            <Badge variant="success">Published</Badge>
                          ) : (
                            <Badge variant="default">Draft</Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              Pratinjau
                            </Button>
                          </Link>
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
