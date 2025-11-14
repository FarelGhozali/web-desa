import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import EditCulinaryPageContent from './content';

export const metadata = {
  title: 'Edit Kuliner',
  description: 'Edit kuliner di katalog',
};

export default async function EditCulinaryPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Check if user is admin
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <>
      <EditCulinaryPageContent culinaryId={params.id} />
    </>
  );
}
