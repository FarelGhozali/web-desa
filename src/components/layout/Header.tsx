import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import HeaderContent from './HeaderContent';

export default async function Header() {
  const session = await getServerSession(authOptions);
  let userName: string | null = null;
  let userEmail: string | null = null;
  let isLoggedIn = false;
  const isLoading = false;

  if (session?.user?.id) {
    isLoggedIn = true;
    userEmail = session.user.email || null;

    try {
      // Fetch latest user data dari database, bukan dari session
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true },
      });

      if (user) {
        userName = user.name;
        userEmail = user.email;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback ke session data jika ada error
      userName = session.user.name || null;
    }
  }

  return (
    <HeaderContent
      isLoggedIn={isLoggedIn}
      userName={userName}
      userEmail={userEmail}
      isLoading={isLoading}
    />
  );
}
