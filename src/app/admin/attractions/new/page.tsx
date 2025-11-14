import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Container from '@/components/ui/Container';
import AttractionForm from '@/components/AttractionForm';
import Link from 'next/link';

export const metadata = {
  title: 'Tambah Destinasi Wisata Baru',
  description: 'Tambahkan destinasi wisata baru ke katalog',
};

export default async function CreateAttractionPage() {
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
      <Container>
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-stone-600">
              <Link href="/admin/attractions" className="hover:text-emerald-600">
                Kelola Destinasi Wisata
              </Link>
              <span>/</span>
              <span>Tambah Destinasi Baru</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900">Tambah Destinasi Wisata Baru</h1>
            <p className="mt-1 text-stone-600">
              Kurasi destinasi unggulan untuk memberikan pengalaman lokal autentik kepada wisatawan.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-lg border border-stone-200 bg-white p-8">
            <AttractionForm mode="create" />
          </div>

          {/* Tips Section */}
          <div className="rounded-lg bg-blue-50 p-6 text-blue-900">
            <h3 className="mb-2 font-semibold">💡 Tips Menambahkan Destinasi Wisata</h3>
            <ul className="space-y-1 text-sm">
              <li>• Gunakan nama destinasi yang deskriptif dan menarik</li>
              <li>• Jelaskan atraksi utama, aktivitas, dan pengalaman unik yang ditawarkan</li>
              <li>• Sertakan informasi praktis seperti jam operasional dan harga tiket (jika ada)</li>
              <li>• Tambahkan lokasi yang tepat agar mudah ditemukan wisatawan</li>
              <li>• Masukkan koordinat GPS jika tersedia (latitude/longitude)</li>
              <li>• Gunakan Featured untuk menampilkan destinasi terbaik di halaman utama</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
