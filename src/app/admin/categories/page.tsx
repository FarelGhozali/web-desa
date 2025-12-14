'use client';

import { useState, useEffect, useMemo } from 'react';
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
import Input from '@/components/ui/Input';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState({ name: '', slug: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categories, search]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        setNewCategory({ name: '', slug: '' });
        setIsAdding(false);
        fetchCategories();
      } else {
        alert('Gagal menambah kategori');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;

    try {
      const response = await fetch(`/api/admin/categories/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCategory),
      });

      if (response.ok) {
        setEditingId(null);
        setEditCategory({ name: '', slug: '' });
        fetchCategories();
      } else {
        alert('Gagal mengubah kategori');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menghapus kategori');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Terjadi kesalahan');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
          title="Kategori Konten"
          description="Susun kategori artikel agar pembaca mudah menemukan topik yang relevan."
          actions={
            <Button onClick={() => setIsAdding(true)} variant="primary">
              + Tambah Kategori
            </Button>
          }
          stats={[
            { label: 'Total Kategori', value: loading ? '…' : categories.length },
            {
              label: 'Kategori Populer',
              value:
                loading || categories.length === 0
                  ? '…'
                  : categories.reduce((prev, current) =>
                      current._count.posts > prev._count.posts ? current : prev,
                    categories[0],
                  ).name,
            },
            {
              label: 'Kategori Tanpa Artikel',
              value: loading
                ? '…'
                : categories.filter((category) => category._count.posts === 0).length,
            },
          ]}
        />

        <AdminToolbar>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari kategori"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchCategories()}>
              Segarkan Data
            </Button>
          </div>
        </AdminToolbar>

        {isAdding && (
          <Card className="border-dashed border-emerald-400 bg-emerald-50/40 p-6">
            <h3 className="mb-4 text-lg font-semibold text-stone-900">
              Tambah Kategori Baru
            </h3>
            <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-2">
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
                    setIsAdding(false);
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
                Tidak ada kategori sesuai pencarian.
              </p>
              <p className="text-sm text-stone-500">
                Coba kata kunci lain atau tambah kategori baru.
              </p>
            </div>
          ) : (
            <div className="p-6">
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
                      {editingId === category.id ? (
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
                              <Button size="sm" onClick={handleEdit}>
                                Simpan
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingId(null);
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
                                  setEditingId(category.id);
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
                                onClick={() => handleDelete(category.id)}
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
    </div>
  );
}
