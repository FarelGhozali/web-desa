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

interface Homestay {
  id: string;
  name: string;
  slug: string;
  pricePerNight: number;
  maxGuests: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
  _count?: {
    bookings: number;
    reviews: number;
  };
}

export default function HomestaysPage() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHomestays = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/homestays');
      const data = await response.json();

      if (response.ok) {
        setHomestays(data);
      }
    } catch (error) {
      console.error('Error fetching homestays:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomestays();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus homestay ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/homestays/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchHomestays();
      } else {
        alert('Gagal menghapus homestay');
      }
    } catch (error) {
      console.error('Error deleting homestay:', error);
      alert('Terjadi kesalahan');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/homestays/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        fetchHomestays();
      }
    } catch (error) {
      console.error('Error updating homestay:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manajemen Homestays</h1>
            <p className="text-stone-600 mt-1">Kelola daftar homestay</p>
          </div>
          <Link href="/admin/homestays/new">
            <Button>+ Tambah Homestay</Button>
          </Link>
        </div>

        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Memuat data...</p>
            </div>
          ) : homestays.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Belum ada homestay</p>
              <Link href="/admin/homestays/new">
                <Button className="mt-4">Tambah Homestay Pertama</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Harga/Malam</TableHead>
                  <TableHead>Max Tamu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homestays.map((homestay) => (
                  <TableRow key={homestay.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{homestay.name}</div>
                        <div className="text-xs text-stone-500">{homestay.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      Rp {homestay.pricePerNight.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>{homestay.maxGuests} orang</TableCell>
                    <TableCell>
                      <button
                        onClick={() => togglePublished(homestay.id, homestay.published)}
                        className="cursor-pointer"
                      >
                        {homestay.published ? (
                          <Badge variant="success">Published</Badge>
                        ) : (
                          <Badge variant="default">Draft</Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      {homestay.featured ? (
                        <span className="text-amber-600">⭐ Featured</span>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/homestays/${homestay.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            👁️
                          </Button>
                        </Link>
                        <Link href={`/admin/homestays/${homestay.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(homestay.id)}
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
