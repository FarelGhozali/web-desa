'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

interface ProfileCardProps {
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  bookingsCount: number;
  reviewsCount: number;
}

export default function ProfileCard({
  name,
  email,
  image,
  role,
  createdAt,
  bookingsCount,
  reviewsCount,
}: ProfileCardProps) {
  const joinDate = new Date(createdAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
      {/* Header Section */}
      <div className="mb-8 border-b border-stone-200 pb-8">
        <div className="flex flex-col items-center sm:flex-row sm:gap-6">
          {/* Avatar */}
          <div className="mb-4 sm:mb-0">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {image ? (
                <Image 
                  src={image} 
                  alt={name || 'User'} 
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(name || email)[0].toUpperCase()}</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="mb-1 text-3xl font-bold text-stone-900">{name || 'User'}</h1>
            <p className="mb-3 text-stone-600">{email}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                {role === 'ADMIN' ? '👨‍💼 Admin' : '👤 User'}
              </span>
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                Bergabung {joinDate}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <Link href="/profile/edit">
            <Button>Edit Profile</Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-emerald-50 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-700">{bookingsCount}</p>
          <p className="text-sm text-emerald-600">Pemesanan</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <p className="text-3xl font-bold text-blue-700">{reviewsCount}</p>
          <p className="text-sm text-blue-600">Ulasan</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 text-center">
          <p className="text-3xl font-bold text-purple-700">{role === 'ADMIN' ? '✓' : '-'}</p>
          <p className="text-sm text-purple-600">Verifikasi</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">Informasi Profil</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <span className="text-stone-600">Email:</span>
            <span className="font-medium text-stone-900">{email}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <span className="text-stone-600">Nama:</span>
            <span className="font-medium text-stone-900">{name || '-'}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <span className="text-stone-600">Role:</span>
            <span className="font-medium text-stone-900">{role}</span>
          </div>
          
          <div className="flex justify-between items-center pb-3">
            <span className="text-stone-600">Bergabung:</span>
            <span className="font-medium text-stone-900">{joinDate}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-col gap-2 border-t border-stone-200 pt-6 sm:flex-row">
        <Link href="/bookings" className="flex-1">
          <Button variant="secondary" className="w-full">
            Lihat Pemesanan
          </Button>
        </Link>
        <Link href="/profile/edit" className="flex-1">
          <Button className="w-full">
            Edit Profil
          </Button>
        </Link>
      </div>
    </div>
  );
}
