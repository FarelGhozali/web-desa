import { Metadata } from 'next';
import AdminLayout from '@/components/layout/AdminLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card } from '@/components/ui/Card';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Dashboard Admin',
  description: 'Admin dashboard untuk mengelola website Village Stay',
};

async function getDashboardStats() {
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Overview */}
        <div>
          <h2 className="text-xl font-bold font-heading mb-4">Statistik Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Homestays"
              value={stats.totalHomestays}
              icon={<span className="text-2xl">🏠</span>}
              description="Homestay terdaftar"
            />
            <StatsCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={<span className="text-2xl">📅</span>}
              description={`${stats.pendingBookings} pending`}
            />
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<span className="text-2xl">👥</span>}
              description="Pengguna terdaftar"
            />
            <StatsCard
              title="Blog Posts"
              value={stats.totalPosts}
              icon={<span className="text-2xl">📝</span>}
              description="Artikel blog"
            />
          </div>
        </div>

        {/* Content Stats */}
        <div>
          <h2 className="text-xl font-bold font-heading mb-4">Konten Website</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard
              title="Attractions"
              value={stats.totalAttractions}
              icon={<span className="text-2xl">🗺️</span>}
              description="Tempat wisata"
            />
            <StatsCard
              title="Culinary"
              value={stats.totalCulinary}
              icon={<span className="text-2xl">🍽️</span>}
              description="Kuliner lokal"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-heading">Booking Terbaru</h3>
              <Link href="/admin/bookings">
                <Button variant="ghost" size="sm">
                  Lihat Semua
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentBookings.length === 0 ? (
                <p className="text-sm text-stone-500">Belum ada booking</p>
              ) : (
                stats.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-start justify-between border-b border-stone-200 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{booking.homestay.name}</p>
                      <p className="text-xs text-stone-600">
                        {booking.user.name || booking.user.email}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        {new Date(booking.checkInDate).toLocaleDateString('id-ID')} -{' '}
                        {new Date(booking.checkOutDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Users */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-heading">Pengguna Baru</h3>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">
                  Lihat Semua
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentUsers.length === 0 ? (
                <p className="text-sm text-stone-500">Belum ada pengguna</p>
              ) : (
                stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start justify-between border-b border-stone-200 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name || 'No Name'}</p>
                      <p className="text-xs text-stone-600">{user.email}</p>
                      <p className="text-xs text-stone-500 mt-1">
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-bold font-heading mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/homestays/new">
              <Button variant="outline" fullWidth>
                + Tambah Homestay
              </Button>
            </Link>
            <Link href="/admin/posts/new">
              <Button variant="outline" fullWidth>
                + Tulis Artikel
              </Button>
            </Link>
            <Link href="/admin/attractions/new">
              <Button variant="outline" fullWidth>
                + Tambah Wisata
              </Button>
            </Link>
            <Link href="/admin/culinary/new">
              <Button variant="outline" fullWidth>
                + Tambah Kuliner
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
