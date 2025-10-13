'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
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
import Link from 'next/link';

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manajemen Blog Posts</h1>
            <p className="text-stone-600 mt-1">Kelola artikel blog</p>
          </div>
          <Link href="/admin/posts/new">
            <Button>+ Tulis Artikel</Button>
          </Link>
        </div>

        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Memuat data...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Belum ada artikel</p>
              <Link href="/admin/posts/new">
                <Button className="mt-4">Tulis Artikel Pertama</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-xs text-stone-500">{post.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{post.category.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {post.author.name || post.author.email}
                      </div>
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
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            👁️
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
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
