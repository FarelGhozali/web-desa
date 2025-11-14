import { Metadata } from 'next';
import ContactForm from '@/components/admin/ContactForm';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Pengaturan Kontak - Admin Dashboard',
  description: 'Kelola informasi kontak dan peta untuk halaman kontak publik',
};

export default async function ContactSettingsPage() {
  // Fetch existing contact info
  const contactInfo = await prisma.contactInfo.findFirst();

  // Parse operating hours
  let operatingHours;
  if (contactInfo?.operatingHours) {
    try {
      operatingHours = JSON.parse(contactInfo.operatingHours);
    } catch {
      operatingHours = undefined;
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900">Pengaturan Kontak</h1>
        <p className="mt-2 text-stone-600">Kelola informasi kontak dan peta untuk halaman kontak publik</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ContactForm
          initialData={
            contactInfo
              ? {
                  email: contactInfo.email,
                  phone: contactInfo.phone,
                  address: contactInfo.address,
                  mapsEmbedCode: contactInfo.mapsEmbedCode || undefined,
                  operatingHours,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
