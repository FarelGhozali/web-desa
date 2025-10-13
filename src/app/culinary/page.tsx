
import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Kuliner Desa',
  description: 'Cicipi hidangan warisan keluarga Desa Harmoni yang dimasak dari bahan-bahan segar hasil kebun sendiri.',
};
// Server Component
export default async function CulinaryPage() {
  const culinaryRaw = await prisma.culinary.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
  // Parse JSON fields
  const culinaryItems = culinaryRaw.map((c) => ({
    ...c,
    photos: c.photos ? JSON.parse(c.photos) : [],
  }));

  return (
    <div className="py-16">
      <Container className="space-y-10">
        <div className="space-y-4 text-center">
          <Badge className="mx-auto bg-amber-100/80 text-amber-900 ring-amber-300/40">Warisan Rasa</Badge>
          <h1 className="text-3xl md:text-4xl">Resep rumahan yang diwariskan, siap dinikmati setiap tamu.</h1>
          <p className="mx-auto max-w-2xl text-emerald-50">
            Dari sarapan bubur gurih hingga jamuan makan malam bersama keluarga host, setiap hidangan dimasak dari hasil
            kebun, kolam, dan kebun rempah warga sendiri.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {culinaryItems.map((item) => (
            <Link key={item.id} href={`/culinary/${item.slug}`}>
              <Card hover className="bg-white">
                <div className="relative h-56 overflow-hidden rounded-3xl">
                  {item.photos[0] && (
                    <Image
                      src={item.photos[0]}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,153,60,0.45),_rgba(220,153,60,0.05))]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/10 to-stone-900/50" />
                  <div className="relative flex h-full flex-col justify-between p-6 text-white">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-amber-100/80">
                      <span>{item.name}</span>
                      <Badge className="bg-white/20 text-white ring-white/30">Favorit</Badge>
                    </div>
                    <p className="text-lg font-semibold line-clamp-2">{item.description}</p>
                  </div>
                </div>
                <CardHeader className="space-y-3">
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription className="text-stone-600">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm text-stone-600">
                  <span>📍 {item.location}</span>
                  <span className="font-semibold text-emerald-700">{item.priceRange || '-'}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
