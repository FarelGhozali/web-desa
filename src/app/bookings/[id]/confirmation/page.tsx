import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import ReviewForm from '@/components/ReviewForm';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Konfirmasi Pemesanan',
    description: 'Konfirmasi pemesanan homestay Anda',
  };
}

export default async function BookingConfirmationPage({ params }: Props) {
  const { id } = await params;
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

  // Get booking
  const booking = await prisma.booking.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      homestay: true,
    },
  });

  if (!booking) {
    redirect('/homestays');
  }

  // Check if the user already left a review for this homestay
  const existingReview = await prisma.review.findFirst({
    where: {
      userId: user.id,
      homestayId: booking!.homestayId,
    },
  });

  const checkInDate = new Date(booking.checkInDate);
  const checkOutDate = new Date(booking.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          {/* Success Header */}
          <div className="mb-8 text-center">
            <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
              <span className="text-6xl font-bold text-white drop-shadow-md">✓</span>
            </div>
            <h1 className="mb-2 text-4xl font-bold text-stone-900">Pemesanan Berhasil!</h1>
            <p className="text-lg text-stone-600">
              Terima kasih telah memesan. Berikut adalah detail pemesanan Anda.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm mb-8">
            {/* Booking ID */}
            <div className="mb-6 pb-6 border-b border-stone-200">
              <p className="text-sm text-stone-600">Nomor Pemesanan</p>
              <p className="font-mono text-lg font-semibold text-stone-900">{booking.id}</p>
            </div>

            {/* Homestay Info */}
            <div className="mb-6 pb-6 border-b border-stone-200">
              <p className="mb-2 text-sm font-semibold text-stone-700">Homestay</p>
              <h2 className="mb-2 text-2xl font-bold text-stone-900">{booking.homestay.name}</h2>
              <p className="text-stone-600">{booking.homestay.address}</p>
            </div>

            {/* Date & Guest Info */}
            <div className="mb-6 grid grid-cols-2 gap-4 pb-6 border-b border-stone-200">
              <div>
                <p className="text-sm text-stone-600">Check-in</p>
                <p className="font-semibold text-stone-900">
                  {checkInDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-600">Check-out</p>
                <p className="font-semibold text-stone-900">
                  {checkOutDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-600">Durasi</p>
                <p className="font-semibold text-stone-900">{nights} malam</p>
              </div>
              <div>
                <p className="text-sm text-stone-600">Jumlah Tamu</p>
                <p className="font-semibold text-stone-900">{booking.numberOfGuests} orang</p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>
                  Rp {Number(booking.homestay.pricePerNight).toLocaleString('id-ID')} × {nights} malam
                </span>
                <span>Rp {(Number(booking.homestay.pricePerNight) * nights).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-xl font-bold text-stone-900">
                <span>Total</span>
                <span>Rp {Number(booking.totalPrice).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className={`mb-8 rounded-lg p-4 ${
            booking.status === 'CONFIRMED' 
              ? 'bg-green-50 text-green-900' 
              : booking.status === 'COMPLETED'
              ? 'bg-emerald-50 text-emerald-900'
              : booking.status === 'CANCELLED'
              ? 'bg-red-50 text-red-900'
              : 'bg-blue-50 text-blue-900'
          }`}>
            <p className="font-semibold mb-1">Status Pemesanan: {booking.status}</p>
            <p className="text-sm">
              {booking.status === 'CONFIRMED' && (
                'Pesanan Anda telah dikonfirmasi! Silakan cek email untuk detail lebih lanjut.'
              )}
              {booking.status === 'PENDING' && (
                'Pemesanan Anda masih berstatus PENDING. Kami akan menghubungi Anda dalam 24 jam untuk konfirmasi final.'
              )}
              {booking.status === 'COMPLETED' && (
                'Pemesanan Anda telah selesai. Terima kasih telah menginap di homestay kami!'
              )}
              {booking.status === 'CANCELLED' && (
                'Pemesanan Anda telah dibatalkan. Hubungi kami jika Anda ingin membuat pemesanan baru.'
              )}
            </p>
          </div>

          {/* Review Section - Show only if COMPLETED and user hasn't reviewed yet */}
          {booking.status === 'COMPLETED' && (
            <div className="mb-8 rounded-lg border border-stone-200 bg-white p-8">
              <h3 className="mb-2 text-2xl font-bold text-stone-900">Berikan Review</h3>
              <p className="mb-6 text-stone-600">
                Bagikan pengalaman Anda menginap di {booking.homestay.name}. Review Anda membantu calon tamu lain dan pemilik homestay.
              </p>
              {existingReview ? (
                <div className="rounded-lg bg-emerald-50 p-4 text-emerald-900">
                  <p className="font-semibold mb-1">Anda sudah memberikan review untuk homestay ini.</p>
                  <p className="text-sm mb-2">Terima kasih atas ulasan Anda.</p>
                  <div className="border-t border-stone-200 pt-3">
                <p className="font-semibold">Rating: <span className="text-amber-500">{Array(existingReview.rating).fill('\u2605').join('')}</span></p>
                    <p className="text-sm text-stone-700 mt-1">{existingReview.comment}</p>
                  </div>
                </div>
              ) : (
                <ReviewForm
                  bookingId={booking.id}
                  homestayId={booking.homestay.id}
                />
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/homestays" className="flex-1">
              <Button variant="secondary" className="w-full">
                Lihat Homestay Lainnya
              </Button>
            </Link>
            <Link href="/bookings" className="flex-1">
              <Button className="w-full">Lihat Pemesanan Saya</Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 rounded-lg border border-stone-200 bg-stone-50 p-6">
            <h3 className="mb-3 font-semibold text-stone-900">Informasi Penting</h3>
            <ul className="space-y-2 text-sm text-stone-700">
              <li className="flex gap-2">
                <span>•</span>
                <span>Pembatalan gratis hingga 7 hari sebelum check-in</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Hubungi kami jika ada perubahan atau pertanyaan</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Check-in dimulai pukul 14:00 dan check-out pukul 11:00</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
