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
import { Select } from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';

interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  numberOfGuests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
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

  const getStatusBadge = (status: Booking['status']) => {
    const variants: Record<Booking['status'], 'default' | 'success' | 'warning' | 'danger'> = {
      PENDING: 'warning',
      CONFIRMED: 'success',
      CANCELLED: 'danger',
      COMPLETED: 'default',
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manajemen Bookings</h1>
            <p className="text-stone-600 mt-1">Kelola reservasi homestay</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Memuat data...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Tidak ada booking ditemukan</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Homestay</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Tamu</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.homestay.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {booking.user.name || 'No Name'}
                          </div>
                          <div className="text-stone-500">{booking.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(booking.checkInDate).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.checkOutDate).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>{booking.numberOfGuests}</TableCell>
                      <TableCell>
                        Rp {booking.totalPrice.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusChange(
                              booking.id,
                              e.target.value as Booking['status']
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

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-stone-600">
                  Halaman {page} dari {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Sebelumnya
                  </Button>
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
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
