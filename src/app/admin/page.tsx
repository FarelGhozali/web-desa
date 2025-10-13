import { Metadata } from 'next';
import Link from 'next/link';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/ui/StatsCard';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

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
  recentBookings: Array<
    Awaited<ReturnType<typeof prisma.booking.findMany>>[number]
  >;
  recentUsers: Array<
    Awaited<ReturnType<typeof prisma.user.findMany>>[number]
  >;
}

async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalHomestays,
    totalBookings,
    totalUsers,
    totalPosts,
    totalAttractions,
    totalCulinary,
    pendingBookings,
    recentBookings,
    recentUsers,
  ] = await Promise.all([
    prisma.homestay.count(),
    prisma.booking.count(),
    prisma.user.count(),
    prisma.post.count(),
    prisma.attraction.count(),
    prisma.culinary.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
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
  ]);

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
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const today = formatDate(new Date());

  const managementShortcuts = [
    {
      href: '/admin/homestays',
      title: 'Kelola Homestay',
      description: 'Tinjau dan optimalkan daftar homestay yang tersedia.',
    },
    {
      href: '/admin/bookings',
      title: 'Pantau Booking',
      description: `Kelola ${stats.pendingBookings} reservasi yang menunggu konfirmasi.`,
    },
    {
      href: '/admin/posts',
      title: 'Konten Blog',
      description: 'Bagikan cerita baru untuk menarik pengunjung baru.',
    },
    {
      href: '/admin/users',
      title: 'Manajemen Pengguna',
      description: 'Kelola akun dan peran pengguna platform.',
    },
  ];

  const quickActions = [
    { href: '/admin/homestays/new', label: 'Tambah Homestay' },
    { href: '/admin/posts/new', label: 'Tulis Artikel' },
    { href: '/admin/attractions/new', label: 'Tambah Wisata' },
    { href: '/admin/culinary/new', label: 'Tambah Kuliner' },
  ];

  return (
    <AdminLayout>
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

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900 font-heading">Pintasan Manajemen</h2>
                  <p className="mt-1 text-sm text-stone-600">
                    Navigasi cepat ke area yang paling sering Anda gunakan.
                  </p>
                </div>
                <Link href="/admin/bookings">
                  <Button variant="ghost" size="sm">
                    Lihat Semua Modul
                  </Button>
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {managementShortcuts.map((shortcut) => (
                  <Link
                    key={shortcut.href}
                    href={shortcut.href}
                    className="group rounded-2xl border border-stone-200 bg-stone-50/40 p-5 transition hover:border-emerald-400 hover:bg-white"
                  >
                    <p className="text-sm font-semibold text-stone-900">
                      {shortcut.title}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-stone-600">
                      {shortcut.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-emerald-600">
                      Masuk ke halaman
                      <span className="transition group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          <Card className="flex h-full flex-col justify-between p-6">
            <h2 className="text-lg font-semibold text-stone-900 font-heading">Quick Actions</h2>
            <p className="mt-2 text-sm text-stone-600">
              Tambahkan aset baru dan jaga konten tetap segar.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Button fullWidth variant="outline" className="justify-between">
                    <span>+ {action.label}</span>
                    <span className="text-xs text-stone-500">⌲</span>
                  </Button>
                </Link>
              ))}
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

          <div className="space-y-6">
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
              <h2 className="text-lg font-semibold text-stone-900 font-heading">Konten Aktif</h2>
              <p className="mt-2 text-sm text-stone-600">
                Pastikan katalog destinasi tetap relevan bagi calon tamu.
              </p>
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-stone-600">Destinasi Wisata</dt>
                  <dd className="text-base font-semibold">{stats.totalAttractions}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-stone-600">Kuliner Lokal</dt>
                  <dd className="text-base font-semibold">{stats.totalCulinary}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-stone-600">Artikel Blog</dt>
                  <dd className="text-base font-semibold">{stats.totalPosts}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-stone-200 pt-4">
                  <dt className="text-sm font-medium text-stone-700">Total Konten</dt>
                  <dd className="text-lg font-bold">
                    {stats.totalAttractions + stats.totalCulinary + stats.totalPosts}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
