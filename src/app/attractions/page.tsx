import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Panorama Alam Desa',
  description: 'Susuri air terjun tersembunyi, sawah bertingkat, dan hutan bambu yang menjadi kebanggaan Desa Harmoni.',
};

export default function AttractionsPage() {
  // TODO: Fetch attractions from database
  const attractions = [1, 2, 3, 4, 5, 6]; // Placeholder

  return (
    <div className="py-16">
      <Container className="space-y-10">
        <div className="space-y-4 text-center">
          <Badge className="mx-auto bg-emerald-100/80 text-emerald-900 ring-emerald-300/50">Panorama Alam</Badge>
          <h1 className="text-3xl md:text-4xl">Jelajahi kekayaan alam yang kami jaga bersama.</h1>
          <p className="mx-auto max-w-2xl text-emerald-50">
            Setiap jalur trekking dan destinasi alam kami rawat bersama kelompok warga. Ajak pemandu lokal untuk
            mengetahui cerita dan legenda yang menyertai setiap sudut desa.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {attractions.map((id) => (
            <Link key={id} href={`/attractions/attraction-${id}`}>
              <Card hover className="bg-white">
                <div className="relative h-56 overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,139,93,0.45),_rgba(34,139,93,0.05))]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-emerald-900/60" />
                  <div className="relative flex h-full flex-col justify-between p-6 text-white">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em]">
                      <span>Wisata {id}</span>
                      <span>Guide lokal</span>
                    </div>
                    <p className="text-lg font-semibold">Lembah Bambu Angin</p>
                  </div>
                </div>
                <CardHeader className="space-y-3">
                  <CardTitle>Keasrian alam yang menenangkan</CardTitle>
                  <CardDescription className="text-stone-600">
                    Ikuti jalur bambu hingga air terjun mini tersembunyi. Sesi teh serai hangat menanti di akhir tur.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    <span>📍 5 km dari balai desa</span>
                    <span>⏱ 2 jam</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
