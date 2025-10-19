import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import Container from '@/components/ui/Container';
import CreatePostForm from '@/components/CreatePostForm';
import Link from 'next/link';

export const metadata = {
  title: 'Buat Artikel Baru',
  description: 'Buat artikel blog baru untuk website',
};

export default async function CreatePostPage() {
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
      <Container>
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-stone-600">
              <Link href="/admin/posts" className="hover:text-emerald-600">
                Kelola Artikel
              </Link>
              <span>/</span>
              <span>Buat Artikel Baru</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900">Buat Artikel Baru</h1>
            <p className="mt-1 text-stone-600">
              Tulis artikel blog yang inspiratif dan informatif untuk menarik calon tamu.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-lg border border-stone-200 bg-white p-8">
            <CreatePostForm />
          </div>

          {/* Tips Section */}
          <div className="rounded-lg bg-blue-50 p-6 text-blue-900">
            <h3 className="mb-2 font-semibold">💡 Tips Menulis Artikel yang SEO-Friendly</h3>
            <ul className="space-y-1 text-sm">
              <li>• Gunakan judul yang menarik dan mengandung keyword utama</li>
              <li>• Tulis ringkasan (excerpt) yang deskriptif untuk preview</li>
              <li>• Gunakan gambar cover berkualitas tinggi untuk menarik perhatian</li>
              <li>• Buat konten minimal 300 kata untuk hasil SEO yang optimal</li>
              <li>• Gunakan kategori yang relevan untuk organisasi konten</li>
              <li>• Publikasikan saat konten sudah siap (jangan draft terlalu lama)</li>
            </ul>
          </div>
        </div>
      </Container>
    </AdminLayout>
  );
}
