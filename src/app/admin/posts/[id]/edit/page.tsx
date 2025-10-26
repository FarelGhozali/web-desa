import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import EditPostPageContent from './content';

export const metadata = {
  title: 'Edit Artikel',
  description: 'Edit artikel blog untuk website',
};

export default async function EditPostPage({ params }: { params: { id: string } }) {
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
    <AdminLayout>
      <EditPostPageContent postId={params.id} />
    </AdminLayout>
  );
}
