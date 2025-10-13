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

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
  homestay: {
    name: string;
    slug: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reviews');
      const data = await response.json();

      if (response.ok) {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus review ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchReviews();
      } else {
        alert('Gagal menghapus review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Terjadi kesalahan');
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manajemen Reviews</h1>
            <p className="text-stone-600 mt-1">Moderasi review dari tamu</p>
          </div>
        </div>

        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Memuat data...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Belum ada review</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Homestay</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Komentar</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="font-medium">{review.homestay.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {review.user.name || 'No Name'}
                        </div>
                        <div className="text-stone-500">{review.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{renderStars(review.rating)}</span>
                        <span className="text-sm text-stone-600">
                          ({review.rating}/5)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm line-clamp-2">{review.comment}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                      >
                        Hapus
                      </Button>
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
