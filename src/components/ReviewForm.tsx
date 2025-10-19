'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';

interface ReviewFormProps {
  bookingId: string;
  homestayId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  bookingId,
  homestayId,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (rating < 1 || rating > 5) {
      setError('Rating harus antara 1-5');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: parseInt(rating.toString()),
          comment: comment.trim(),
          homestayId,
          bookingId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengirim review');
      }

      setSuccess(true);
      setComment('');
      setRating(5);

      // Refresh page after 2 seconds
      setTimeout(() => {
        router.refresh();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-green-900">
        <p className="font-semibold">✓ Review berhasil dikirim!</p>
        <p className="text-sm mt-1">Terima kasih atas masukan Anda.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-red-900 text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Rating ({rating}/5)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-transform hover:scale-110 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Komentar Anda <span className="text-stone-500">(Opsional)</span>
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan pengalaman Anda menginap di homestay ini... (opsional)"
          rows={5}
        />
        <p className="text-xs text-stone-500 mt-1">
          {comment.length} / 500
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Mengirim...' : 'Kirim Review'}
      </Button>
    </form>
  );
}
