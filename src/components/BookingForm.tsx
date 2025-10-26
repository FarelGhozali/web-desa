'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import AvailabilityStatus from '@/components/AvailabilityStatus';
import AlternativeHomestays from '@/components/AlternativeHomestays';

interface Alternative {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  address: string;
  photos: string[];
  facilities: string[];
}

interface BookingFormProps {
  homestayId: string;
  pricePerNight: number;
  maxGuests: number;
  homestayName: string;
}

export default function BookingForm({
  homestayId,
  pricePerNight,
  maxGuests,
  homestayName,
}: BookingFormProps) {
  const { data: session } = useSession();
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Availability check state
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean | null>(null);
  const [availabilityReason, setAvailabilityReason] = useState<string>();
  const [availabilityMessage, setAvailabilityMessage] = useState<string>();
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, nights * pricePerNight);
  };

  const totalPrice = calculateTotalPrice();

  // Check availability when dates or guest count change
  useEffect(() => {
    if (!checkInDate || !checkOutDate || !numberOfGuests) {
      setAvailabilityStatus(null);
      setAlternatives([]);
      return;
    }

    const checkAvailability = async () => {
      setCheckingAvailability(true);
      try {
        const response = await fetch('/api/homestays/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            homestayId,
            checkInDate: new Date(checkInDate).toISOString(),
            checkOutDate: new Date(checkOutDate).toISOString(),
            numberOfGuests,
          }),
        });

        const data = await response.json();

        setAvailabilityStatus(data.available);
        setAvailabilityReason(data.reason);
        setAvailabilityMessage(data.message);

        // If not available, fetch alternatives
        if (!data.available) {
          try {
            const altResponse = await fetch('/api/homestays/alternatives', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                checkInDate: new Date(checkInDate).toISOString(),
                checkOutDate: new Date(checkOutDate).toISOString(),
                numberOfGuests,
                excludeHomestayId: homestayId,
              }),
            });

            const altData = await altResponse.json();
            setAlternatives(altData.alternatives || []);
          } catch (err) {
            console.error('Error fetching alternatives:', err);
            setAlternatives([]);
          }
        } else {
          setAlternatives([]);
        }
      } catch (err) {
        console.error('Error checking availability:', err);
        setAvailabilityStatus(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    // Debounce the check
    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [checkInDate, checkOutDate, numberOfGuests, homestayId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!session?.user) {
      setError('Silakan login terlebih dahulu untuk melakukan pemesanan');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError('Pilih tanggal check-in dan check-out');
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError('Tanggal check-out harus setelah check-in');
      return;
    }

    if (numberOfGuests < 1 || numberOfGuests > maxGuests) {
      setError(`Jumlah tamu harus antara 1 dan ${maxGuests}`);
      return;
    }

    // Check availability before submitting
    if (availabilityStatus !== true) {
      setError('Silakan pilih tanggal ketika homestay tersedia');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homestayId,
          checkInDate: new Date(checkInDate).toISOString(),
          checkOutDate: new Date(checkOutDate).toISOString(),
          numberOfGuests,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal membuat pemesanan');
      }

      const booking = await response.json();
      setSuccess(true);
      setCheckInDate('');
      setCheckOutDate('');
      setNumberOfGuests(1);

      // Redirect to confirmation page
      setTimeout(() => {
        window.location.href = `/bookings/${booking.id}/confirmation`;
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Booking Card */}
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-stone-900">Pesan {homestayName}</h3>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            ✓ Pemesanan berhasil dibuat! Mengalihkan...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Tanggal Check-in
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Tanggal Check-out
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Jumlah Tamu
            </label>
            <input
              type="number"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={maxGuests}
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <p className="mt-1 text-xs text-stone-500">Maksimal: {maxGuests} tamu</p>
          </div>

          {/* Availability Status */}
          {checkInDate && checkOutDate && (
            <AvailabilityStatus
              available={availabilityStatus}
              reason={availabilityReason}
              message={availabilityMessage}
              isLoading={checkingAvailability}
            />
          )}

          {/* Price Summary */}
          {checkInDate && checkOutDate && (
            <div className="space-y-2 border-t border-stone-200 pt-4">
              <div className="flex justify-between text-sm text-stone-600">
                <span>
                  {Math.ceil(
                    (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  malam × Rp {pricePerNight.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-stone-900">
                <span>Total:</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {session?.user ? (
            <Button
              type="submit"
              disabled={isLoading || !checkInDate || !checkOutDate || availabilityStatus !== true}
              className="w-full"
            >
              {isLoading ? 'Memproses...' : availabilityStatus === false ? 'Tidak Tersedia' : 'Pesan Sekarang'}
            </Button>
          ) : (
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
              <a href="/login" className="font-semibold underline">
                Login terlebih dahulu
              </a>{' '}
              untuk melakukan pemesanan
            </div>
          )}
        </form>
      </div>

      {/* Alternative Homestays */}
      {alternatives.length > 0 && (
        <AlternativeHomestays
          alternatives={alternatives}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          numberOfGuests={numberOfGuests}
        />
      )}
    </div>
  );
}
