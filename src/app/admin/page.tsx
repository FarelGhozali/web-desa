import { Metadata } from 'next';
import Link from 'next/link';
import type { BookingStatus, UserRole } from '@prisma/client';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/ui/StatsCard';
import { prisma } from '@/lib/prisma';
import { formatDate, formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dashboard Admin',
  description: 'Admin dashboard untuk mengelola website Village Stay',
};

interface DashboardStats {
  totalHomestays: number;
  totalBookings: number;
  totalUsers: number;
  totalPosts: number;
  totalAttractions: number;
  totalCulinary: number;
  pendingBookings: number;
  recentBookings: Array<{
    id: string;
    status: BookingStatus;
    checkInDate: Date;
    checkOutDate: Date;
    createdAt: Date;
    homestay: { name: string };
    user: { name: string | null; email: string };
  }>;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: UserRole;
    createdAt: Date;
  }>;
  bookingTrend: Array<{
    date: string;
    total: number;
    revenue: number;
  }>;
  agendaEntries: Array<{
    id: string;
    eventType: 'CHECK_IN' | 'CHECK_OUT';
    eventDate: Date;
    homestayName: string;
    guestName: string;
    guestEmail: string;
  }>;
  featuredHomestays: Array<{
    id: string;
    name: string;
    slug: string;
    pricePerNight: number;
    featured: boolean;
    _count: { bookings: number; reviews: number };
  }>;
  draftCounts: {
    posts: number;
    attractions: number;
    culinary: number;
  };
  recentDrafts: Array<{
    id: string;
    title: string;
    type: 'post' | 'attraction' | 'culinary';
    updatedAt: Date;
    href: string;
  }>;
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    user: { name: string | null; email: string };
    homestay: { name: string; slug: string };
  }>;
}

