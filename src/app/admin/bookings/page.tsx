'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Select } from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  numberOfGuests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  guestPhone?: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  homestay: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/bookings?${params}`);
      const data = await response.json();

      if (response.ok) {
        setBookings(data.bookings);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const handleStatusChange = async (
    bookingId: string,
    newStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  ) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBookings();
      } else {
        alert('Gagal mengubah status booking');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Terjadi kesalahan');
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (!search) return true;
      const keyword = search.toLowerCase();
      return (
        booking.homestay.name.toLowerCase().includes(keyword) ||
        (booking.user.name?.toLowerCase().includes(keyword) ?? false) ||
        booking.user.email.toLowerCase().includes(keyword) ||
        (booking.guestPhone ?? '').toLowerCase().includes(keyword)
      );
    });
  }, [bookings, search]);

  const statusSummary = useMemo(() => {
    return bookings.reduce(
      (acc, booking) => {
        acc[booking.status] += 1;
        return acc;
      },
      {
        PENDING: 0,
        CONFIRMED: 0,
        CANCELLED: 0,
        COMPLETED: 0,
      } as Record<Booking['status'], number>,
    );
  }, [bookings]);

  const getStatusBadge = (status: Booking['status']) => {
    const variants: Record<Booking['status'], 'default' | 'success' | 'warning' | 'danger'> = {
      PENDING: 'warning',
      CONFIRMED: 'success',
      CANCELLED: 'danger',
      COMPLETED: 'default',
    };

    const labels: Record<Booking['status'], string> = {
      PENDING: 'Menunggu',
      CONFIRMED: 'Dikonfirmasi',
      CANCELLED: 'Dibatalkan',
      COMPLETED: 'Selesai',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Manajemen Booking"
          description="Pantau reservasi homestay, pastikan status terupdate, dan tanggapi kebutuhan tamu tepat waktu."
          stats={[
            { label: 'Total Booking', value: loading ? '…' : bookings.length },
            { label: 'Pending', value: loading ? '…' : statusSummary.PENDING },
            { label: 'Dikonfirmasi', value: loading ? '…' : statusSummary.CONFIRMED },
            { label: 'Selesai', value: loading ? '…' : statusSummary.COMPLETED },
          ]}
        />

        <AdminToolbar>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari booking berdasarkan tamu atau homestay"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="min-w-[160px] text-sm"
              >
                <option value="">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </Select>
              <Button variant="outline" size="sm" onClick={() => fetchBookings()}>
                Segarkan Data
              </Button>
            </div>
          </div>
        </AdminToolbar>

        <Card className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-sm text-stone-500">Memuat data booking…</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
              <p className="text-base font-semibold text-stone-700">
                Tidak ada booking ditemukan.
              </p>
              <p className="text-sm text-stone-500">
                Coba ubah filter status atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Homestay</TableHead>
                    <TableHead>Tamu</TableHead>
                    <TableHead>Durasi Menginap</TableHead>
                    <TableHead>Tamu</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Perbarui Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="align-top">
                        <Link
                          href={`/homestays/${booking.homestay.slug}`}
                          target="_blank"
                          className="font-semibold text-emerald-600 hover:underline"
                        >
                          {booking.homestay.name}
                        </Link>
                        <p className="text-xs text-stone-400">
                          Dibuat {formatDate(booking.createdAt)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold text-stone-900">
                            {booking.user.name || 'Tanpa Nama'}
                          </p>
                          <p className="text-xs text-stone-500">{booking.user.email}</p>
                          {booking.guestPhone && (
                            <p className="text-xs text-stone-500">{booking.guestPhone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-stone-900">
                          {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}
                        </p>
                      </TableCell>
                      <TableCell>{booking.numberOfGuests} orang</TableCell>
                      <TableCell>
                        <span className="font-semibold text-stone-900">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onChange={(event) =>
                            handleStatusChange(
                              booking.id,
                              event.target.value as Booking['status'],
                            )
                          }
                          className="text-sm"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="COMPLETED">Completed</option>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex flex-col gap-3 text-sm text-stone-600 md:flex-row md:items-center md:justify-between">
                <p>
                  Menampilkan {filteredBookings.length} dari {bookings.length} booking
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-xs text-stone-500">
                    Halaman {page} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
