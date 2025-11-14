'use client';

import { FormEvent, useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/contact/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          const errorMessages = data.details
            .map((err: { message: string }) => err.message)
            .join(', ');
          setError(errorMessages);
        } else {
          setError(data.error || 'Gagal mengirim pesan');
        }
        return;
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Gagal mengirim pesan. Silakan coba lagi.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          Pesan berhasil dikirim! Tim kami akan merespon dalam 24 jam kerja.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Nama lengkap"
          name="name"
          placeholder="Nama Anda"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          label="Email"
          name="email"
          placeholder="nama@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Subjek"
        name="subject"
        placeholder="Contoh: Rencana liburan keluarga"
        value={formData.subject}
        onChange={handleChange}
        required
      />

      <Textarea
        label="Pesan"
        name="message"
        placeholder="Ceritakan tanggal perjalanan, jumlah tamu, dan pengalaman yang Anda minati..."
        rows={6}
        value={formData.message}
        onChange={handleChange}
        required
      />

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? 'Mengirim...' : 'Kirim pesan'}
      </Button>
    </form>
  );
}
