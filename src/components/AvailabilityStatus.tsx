'use client';

interface AvailabilityStatusProps {
  available: boolean | null;
  reason?: string;
  message?: string;
  isLoading?: boolean;
}

export default function AvailabilityStatus({
  available,
  reason,
  message,
  isLoading,
}: AvailabilityStatusProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
          <p className="text-sm font-medium text-blue-700">Memeriksa ketersediaan...</p>
        </div>
      </div>
    );
  }

  if (available === null) {
    return null;
  }

  if (available) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white">
                <span className="text-sm font-bold">✓</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-900">Kamar Tersedia</p>
            <p className="mt-0.5 text-xs text-green-700">
              {message || 'Homestay tersedia untuk tanggal yang dipilih'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white">
          <span className="text-sm font-bold">✕</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-red-900">
            {reason === 'GUEST_LIMIT_EXCEEDED' ? 'Kapasitas Penuh' : 'Tidak Tersedia'}
          </p>
          <p className="mt-0.5 text-xs text-red-700">
            {message || 'Homestay tidak tersedia untuk tanggal yang dipilih'}
          </p>
        </div>
      </div>
    </div>
  );
}
