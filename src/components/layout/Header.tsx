import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import HeaderContent from './HeaderContent';

export default async function Header() {
  const session = await getServerSession(authOptions);
  let userName: string | null = null;
  let userEmail: string | null = null;
  let isLoggedIn = false;

  if (session?.user?.id) {
    isLoggedIn = true;
    // Fallback pertama: gunakan nama dan email dari session
    userName = session.user.name || null;
    userEmail = session.user.email || null;

    try {
      // Fetch latest user data dari database tanpa cache
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true },
      });

      if (user?.name) {
        // Hanya update jika name ada di database
        userName = user.name;
      }
      if (user?.email) {
        userEmail = user.email;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Tetap gunakan fallback session jika ada error
    }
  }

  return (
    <HeaderContent
      isLoggedIn={isLoggedIn}
      userName={userName}
      userEmail={userEmail}
    />
  );
}
