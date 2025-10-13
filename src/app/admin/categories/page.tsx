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

  useEffect(() => {
    fetchCategories();
  }, []);

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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manajemen Kategori</h1>
            <p className="text-stone-600 mt-1">Kelola kategori blog</p>
          </div>
          <Button onClick={() => setIsAdding(true)}>+ Tambah Kategori</Button>
        </div>

        {isAdding && (
          <Card className="p-6">
            <h3 className="font-bold font-heading text-lg mb-4">Tambah Kategori Baru</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                label="Nama Kategori"
                value={newCategory.name}
                onChange={(e) => {
                  const name = e.target.value;
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
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                required
              />
              <div className="flex gap-2">
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

        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Memuat data...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Belum ada kategori</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Jumlah Post</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    {editingId === category.id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editCategory.name}
                            onChange={(e) => {
                              const name = e.target.value;
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
                            onChange={(e) =>
                              setEditCategory({
                                ...editCategory,
                                slug: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell>{category._count.posts}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleEdit}
                            >
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
                          <div className="font-medium">{category.name}</div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-stone-100 px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell>{category._count.posts}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
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
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
