import { Metadata } from 'next';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import HomestayForm from '@/components/admin/HomestayForm';

export const metadata: Metadata = {
  title: 'Tambah Homestay - Admin',
  description: 'Tambahkan homestay baru ke website',
};

export default function NewHomestayPage() {
  return (
    <div className="space-y-6">
        <AdminPageHeader
          title="Tambah Homestay Baru"
          description="Isi semua informasi untuk membuat homestay baru yang siap dipromosikan."
        />

        <HomestayForm />
    </div>
  );
}
