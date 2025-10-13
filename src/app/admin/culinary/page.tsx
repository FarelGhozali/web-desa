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

interface Culinary {
  id: string;
  name: string;
  slug: string;
  location: string;
  priceRange: string | null;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export default function CulinaryPage() {
  const [culinary, setCulinary] = useState<Culinary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCulinary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/culinary');
      const data = await response.json();

      if (response.ok) {
        setCulinary(data);
      }
    } catch (error) {
      console.error('Error fetching culinary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCulinary();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kuliner ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/culinary/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCulinary();
      } else {
        alert('Gagal menghapus kuliner');
      }
    } catch (error) {
      console.error('Error deleting culinary:', error);
      alert('Terjadi kesalahan');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/culinary/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        fetchCulinary();
      }
    } catch (error) {
      console.error('Error updating culinary:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manajemen Kuliner</h1>
            <p className="text-stone-600 mt-1">Kelola kuliner lokal</p>
          </div>
          <Link href="/admin/culinary/new">
            <Button>+ Tambah Kuliner</Button>
          </Link>
        </div>

        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Memuat data...</p>
            </div>
          ) : culinary.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Belum ada kuliner</p>
              <Link href="/admin/culinary/new">
                <Button className="mt-4">Tambah Kuliner Pertama</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {culinary.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-stone-500">{item.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      {item.priceRange || <span className="text-stone-400">-</span>}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => togglePublished(item.id, item.published)}
                        className="cursor-pointer"
                      >
                        {item.published ? (
                          <Badge variant="success">Published</Badge>
                        ) : (
                          <Badge variant="default">Draft</Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      {item.featured ? (
                        <span className="text-amber-600">⭐ Featured</span>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/culinary/${item.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            👁️
                          </Button>
                        </Link>
                        <Link href={`/admin/culinary/${item.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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
