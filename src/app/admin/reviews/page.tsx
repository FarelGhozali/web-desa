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
import { formatDate } from '@/lib/utils';

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
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

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

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch =
        review.homestay.name.toLowerCase().includes(search.toLowerCase()) ||
        (review.user.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        review.user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRating = ratingFilter ? review.rating === ratingFilter : true;
      return matchesSearch && matchesRating;
    });
  }, [reviews, search, ratingFilter]);

  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return { total: 0, average: 0, withComment: 0 };
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const withComment = reviews.filter((review) => review.comment.trim().length > 0).length;
    return {
      total: reviews.length,
      average: totalRating / reviews.length,
      withComment,
    };
  }, [reviews]);

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
    <div className="space-y-6">
      <AdminPageHeader
          title="Review Pengunjung"
          description="Pantau kualitas pengalaman tamu dan respon cepat untuk menjaga reputasi homestay."
          stats={[
            { label: 'Total Review', value: loading ? '…' : stats.total },
            {
              label: 'Rating Rata-rata',
              value: loading
                ? '…'
                : stats.total > 0
                ? stats.average.toFixed(1)
                : '0.0',
            },
            {
              label: 'Review dengan Komentar',
              value: loading ? '…' : stats.withComment,
            },
          ]}
        />

        <AdminToolbar>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari review berdasarkan tamu atau homestay"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={ratingFilter === null ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setRatingFilter(null)}
              >
                Semua Rating
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={ratingFilter === rating ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setRatingFilter(rating)}
                >
                  {rating}⭐
                </Button>
              ))}
            </div>
          </div>
        </AdminToolbar>

        <Card className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-sm text-stone-500">Memuat review terbaru…</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
              <p className="text-base font-semibold text-stone-700">
                Belum ada review sesuai filter.
              </p>
              <p className="text-sm text-stone-500">
                Ubah kata kunci atau rating yang dipilih.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Homestay</TableHead>
                    <TableHead>Tamu</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Komentar</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <p className="text-sm font-semibold text-stone-900">
                          {review.homestay.name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold text-stone-900">
                            {review.user.name || 'Tanpa Nama'}
                          </p>
                          <p className="text-xs text-stone-500">{review.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{renderStars(review.rating)}</span>
                          <span className="text-xs text-stone-500">{review.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-lg text-sm text-stone-700">
                          {review.comment || 'Tidak ada komentar'}
                        </p>
                      </TableCell>
                      <TableCell>{formatDate(review.createdAt)}</TableCell>
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
            </div>
          )}
        </Card>
    </div>
  );
}
