import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MapEmbedDisplay from '@/components/MapEmbedDisplay';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Sampaikan pertanyaan seputar homestay, itinerary, atau kolaborasi komunitas bersama Desa Asri.',
};

export default async function ContactPage() {
  // Fetch contact info from database
  const contactInfo = await (prisma as any).contactInfo.findFirst().catch(() => null);
  
  // Parse operating hours
  let operatingHours;
  if (contactInfo?.operatingHours) {
    try {
      operatingHours = JSON.parse(contactInfo.operatingHours);
    } catch {
      operatingHours = null;
    }
  }
  return (
    <div className="bg-gradient-to-br from-[#fff6ec] via-[#e8f5ef] to-[#fffaf3] py-16">
      <Container size="lg" className="space-y-12">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-emerald-800/70">
          <Link href="/" className="transition hover:text-emerald-700">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-emerald-900">Kontak</span>
        </div>

        <div className="text-center space-y-4">
          <Badge className="mx-auto bg-emerald-100/80 text-emerald-900 ring-emerald-300/40">Hubungi kami</Badge>
          <h1 className="text-3xl md:text-4xl text-emerald-950">Kami siap membantu perjalanan desa impian Anda.</h1>
          <p className="mx-auto max-w-2xl text-stone-600">
            Tulis pesan singkat mengenai kebutuhan perjalanan Anda. Tim koordinator desa akan merespon dalam 24 jam
            kerja dengan rekomendasi homestay dan aktivitas terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-white border-stone-200">
              <CardHeader>
                <CardTitle>Kirim pesan</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input label="Nama lengkap" placeholder="Nama Anda" required />
                    <Input type="email" label="Email" placeholder="nama@email.com" required />
                  </div>

                  <Input label="Subjek" placeholder="Contoh: Rencana liburan keluarga" required />

                  <Textarea
                    label="Pesan"
                    placeholder="Ceritakan tanggal perjalanan, jumlah tamu, dan pengalaman yang Anda minati..."
                    rows={6}
                    required
                  />

                  <Button type="submit" size="lg">
                    Kirim pesan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-stone-200">
              <div
                className="pointer-events-none hidden"
                aria-hidden
              />
              <CardHeader className="relative pb-2">
                <CardTitle className="text-emerald-950">Informasi desa</CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-5 text-sm text-stone-700">
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-100/70 bg-white/80 p-4">
                  <span className="mt-1 text-lg text-emerald-700">📧</span>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Email</p>
                    <p className="text-base font-medium text-emerald-900">
                      {contactInfo?.email || 'hello@desaasri.com'}
                    </p>
                    <p className="text-xs text-stone-500">Balas dalam 24 jam kerja</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-100/70 bg-white/80 p-4">
                  <span className="mt-1 text-lg text-emerald-700">☎️</span>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Telepon</p>
                    <p className="text-base font-medium text-emerald-900">
                      {contactInfo?.phone || '+62 123 456 7890'}
                    </p>
                    <p className="text-xs text-stone-500">Senin - Sabtu • 09.00 - 17.00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-100/70 bg-white/80 p-4">
                  <span className="mt-1 text-lg text-emerald-700">📍</span>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Alamat</p>
                    <p className="text-base font-medium text-emerald-900">Balai Desa Asri</p>
                    <p className="text-sm leading-relaxed text-stone-600">
                      {contactInfo?.address || (
                        <>
                          Jl. Persawahan No. 12<br />
                          Kabupaten Ciamis, Jawa Barat
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-stone-200">
              <CardHeader>
                <CardTitle>Jam operasional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-stone-600">
                {operatingHours ? (
                  <>
                    {operatingHours.monday && (
                      <div className="flex justify-between border-b border-stone-200/60 pb-2">
                        <span>Senin</span>
                        <span className={operatingHours.monday.closed ? "font-semibold text-rose-600" : "font-semibold text-emerald-700"}>
                          {operatingHours.monday.closed ? "Tutup" : `${operatingHours.monday.open} - ${operatingHours.monday.close}`}
                        </span>
                      </div>
                    )}
                    {operatingHours.tuesday && (
                      <div className="flex justify-between border-b border-stone-200/60 pb-2">
                        <span>Selasa</span>
                        <span className={operatingHours.tuesday.closed ? "font-semibold text-rose-600" : "font-semibold text-emerald-700"}>
                          {operatingHours.tuesday.closed ? "Tutup" : `${operatingHours.tuesday.open} - ${operatingHours.tuesday.close}`}
                        </span>
                      </div>
                    )}
                    {operatingHours.wednesday && (
                      <div className="flex justify-between border-b border-stone-200/60 pb-2">
                        <span>Rabu</span>
                        <span className={operatingHours.wednesday.closed ? "font-semibold text-rose-600" : "font-semibold text-emerald-700"}>
                          {operatingHours.wednesday.closed ? "Tutup" : `${operatingHours.wednesday.open} - ${operatingHours.wednesday.close}`}
                        </span>
                      </div>
                    )}
                    {operatingHours.thursday && (
                      <div className="flex justify-between border-b border-stone-200/60 pb-2">
                        <span>Kamis</span>
                        <span className={operatingHours.thursday.closed ? "font-semibold text-rose-600" : "font-semibold text-emerald-700"}>
                          {operatingHours.thursday.closed ? "Tutup" : `${operatingHours.thursday.open} - ${operatingHours.thursday.close}`}
                        </span>
                      </div>
                    )}
                    {operatingHours.friday && (
                      <div className="flex justify-between border-b border-stone-200/60 pb-2">
                        <span>Jumat</span>
                        <span className={operatingHours.friday.closed ? "font-semibold text-rose-600" : "font-semibold text-emerald-700"}>
                          {operatingHours.friday.closed ? "Tutup" : `${operatingHours.friday.open} - ${operatingHours.friday.close}`}
                        </span>
                      </div>
                    )}
                    {operatingHours.saturday && (
                      <div className="flex justify-between border-b border-stone-200/60 pb-2">
                        <span>Sabtu</span>
                        <span className={operatingHours.saturday.closed ? "font-semibold text-rose-600" : "font-semibold text-emerald-700"}>
                          {operatingHours.saturday.closed ? "Tutup" : `${operatingHours.saturday.open} - ${operatingHours.saturday.close}`}
                        </span>
                      </div>
                    )}
                    {operatingHours.sunday && (
                      <div className="flex justify-between">
                        <span>Minggu</span>
                        <span className={operatingHours.sunday.closed ? "font-semibold text-rose-600" : "font-semibold text-emerald-700"}>
                          {operatingHours.sunday.closed ? "Tutup" : `${operatingHours.sunday.open} - ${operatingHours.sunday.close}`}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b border-stone-200/60 pb-2">
                      <span>Senin - Jumat</span>
                      <span className="font-semibold text-emerald-700">09.00 - 17.00</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200/60 pb-2">
                      <span>Sabtu</span>
                      <span className="font-semibold text-emerald-700">09.00 - 14.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minggu</span>
                      <span className="font-semibold text-emerald-700">Tutup</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl">Peta desa</h2>
          {contactInfo?.mapsEmbedCode ? (
            <div className="rounded-3xl overflow-hidden border border-emerald-100 bg-white shadow-sm">
              <MapEmbedDisplay embedCode={contactInfo.mapsEmbedCode} className="rounded-3xl" />
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 text-stone-500">
              Peta digital akan ditampilkan di sini
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