async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const twoDaysAhead = new Date(startOfToday);
  twoDaysAhead.setDate(twoDaysAhead.getDate() + 2);
  const trendStart = new Date(startOfToday);
  trendStart.setDate(trendStart.getDate() - 6);

  const [
    totalHomestays,
    totalBookings,
    totalUsers,
    totalPosts,
    totalAttractions,
    totalCulinary,
    pendingBookings,
  ] = await Promise.all([
    prisma.homestay.count(),
    prisma.booking.count(),
    prisma.user.count(),
    prisma.post.count(),
    prisma.attraction.count(),
    prisma.culinary.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
  ]);

  const [
    recentBookings,
    recentUsers,
    bookingsLastWeek,
    upcomingBookings,
    featuredHomestays,
    draftPosts,
    draftPostsCount,
    draftAttractions,
    draftAttractionsCount,
    draftCulinary,
    draftCulinaryCount,
    recentReviews,
  ] = await Promise.all([
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        homestay: { select: { name: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: trendStart } },
      select: { id: true, createdAt: true, totalPrice: true },
    }),
    prisma.booking.findMany({
      where: {
        OR: [
          { checkInDate: { gte: startOfToday, lt: twoDaysAhead } },
          { checkOutDate: { gte: startOfToday, lt: twoDaysAhead } },
        ],
      },
      include: {
        user: { select: { name: true, email: true } },
        homestay: { select: { name: true } },
      },
    }),
    prisma.homestay.findMany({
      where: { published: true },
      take: 3,
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        pricePerNight: true,
        featured: true,
        _count: { select: { bookings: true, reviews: true } },
      },
    }),
    prisma.post.findMany({
      where: { published: false },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.post.count({ where: { published: false } }),
    prisma.attraction.findMany({
      where: { published: false },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, updatedAt: true },
    }),
    prisma.attraction.count({ where: { published: false } }),
    prisma.culinary.findMany({
      where: { published: false },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, updatedAt: true },
    }),
    prisma.culinary.count({ where: { published: false } }),
    prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        homestay: { select: { name: true, slug: true } },
      },
    }),
  ]);

  const trendBuckets = new Map<string, { total: number; revenue: number }>();
  bookingsLastWeek.forEach((booking) => {
    const key = booking.createdAt.toISOString().split('T')[0];
    const bucket = trendBuckets.get(key) ?? { total: 0, revenue: 0 };
    bucket.total += 1;
    bucket.revenue += Number(booking.totalPrice);
    trendBuckets.set(key, bucket);
  });

  const bookingTrend = Array.from({ length: 7 }).map((_, index) => {
    const currentDate = new Date(trendStart);
    currentDate.setDate(trendStart.getDate() + index);
    const key = currentDate.toISOString().split('T')[0];
    const bucket = trendBuckets.get(key) ?? { total: 0, revenue: 0 };
    return {
      date: key,
      total: bucket.total,
      revenue: bucket.revenue,
    };
  });

  const agendaEntries = upcomingBookings
    .flatMap((booking) => {
      const entries: DashboardStats['agendaEntries'] = [];
      if (booking.checkInDate >= startOfToday && booking.checkInDate < twoDaysAhead) {
        entries.push({
          id: `${booking.id}-check-in`,
          eventType: 'CHECK_IN',
          eventDate: booking.checkInDate,
          homestayName: booking.homestay.name,
          guestName: booking.user.name ?? booking.user.email,
          guestEmail: booking.user.email,
        });
      }
      if (booking.checkOutDate >= startOfToday && booking.checkOutDate < twoDaysAhead) {
        entries.push({
          id: `${booking.id}-check-out`,
          eventType: 'CHECK_OUT',
          eventDate: booking.checkOutDate,
          homestayName: booking.homestay.name,
          guestName: booking.user.name ?? booking.user.email,
          guestEmail: booking.user.email,
        });
      }
      return entries;
    })
    .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime())
    .slice(0, 6);

  // Convert featured homestays bigint to number
  const convertedFeaturedHomestays = featuredHomestays.map((homestay) => ({
    ...homestay,
    pricePerNight: Number(homestay.pricePerNight),
  }));

  const recentDrafts = [
    ...draftPosts.map((draft) => ({
      id: draft.id,
      title: draft.title,
      type: 'post' as const,
      updatedAt: draft.updatedAt,
      href: '/admin/posts',
    })),
    ...draftAttractions.map((draft) => ({
      id: draft.id,
      title: draft.name,
      type: 'attraction' as const,
      updatedAt: draft.updatedAt,
      href: '/admin/attractions',
    })),
    ...draftCulinary.map((draft) => ({
      id: draft.id,
      title: draft.name,
      type: 'culinary' as const,
      updatedAt: draft.updatedAt,
      href: '/admin/culinary',
    })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 6);

  return {
    totalHomestays,
    totalBookings,
    totalUsers,
    totalPosts,
    totalAttractions,
    totalCulinary,
    pendingBookings,
    recentBookings,
    recentUsers,
    bookingTrend,
    agendaEntries,
    featuredHomestays: convertedFeaturedHomestays,
    draftCounts: {
      posts: draftPostsCount,
      attractions: draftAttractionsCount,
      culinary: draftCulinaryCount,
    },
    recentDrafts,
    recentReviews,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const today = formatDate(new Date());

  const totalBookingsLast7Days = stats.bookingTrend.reduce((sum, day) => sum + day.total, 0);
  const revenueLast7Days = stats.bookingTrend.reduce((sum, day) => sum + day.revenue, 0);
  const maxTrendBookings = stats.bookingTrend.reduce(
    (max, day) => (day.total > max ? day.total : max),
    0,
  );
  const averageBookingsPerDay = stats.bookingTrend.length
    ? Math.round(totalBookingsLast7Days / stats.bookingTrend.length)
    : 0;

  const getBarHeightClass = (value: number) => {
    if (maxTrendBookings === 0) return 'h-2';
    const ratio = value / maxTrendBookings;
    if (ratio >= 0.9) return 'h-12';
    if (ratio >= 0.7) return 'h-10';
    if (ratio >= 0.5) return 'h-8';
    if (ratio >= 0.3) return 'h-6';
    if (ratio >= 0.15) return 'h-4';
    return 'h-2';
  };

  const weekdayFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'short' });
  const shortDateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
  });
  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-10">
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-6 text-white shadow-lg md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-emerald-100">
                Panel Admin Village Stay
              </p>
              <h1 className="text-2xl font-semibold leading-tight md:text-4xl">
                Selamat datang kembali, admin!
              </h1>
              <p className="max-w-xl text-sm text-emerald-50 md:text-base">
                Lihat performa terbaru homestay, aktivitas reservasi, dan konten pemasaran dalam satu tempat.
                Gunakan pintasan di bawah ini untuk mempercepat tugas harian Anda.
              </p>
            </div>
            <Card className="w-full max-w-sm border-0 bg-white/10 p-6 backdrop-blur md:w-auto">
              <p className="text-xs uppercase tracking-wide text-emerald-100">
                Snapshot Hari Ini
              </p>
              <p className="mt-2 text-lg font-semibold">{today}</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-emerald-100">Booking Aktif</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-100">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-100">Homestay</p>
                  <p className="text-2xl font-bold">{stats.totalHomestays}</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-100">Pengguna</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<span className="text-2xl">📅</span>}
            description={`${stats.pendingBookings} menunggu konfirmasi`}
          />
          <StatsCard
            title="Total Homestay"
            value={stats.totalHomestays}
            icon={<span className="text-2xl">🏡</span>}
            description="Tersedia untuk reservasi"
          />
          <StatsCard
            title="Pengguna Aktif"
            value={stats.totalUsers}
            icon={<span className="text-2xl">👥</span>}
            description="Terdaftar di platform"
          />
          <StatsCard
            title="Konten Blog"
            value={stats.totalPosts}
            icon={<span className="text-2xl">📝</span>}
            description="Artikel dipublikasikan"
          />
        </section>

        <Card className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-stone-900 font-heading">
                Tren Booking 7 Hari Terakhir
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Pantau volume reservasi dan pendapatan untuk mendeteksi penurunan lebih cepat.
              </p>
            </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  {totalBookingsLast7Days} booking
                </span>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                  {formatPrice(revenueLast7Days)}
                </span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-7 items-end gap-3">
              {stats.bookingTrend.map((day) => {
                const dateObj = new Date(day.date);
                const weekdayLabel = weekdayFormatter.format(dateObj);
                const dateLabel = shortDateFormatter.format(dateObj);
                return (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-2 text-center">
                    <div
                      className={`w-full rounded-full bg-gradient-to-t from-emerald-100 via-emerald-300 to-emerald-500 ${getBarHeightClass(day.total)}`}
                    />
                    <div className="flex flex-col text-xs text-stone-500">
                      <span className="font-medium text-stone-700">{day.total}</span>
                      <span>{weekdayLabel}</span>
                      <span>{dateLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-stone-600 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-wide text-stone-500">Rata-rata Harian</p>
                <p className="mt-2 text-lg font-semibold text-stone-900">{averageBookingsPerDay}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-wide text-stone-500">Puncak Booking</p>
                <p className="mt-2 text-lg font-semibold text-stone-900">{maxTrendBookings}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-wide text-stone-500">Pendapatan 7 Hari</p>
                <p className="mt-2 text-lg font-semibold text-stone-900">{formatPrice(revenueLast7Days)}</p>
              </div>
            </div>
        </Card>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-stone-900 font-heading">Homestay Unggulan</h2>
              <Link href="/admin/homestays">
                <Button variant="ghost" size="sm">
                  Kelola
                </Button>
              </Link>
            </div>
            <p className="mt-2 text-sm text-stone-600">
              Daftar homestay dengan performa booking tertinggi. Pertimbangkan untuk membuat promo lanjutan.
            </p>
            <div className="mt-6 space-y-4">
              {stats.featuredHomestays.length === 0 ? (
                <p className="text-sm text-stone-500">Belum ada homestay populer. Dorong review dan promosi.</p>
              ) : (
                stats.featuredHomestays.map((homestay) => (
                  <Link
                    key={homestay.id}
                    href={`/homestays/${homestay.slug}`}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200 p-4 transition hover:border-emerald-400 hover:bg-stone-50/60"
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{homestay.name}</p>
                      <p className="text-xs text-stone-600">{formatPrice(homestay.pricePerNight)} / malam</p>
                      <p className="text-xs text-stone-500">
                        {homestay._count.bookings} booking · {homestay._count.reviews} ulasan
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        homestay.featured
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {homestay.featured ? 'Featured' : 'Reguler'}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-stone-900 font-heading">Pengguna Baru</h2>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">
                  Kelola Pengguna
                </Button>
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {stats.recentUsers.length === 0 ? (
                <p className="text-sm text-stone-500">Belum ada registrasi baru minggu ini.</p>
              ) : (
                stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 p-4 transition hover:border-emerald-400 hover:bg-stone-50/60"
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {user.name || 'Tanpa Nama'}
                      </p>
                      <p className="text-xs text-stone-600">{user.email}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        Bergabung {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-stone-900 font-heading">Review Terbaru</h2>
              <Link href="/admin/reviews">
                <Button variant="ghost" size="sm">
                  Kelola Review
                </Button>
              </Link>
            </div>
            <p className="mt-2 text-sm text-stone-600">
              Pantau feedback tamu untuk meningkatkan kualitas layanan homestay.
            </p>
            <div className="mt-6 space-y-4">
              {stats.recentReviews.length === 0 ? (
                <p className="text-sm text-stone-500">
                  Belum ada review terbaru. Dorong tamu untuk memberikan ulasan.
                </p>
              ) : (
                stats.recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-stone-200 p-4 transition hover:border-emerald-400 hover:bg-stone-50/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-stone-900">
                            {review.user.name || review.user.email}
                          </p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < review.rating ? 'text-amber-500' : 'text-stone-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <Link
                          href={`/homestays/${review.homestay.slug}`}
                          className="mt-1 text-xs text-emerald-600 hover:underline"
                        >
                          {review.homestay.name}
                        </Link>
                        <p className="mt-2 text-xs leading-relaxed text-stone-600">
                          {review.comment.length > 120
                            ? `${review.comment.slice(0, 120)}...`
                            : review.comment}
                        </p>
                        <p className="mt-2 text-xs text-stone-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="p-6 xl:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-stone-900 font-heading">Agenda 48 Jam</h2>
                <p className="mt-1 text-sm text-stone-600">
                  Check-in dan check-out terdekat agar tim siap menyambut tamu.
                </p>
              </div>
              <Link href="/admin/bookings">
                <Button variant="ghost" size="sm">
                  Lihat detail
                </Button>
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {stats.agendaEntries.length === 0 ? (
                <p className="text-sm text-stone-500">
                  Tidak ada agenda dalam 48 jam ke depan. Manfaatkan waktu untuk optimasi konten.
                </p>
              ) : (
                stats.agendaEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200 p-4 transition hover:border-emerald-400 hover:bg-stone-50/60"
                  >
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          entry.eventType === 'CHECK_IN'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {entry.eventType === 'CHECK_IN' ? 'Check-in' : 'Check-out'}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{entry.homestayName}</p>
                        <p className="text-xs text-stone-600">{entry.guestName}</p>
                        <p className="text-xs text-stone-500">{entry.guestEmail}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-stone-500">
                      <p className="font-medium text-stone-700">{formatDate(entry.eventDate)}</p>
                      <p>{timeFormatter.format(entry.eventDate)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
          <Card className="p-6 2xl:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-stone-900 font-heading">Booking Terbaru</h2>
              <Link href="/admin/bookings">
                <Button variant="ghost" size="sm">
                  Pantau Booking
                </Button>
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {stats.recentBookings.length === 0 ? (
                <p className="text-sm text-stone-500">
                  Belum ada aktivitas booking dalam 7 hari terakhir.
                </p>
              ) : (
                stats.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 rounded-2xl border border-stone-200 p-4 transition hover:border-emerald-400 hover:bg-stone-50/60 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-stone-900">
                        {booking.homestay.name}
                      </p>
                      <p className="text-xs text-stone-600">
                        {booking.user.name || booking.user.email}
                      </p>
                      <p className="text-xs text-stone-500">
                        {formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs md:flex-col md:items-end md:text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          booking.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700'
                            : booking.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : booking.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-xs text-stone-500">
                        Dibuat {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </div>
  );
}
