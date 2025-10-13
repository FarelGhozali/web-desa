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
import Input from '@/components/ui/Input';

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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
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
  }, [page, search]);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manajemen Users</h1>
            <p className="text-stone-600 mt-1">Kelola pengguna terdaftar</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <Input
              placeholder="Cari berdasarkan nama atau email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Memuat data...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500">Tidak ada user ditemukan</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Reviews</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">
                          {user.name || 'No Name'}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value as 'USER' | 'ADMIN'
                            )
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
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </TableCell>
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
