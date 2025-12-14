import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import Container from '@/components/ui/Container';
import ProfileCard from '@/components/ProfileCard';

export const metadata: Metadata = {
  title: 'Profil Saya',
  description: 'Lihat dan kelola profil akun Anda',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          bookings: true,
          reviews: true,
          posts: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <ProfileCard
            name={user.name}
            email={user.email}
            image={user.image}
            role={user.role}
            createdAt={user.createdAt.toISOString()}
            bookingsCount={user._count.bookings}
            reviewsCount={user._count.reviews}
          />
        </div>
      </Container>
    </div>
  );
}
