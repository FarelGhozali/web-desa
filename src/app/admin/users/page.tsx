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
import Input from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count: {
    bookings: number;
    posts: number;
    reviews: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(roleFilter !== 'ALL' && { role: roleFilter }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, roleFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter === 'ALL') return true;
      return user.role === roleFilter;
    });
  }, [users, roleFilter]);

  const stats = useMemo(() => {
    const totalAdmin = users.filter((user) => user.role === 'ADMIN').length;
    return {
      total: users.length,
      admin: totalAdmin,
      customer: users.length - totalAdmin,
    };
  }, [users]);

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('Gagal mengubah role user');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Gagal menghapus user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Terjadi kesalahan');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Manajemen Pengguna"
          description="Kelola akun customer dan admin, perkuat keamanan akses, serta pantau aktivitas mereka di platform."
          stats={[
            { label: 'Total Pengguna', value: loading ? '…' : stats.total },
            { label: 'Admin', value: loading ? '…' : stats.admin },
            { label: 'Customer', value: loading ? '…' : stats.customer },
            {
              label: 'Rata-rata Booking/User',
              value:
                !loading && stats.total > 0
                  ? (users.reduce((acc, user) => acc + user._count.bookings, 0) / stats.total).toFixed(1)
                  : '0',
            },
          ]}
        />

        <AdminToolbar>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan nama atau email"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={roleFilter === 'ALL' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setRoleFilter('ALL');
                  setPage(1);
                }}
              >
                Semua
              </Button>
              <Button
                variant={roleFilter === 'USER' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setRoleFilter('USER');
                  setPage(1);
                }}
              >
                Customer
              </Button>
              <Button
                variant={roleFilter === 'ADMIN' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setRoleFilter('ADMIN');
                  setPage(1);
                }}
              >
                Admin
              </Button>
            </div>
          </div>
        </AdminToolbar>

        <Card className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-sm text-stone-500">Memuat data pengguna…</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
              <p className="text-base font-semibold text-stone-700">
                Tidak ada pengguna ditemukan.
              </p>
              <p className="text-sm text-stone-500">
                Coba ubah filter atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profil</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead>Artikel</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Bergabung</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-stone-900">
                            {user.name || 'Tanpa Nama'}
                          </p>
                          <p className="text-xs text-stone-500">ID: {user.id.slice(0, 8)}…</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-stone-700">{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onChange={(event) =>
                            handleRoleChange(user.id, event.target.value as 'USER' | 'ADMIN')
                          }
                          className="text-sm"
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </Select>
                      </TableCell>
                      <TableCell>{user._count.bookings}</TableCell>
                      <TableCell>{user._count.posts}</TableCell>
                      <TableCell>{user._count.reviews}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex flex-col gap-3 text-sm text-stone-600 md:flex-row md:items-center md:justify-between">
                <p>
                  Menampilkan {filteredUsers.length} dari {users.length} pengguna
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
