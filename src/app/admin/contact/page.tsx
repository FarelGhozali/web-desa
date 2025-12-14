'use client';

import { useEffect, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page.toString());

      const response = await fetch(`/api/contact/messages?${params}`);
      if (!response.ok) throw new Error('Gagal mengambil pesan');

      const data = await response.json();
      setMessages(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter, page]);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Gagal mengupdate status');

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pesan ini?')) return;

    try {
      const response = await fetch(`/api/contact/messages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Gagal menghapus pesan');

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNREAD':
        return 'bg-yellow-100 text-yellow-900 text-yellow-700';
      case 'READ':
        return 'bg-blue-100 text-blue-900 text-blue-700';
      case 'REPLIED':
        return 'bg-emerald-100 text-emerald-900 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-900 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pesan Kontak"
        description="Kelola pesan dari pengunjung yang menghubungi melalui form kontak"
      />

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={statusFilter === '' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => {
            setStatusFilter('');
            setPage(1);
          }}
        >
          Semua
        </Button>
        <Button
          variant={statusFilter === 'UNREAD' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => {
            setStatusFilter('UNREAD');
            setPage(1);
          }}
        >
          Belum Dibaca
        </Button>
        <Button
          variant={statusFilter === 'READ' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => {
            setStatusFilter('READ');
            setPage(1);
          }}
        >
          Sudah Dibaca
        </Button>
        <Button
          variant={statusFilter === 'REPLIED' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => {
            setStatusFilter('REPLIED');
            setPage(1);
          }}
        >
          Sudah Dibalas
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-stone-500">Memuat pesan...</div>
      ) : messages.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="text-stone-600 font-medium">Belum ada pesan kontak</p>
          <p className="text-sm text-stone-500 mt-1">Pesan dari pengunjung akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="border-stone-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-stone-900">{message.name}</h3>
                        <Badge className={getStatusColor(message.status)}>
                          {message.status === 'UNREAD'
                            ? 'Belum Dibaca'
                            : message.status === 'READ'
                            ? 'Sudah Dibaca'
                            : 'Sudah Dibalas'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-stone-500 break-all">{message.email}</p>
                        <p className="font-medium text-stone-900 line-clamp-2">{message.subject}</p>
                        <p className="text-stone-700 text-sm whitespace-pre-wrap line-clamp-3">{message.message}</p>
                        <p className="text-xs text-stone-400 pt-2">
                          {new Date(message.createdAt).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap pt-2 border-t border-stone-200">
                    <Button
                      size="sm"
                      variant={message.status === 'UNREAD' ? 'primary' : 'outline'}
                      onClick={() => handleStatusChange(message.id, 'UNREAD')}
                      className="text-xs"
                    >
                      Belum Dibaca
                    </Button>
                    <Button
                      size="sm"
                      variant={message.status === 'READ' ? 'primary' : 'outline'}
                      onClick={() => handleStatusChange(message.id, 'READ')}
                      className="text-xs"
                    >
                      Sudah Dibaca
                    </Button>
                    <Button
                      size="sm"
                      variant={message.status === 'REPLIED' ? 'primary' : 'outline'}
                      onClick={() => handleStatusChange(message.id, 'REPLIED')}
                      className="text-xs"
                    >
                      Sudah Dibalas
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(message.id)}
                      className="text-xs"
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
