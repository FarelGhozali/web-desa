import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import Container from '@/components/ui/Container';
import EditProfileForm from '@/components/EditProfileForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edit Profil',
  description: 'Sunting informasi profil akun Anda',
};

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          {/* Back Button */}
          <Link
            href="/profile"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Kembali ke Profil
          </Link>

          <EditProfileForm
            initialName={user.name}
            initialImage={user.image}
            email={user.email}
          />
        </div>
      </Container>
    </div>
  );
}
