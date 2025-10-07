import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Sampaikan pertanyaan seputar homestay, itinerary, atau kolaborasi komunitas bersama Desa Harmoni.',
};

export default function ContactPage() {
  return (
    <div className="py-16">
      <Container size="lg" className="space-y-12">
        <div className="text-center space-y-4">
          <Badge className="mx-auto bg-emerald-100/80 text-emerald-900 ring-emerald-300/40">Hubungi kami</Badge>
          <h1 className="text-3xl md:text-4xl">Kami siap membantu perjalanan desa impian Anda.</h1>
          <p className="mx-auto max-w-2xl text-stone-600">
            Tulis pesan singkat mengenai kebutuhan perjalanan Anda. Tim koordinator desa akan merespon dalam 24 jam
            kerja dengan rekomendasi homestay dan aktivitas terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-white">
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
            <Card className="bg-gradient-to-br from-emerald-600/10 via-white to-emerald-100/40">
              <CardHeader>
                <CardTitle>Informasi desa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-stone-700">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Email</p>
                  <p>hello@villagestay.com</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Telepon</p>
                  <p>+62 123 456 7890</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Alamat</p>
                  <p>
                    Balai Desa Harmoni<br />
                    Jl. Persawahan No. 12<br />
                    Kabupaten Ciamis, Jawa Barat
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Jam operasional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-stone-600">
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
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl">Peta desa</h2>
          <div className="flex h-96 items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 text-stone-500">
            Peta digital akan ditampilkan di sini
          </div>
        </div>
      </Container>
    </div>
  );
}
