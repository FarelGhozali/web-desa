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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'REGULAR'>(
    'ALL',
  );

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

  const filteredCulinary = useMemo(() => {
    return culinary.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'PUBLISHED'
          ? item.published
          : !item.published;
      const matchesFeatured =
        featuredFilter === 'ALL'
          ? true
          : featuredFilter === 'FEATURED'
          ? item.featured
          : !item.featured;

      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [culinary, search, statusFilter, featuredFilter]);

  const stats = useMemo(() => {
    const published = culinary.filter((item) => item.published).length;
    const featured = culinary.filter((item) => item.featured).length;
    return {
      total: culinary.length,
      published,
      draft: culinary.length - published,
      featured,
    };
  }, [culinary]);

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
    <div className="space-y-6">
      <AdminPageHeader
          title="Kuliner Lokal"
          description="Sorot kuliner khas yang memperkaya pengalaman tamu dan memperkuat positioning Desa Wisata."
          actions={
            <Link href="/admin/culinary/new">
              <Button variant="primary">+ Tambah Kuliner</Button>
            </Link>
          }
          stats={[
            { label: 'Total Kuliner', value: loading ? '…' : stats.total },
            { label: 'Published', value: loading ? '…' : stats.published },
            { label: 'Draft', value: loading ? '…' : stats.draft },
            { label: 'Featured', value: loading ? '…' : stats.featured },
          ]}
        />

        <AdminToolbar>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari kuliner berdasarkan nama"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={statusFilter === 'ALL' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('ALL')}
              >
                Semua Status
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
              <Button
                variant={featuredFilter === 'ALL' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFeaturedFilter('ALL')}
              >
                Semua
              </Button>
              <Button
                variant={featuredFilter === 'FEATURED' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFeaturedFilter('FEATURED')}
              >
                Featured
              </Button>
              <Button
                variant={featuredFilter === 'REGULAR' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFeaturedFilter('REGULAR')}
              >
                Non-featured
              </Button>
            </div>
          </div>
        </AdminToolbar>

        <Card className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-sm text-stone-500">Memuat katalog kuliner…</p>
            </div>
          ) : filteredCulinary.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
              <p className="text-base font-semibold text-stone-700">
                Tidak ada kuliner sesuai pencarian.
              </p>
              <p className="text-sm text-stone-500">
                Ubah filter atau tambahkan rekomendasi baru.
              </p>
              <Link href="/admin/culinary/new">
                <Button variant="primary">Tambah Kuliner</Button>
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Rentang Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCulinary.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-stone-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-stone-500">/{item.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        {item.priceRange ? (
                          <span className="text-sm font-medium text-stone-900">
                            {item.priceRange}
                          </span>
                        ) : (
                          <span className="text-sm text-stone-400">-</span>
                        )}
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
                          <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                            ⭐ Featured
                          </span>
                        ) : (
                          <span className="text-sm text-stone-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/culinary/${item.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              Pratinjau
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
            </div>
          )}
        </Card>
    </div>
  );
}
