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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manajemen Wisata</h1>
            <p className="text-stone-600 mt-1">Kelola tempat wisata</p>
          </div>
          <Link href="/admin/attractions/new">
            <Button>+ Tambah Wisata</Button>
          </Link>
        </div>

        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Memuat data...</p>
            </div>
          ) : attractions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Belum ada tempat wisata</p>
              <Link href="/admin/attractions/new">
                <Button className="mt-4">Tambah Wisata Pertama</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attractions.map((attraction) => (
                  <TableRow key={attraction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{attraction.name}</div>
                        <div className="text-xs text-stone-500">{attraction.slug}</div>
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
                        <span className="text-amber-600">⭐ Featured</span>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(attraction.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/attractions/${attraction.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            👁️
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
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
