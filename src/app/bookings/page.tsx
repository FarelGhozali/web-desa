import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pemesanan Saya',
  description: 'Kelola pemesanan homestay Anda',
};

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/login');
  }

  // Get user's bookings
  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      homestay: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Menunggu Konfirmasi';
      case 'CONFIRMED':
        return 'Terkonfirmasi';
      case 'COMPLETED':
        return 'Selesai';
      case 'CANCELLED':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Container>
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-stone-900">Pemesanan Saya</h1>
          <p className="text-stone-600">Kelola dan lihat riwayat pemesanan homestay Anda</p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-8 text-center">
            <p className="mb-4 text-stone-600">Anda belum memiliki pemesanan apapun</p>
            <Link href="/homestays">
              <Button>Jelajahi Homestay</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const checkInDate = new Date(booking.checkInDate);
              const checkOutDate = new Date(booking.checkOutDate);
              const nights = Math.ceil(
                (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={booking.id}
                  className="rounded-lg border border-stone-200 bg-white p-6 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {/* Homestay Info */}
                    <div className="md:col-span-2">
                      <h3 className="mb-1 text-lg font-semibold text-stone-900">
                        {booking.homestay.name}
                      </h3>
                      <p className="text-sm text-stone-600 mb-3">{booking.homestay.address}</p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-stone-600">Check-in:</span>{' '}
                          <span className="font-medium">
                            {checkInDate.toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </p>
                        <p>
                          <span className="text-stone-600">Check-out:</span>{' '}
                          <span className="font-medium">
                            {checkOutDate.toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </p>
                        <p>
                          <span className="text-stone-600">Durasi:</span>{' '}
                          <span className="font-medium">{nights} malam</span>
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div>
                      <p className="text-sm text-stone-600 mb-1">Total Pembayaran</p>
                      <p className="mb-4 text-2xl font-bold text-stone-900">
                        Rp {booking.totalPrice.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-stone-600 mb-1">Jumlah Tamu</p>
                      <p className="font-medium text-stone-900">{booking.numberOfGuests} orang</p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col gap-2">
                      <div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(booking.status)}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                      <div className="text-sm text-stone-500">
                        ID: {booking.id.slice(0, 8)}...
                      </div>
                      <Link href={`/bookings/${booking.id}/confirmation`} className="mt-auto">
                        <Button variant="secondary" className="w-full text-sm">
                          Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
