import { Metadata } from 'next';
import AdminLayout from '@/components/layout/AdminLayout';
import ContactForm from '@/components/admin/ContactForm';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Pengaturan Kontak - Admin Dashboard',
  description: 'Kelola informasi kontak dan peta untuk halaman kontak publik',
};

export default async function ContactSettingsPage() {
  // Fetch existing contact info
  const contactInfo = await prisma.contactInfo.findFirst();

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold text-stone-900">Pengaturan Kontak</h1>
        <ContactForm
          initialData={
            contactInfo
              ? {
                  email: contactInfo.email,
                  phone: contactInfo.phone,
                  address: contactInfo.address,
                  mapsEmbedCode: contactInfo.mapsEmbedCode || undefined,
                }
              : undefined
          }
        />
      </div>
    </AdminLayout>
  );
}
