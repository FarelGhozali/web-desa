
import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Panorama Alam Desa',
  description: 'Susuri air terjun tersembunyi, sawah bertingkat, dan hutan bambu yang menjadi kebanggaan Desa Harmoni.',
};
// Server Component
export default async function AttractionsPage() {
  const attractionsRaw = await prisma.attraction.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
  // Parse JSON fields
  const attractions = attractionsRaw.map((a) => ({
    ...a,
    photos: a.photos ? JSON.parse(a.photos) : [],
  }));

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
          {attractions.map((attraction) => (
            <Link key={attraction.id} href={`/attractions/${attraction.slug}`}>
              <Card hover className="bg-white">
                <div className="relative h-56 overflow-hidden rounded-3xl">
                  {attraction.photos[0] && (
                    <img
                      src={attraction.photos[0]}
                      alt={attraction.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,139,93,0.45),_rgba(34,139,93,0.05))]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-emerald-900/60" />
                  <div className="relative flex h-full flex-col justify-between p-6 text-white">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em]">
                      <span>{attraction.name}</span>
                      <span>{attraction.location}</span>
                    </div>
                    <p className="text-lg font-semibold line-clamp-2">{attraction.description}</p>
                  </div>
                </div>
                <CardHeader className="space-y-3">
                  <CardTitle>{attraction.name}</CardTitle>
                  <CardDescription className="text-stone-600">
                    {attraction.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    <span>📍 {attraction.location}</span>
                    <span>⏱ {attraction.latitude && attraction.longitude ? 'Ada koordinat' : 'Tanpa koordinat'}</span>
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
