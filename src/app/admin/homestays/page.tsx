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
import { formatPrice } from '@/lib/utils';

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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>(
    'all',
  );

  const fetchHomestays = async () => {
    try {
      setLoading(true);
      // Fetch all homestays from admin endpoint
      const response = await fetch('/api/admin/homestays');
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

  const filteredHomestays = useMemo(() => {
    return homestays.filter((homestay) => {
      const matchesSearch = homestay.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'published'
          ? homestay.published
          : !homestay.published;

      return matchesSearch && matchesStatus;
    });
  }, [homestays, search, statusFilter]);

  const totalFeatured = useMemo(
    () => homestays.filter((homestay) => homestay.featured).length,
    [homestays],
  );

  const totalPublished = useMemo(
    () => homestays.filter((homestay) => homestay.published).length,
    [homestays],
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus homestay ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/homestays/${id}`, {
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
      const response = await fetch(`/api/admin/homestays/${id}`, {
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
        <AdminPageHeader
          title="Manajemen Homestay"
          description="Kelola daftar homestay, optimalkan visibilitas, dan pastikan stok kamar siap untuk dipesan."
          actions={
            <Link href="/admin/homestays/new">
              <Button variant="primary">+ Tambah Homestay</Button>
            </Link>
          }
          stats={[
            {
              label: 'Total Homestay',
              value: loading ? '…' : homestays.length,
            },
            {
              label: 'Published',
              value: loading ? '…' : totalPublished,
              helper: 'Siap ditampilkan',
            },
            {
              label: 'Draft',
              value: loading ? '…' : homestays.length - totalPublished,
            },
            {
              label: 'Featured',
              value: loading ? '…' : totalFeatured,
            },
          ]}
        />

        <AdminToolbar>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari homestay berdasarkan nama"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={statusFilter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                Semua
              </Button>
              <Button
                variant={statusFilter === 'published' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('published')}
              >
                Published
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('draft')}
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
              <p className="text-sm text-stone-500">Memuat data homestay…</p>
            </div>
          ) : filteredHomestays.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
              <p className="text-base font-semibold text-stone-700">
                Tidak ada homestay yang cocok.
              </p>
              <p className="text-sm text-stone-500">
                Coba ubah kata kunci pencarian atau filter status.
              </p>
              <Link href="/admin/homestays/new">
                <Button variant="primary">Tambah Homestay Baru</Button>
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Harga / Malam</TableHead>
                    <TableHead>Kuota Tamu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHomestays.map((homestay) => (
                    <TableRow key={homestay.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-stone-900">
                            {homestay.name}
                          </p>
                          <p className="text-xs text-stone-500">/{homestay.slug}</p>
                          {homestay._count && (
                            <p className="text-xs text-stone-400">
                              {homestay._count.bookings} booking · {homestay._count.reviews} review
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-stone-900">
                          {formatPrice(homestay.pricePerNight)}
                        </span>
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
                          <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                            ⭐ Featured
                          </span>
                        ) : (
                          <span className="text-sm text-stone-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/homestays/${homestay.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              Pratinjau
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
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
