import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import Container from '@/components/ui/Container';
import CulinaryForm from '@/components/CulinaryForm';
import Link from 'next/link';

export const metadata = {
  title: 'Tambah Kuliner Baru',
  description: 'Tambahkan kuliner baru ke katalog',
};

export default async function CreateCulinaryPage() {
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
              <Link href="/admin/culinary" className="hover:text-emerald-600">
                Kelola Kuliner
              </Link>
              <span>/</span>
              <span>Tambah Kuliner Baru</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900">Tambah Kuliner Baru</h1>
            <p className="mt-1 text-stone-600">
              Sorot kuliner khas desa yang memperkaya pengalaman wisatawan.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-lg border border-stone-200 bg-white p-8">
            <CulinaryForm mode="create" />
          </div>

          {/* Tips Section */}
          <div className="rounded-lg bg-blue-50 p-6 text-blue-900">
            <h3 className="mb-2 font-semibold">💡 Tips Menambahkan Kuliner</h3>
            <ul className="space-y-1 text-sm">
              <li>• Gunakan nama kuliner yang deskriptif dan menarik</li>
              <li>• Jelaskan cita rasa, bahan khusus, dan keunikan kuliner</li>
              <li>• Sertakan lokasi yang tepat agar mudah ditemukan wisatawan</li>
              <li>• Tambahkan koordinat GPS jika tersedia (latitude/longitude)</li>
              <li>• Tentukan rentang harga untuk membantu wisatawan merencanakan anggaran</li>
              <li>• Gunakan Featured untuk menampilkan kuliner terbaik di halaman utama</li>
            </ul>
          </div>
        </div>
      </Container>
    </AdminLayout>
  );
}
