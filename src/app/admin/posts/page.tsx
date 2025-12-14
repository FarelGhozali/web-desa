'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

type TabType = 'posts' | 'categories';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState({ name: '', slug: '' });
  const [categorySearch, setCategorySearch] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts');
      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPosts(), fetchCategories()]).finally(() => {
      setLoading(false);
    });
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

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categories, categorySearch]);

  const stats = useMemo(() => {
    const published = posts.filter((post) => post.published).length;
    return {
      total: posts.length,
      published,
      draft: posts.length - published,
    };
  }, [posts]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        setNewCategory({ name: '', slug: '' });
        setIsAddingCategory(false);
        await fetchCategories();
      } else {
        alert('Gagal menambah kategori');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategoryId) return;

    try {
      const response = await fetch(`/api/admin/categories/${editingCategoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCategory),
      });

      if (response.ok) {
        setEditingCategoryId(null);
        setEditCategory({ name: '', slug: '' });
        await fetchCategories();
      } else {
        alert('Gagal mengubah kategori');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menghapus kategori');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Terjadi kesalahan');
    }
  }

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

        {/* Tabs Navigation */}
        <div className="flex gap-2 border-b border-stone-200">
          <button
            onClick={() => {
              setActiveTab('posts');
              setSearch('');
              setStatusFilter('ALL');
            }}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'posts'
                ? 'border-b-2 border-emerald-500 text-emerald-600'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📝 Daftar Artikel
          </button>
          <button
            onClick={() => {
              setActiveTab('categories');
              setCategorySearch('');
            }}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'categories'
                ? 'border-b-2 border-emerald-500 text-emerald-600'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🏷️ Kelola Kategori ({categories.length})
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <>
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
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <>
            <AdminToolbar>
              <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Cari kategori"
                    value={categorySearch}
                    onChange={(event) => setCategorySearch(event.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCategories()}
                >
                  Segarkan Data
                </Button>
              </div>
            </AdminToolbar>

            {isAddingCategory && (
              <Card className="border-dashed border-emerald-400 bg-emerald-50/40 p-6">
                <h3 className="mb-4 text-lg font-semibold text-stone-900">
                  Tambah Kategori Baru
                </h3>
                <form onSubmit={handleAddCategory} className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Nama Kategori"
                    value={newCategory.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setNewCategory({
                        name,
                        slug: generateSlug(name),
                      });
                    }}
                    required
                  />
                  <Input
                    label="Slug"
                    value={newCategory.slug}
                    onChange={(event) =>
                      setNewCategory({ ...newCategory, slug: event.target.value })
                    }
                    required
                  />
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Button type="submit">Simpan</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategory({ name: '', slug: '' });
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <Card className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                  <p className="text-sm text-stone-500">Memuat kategori…</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
                  <p className="text-base font-semibold text-stone-700">
                    {categorySearch ? 'Tidak ada kategori sesuai pencarian.' : 'Belum ada kategori.'}
                  </p>
                  <p className="text-sm text-stone-500">
                    {categorySearch ? 'Coba kata kunci lain atau tambah kategori baru.' : 'Mulai dengan menambahkan kategori pertama.'}
                  </p>
                  {!isAddingCategory && (
                    <Button
                      variant="primary"
                      onClick={() => setIsAddingCategory(true)}
                    >
                      + Tambah Kategori
                    </Button>
                  )}
                </div>
              ) : (
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-stone-900">
                      {filteredCategories.length} Kategori
                    </h3>
                    {!isAddingCategory && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsAddingCategory(true)}
                      >
                        + Tambah Kategori
                      </Button>
                    )}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Jumlah Artikel</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          {editingCategoryId === category.id ? (
                            <>
                              <TableCell>
                                <Input
                                  value={editCategory.name}
                                  onChange={(event) => {
                                    const name = event.target.value;
                                    setEditCategory({
                                      name,
                                      slug: generateSlug(name),
                                    });
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={editCategory.slug}
                                  onChange={(event) =>
                                    setEditCategory({
                                      ...editCategory,
                                      slug: event.target.value,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell>{category._count.posts}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" onClick={handleEditCategory}>
                                    Simpan
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingCategoryId(null);
                                      setEditCategory({ name: '', slug: '' });
                                    }}
                                  >
                                    Batal
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>
                                <p className="text-sm font-semibold text-stone-900">
                                  {category.name}
                                </p>
                              </TableCell>
                              <TableCell>
                                <code className="rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-600">
                                  {category.slug}
                                </code>
                              </TableCell>
                              <TableCell>{category._count.posts}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingCategoryId(category.id);
                                      setEditCategory({
                                        name: category.name,
                                        slug: category.slug,
                                      });
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteCategory(category.id)}
                                    disabled={category._count.posts > 0}
                                  >
                                    Hapus
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </>
        )}
    </div>
  );
}
