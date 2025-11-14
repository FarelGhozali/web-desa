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

interface Attraction {
  id: string;
  name: string;
  slug: string;
  location: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'REGULAR'>(
    'ALL',
  );

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/attractions');
      const data = await response.json();

      if (response.ok) {
        setAttractions(data);
      }
    } catch (error) {
      console.error('Error fetching attractions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttractions();
  }, []);

  const filteredAttractions = useMemo(() => {
    return attractions.filter((attraction) => {
      const matchesSearch = attraction.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'PUBLISHED'
          ? attraction.published
          : !attraction.published;
      const matchesFeatured =
        featuredFilter === 'ALL'
          ? true
          : featuredFilter === 'FEATURED'
          ? attraction.featured
          : !attraction.featured;

      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [attractions, search, statusFilter, featuredFilter]);

  const stats = useMemo(() => {
    const published = attractions.filter((item) => item.published).length;
    const featured = attractions.filter((item) => item.featured).length;
    return {
      total: attractions.length,
      published,
      draft: attractions.length - published,
      featured,
    };
  }, [attractions]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus attraction ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/attractions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAttractions();
      } else {
        alert('Gagal menghapus attraction');
      }
    } catch (error) {
      console.error('Error deleting attraction:', error);
      alert('Terjadi kesalahan');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/attractions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        fetchAttractions();
      }
    } catch (error) {
      console.error('Error updating attraction:', error);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
          title="Destinasi Wisata"
          description="Kurasi destinasi unggulan untuk memikat wisatawan yang ingin menikmati pengalaman lokal autentik."
          actions={
            <Link href="/admin/attractions/new">
              <Button variant="primary">+ Tambah Wisata</Button>
            </Link>
          }
          stats={[
            { label: 'Total Wisata', value: loading ? '…' : stats.total },
            { label: 'Published', value: loading ? '…' : stats.published },
            { label: 'Draft', value: loading ? '…' : stats.draft },
            { label: 'Featured', value: loading ? '…' : stats.featured },
          ]}
        />

        <AdminToolbar>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari destinasi berdasarkan nama"
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
              <p className="text-sm text-stone-500">Memuat daftar wisata…</p>
            </div>
          ) : filteredAttractions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
              <p className="text-base font-semibold text-stone-700">
                Tidak ada destinasi sesuai kriteria.
              </p>
              <p className="text-sm text-stone-500">
                Ubah filter atau tambahkan destinasi baru.
              </p>
              <Link href="/admin/attractions/new">
                <Button variant="primary">Tambah Wisata</Button>
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttractions.map((attraction) => (
                    <TableRow key={attraction.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-stone-900">
                            {attraction.name}
                          </p>
                          <p className="text-xs text-stone-500">/{attraction.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>{attraction.location}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => togglePublished(attraction.id, attraction.published)}
                          className="cursor-pointer"
                        >
                          {attraction.published ? (
                            <Badge variant="success">Published</Badge>
                          ) : (
                            <Badge variant="default">Draft</Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        {attraction.featured ? (
                          <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                            ⭐ Featured
                          </span>
                        ) : (
                          <span className="text-sm text-stone-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(attraction.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/attractions/${attraction.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              Pratinjau
                            </Button>
                          </Link>
                          <Link href={`/admin/attractions/${attraction.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(attraction.id)}
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
