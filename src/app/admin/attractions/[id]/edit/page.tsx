import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import EditAttractionPageContent from './content';

export const metadata = {
  title: 'Edit Destinasi Wisata',
  description: 'Edit destinasi wisata di katalog',
};

export default async function EditAttractionPage({ params }: { params: { id: string } }) {
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
      <EditAttractionPageContent attractionId={params.id} />
    </AdminLayout>
  );
}
