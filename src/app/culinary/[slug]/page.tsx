import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Culinary } from '@prisma/client';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import MapEmbedDisplay from '@/components/MapEmbedDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { prisma } from '@/lib/prisma';

type PageParams = {
  params: { slug: string };
};

type CulinaryWithPhotos = Culinary & { photos: string[] };

async function getCulinaryBySlug(slug: string): Promise<CulinaryWithPhotos | null> {
  const culinary = await prisma.culinary.findUnique({ where: { slug } });
  if (!culinary || !culinary.published) {
    return null;
  }

  let parsedPhotos: string[] = [];
  if (culinary.photos) {
    try {
      const raw = JSON.parse(culinary.photos);
      parsedPhotos = Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string' && item.length > 0) : [];
    } catch {
      parsedPhotos = [];
    }
  }

  return {
    ...culinary,
    photos: parsedPhotos,
  };
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = params;
  const culinary = await getCulinaryBySlug(slug);

  if (!culinary) {
    return {
      title: 'Kuliner Desa',
      description: 'Jelajahi beragam kuliner khas Desa Asri.',
    };
  }

  return {
    title: `${culinary.name} | Kuliner Desa Asri`,
    description: culinary.description.slice(0, 155),
  };
}

export default async function CulinaryDetailPage({ params }: PageParams) {
  const { slug } = params;
  const culinary = await getCulinaryBySlug(slug);

  if (!culinary) {
    notFound();
  }

  const [primaryPhoto, ...secondaryPhotos] = culinary.photos;
  const descriptionParagraphs = culinary.description
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const [summaryParagraph, ...detailParagraphs] = descriptionParagraphs;

  return (
    <div className="bg-gradient-to-br from-[#fff6ec] via-[#eef6ef] to-[#fffaf3] py-16">
      <Container size="lg" className="space-y-12">
        <nav aria-label="Jejak lokasi" className="flex flex-wrap items-center gap-2 text-sm text-emerald-800/80">
          <Link href="/" className="transition hover:text-emerald-900">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/culinary" className="transition hover:text-emerald-900">
            Kuliner
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-emerald-950">{culinary.name}</span>
        </nav>

        <article className="space-y-12" aria-labelledby="culinary-title">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="warning">Khas Desa</Badge>
              {culinary.featured && <Badge variant="success">Favorit Tuan Rumah</Badge>}
            </div>
            <div className="space-y-3">
              <h1 id="culinary-title" className="text-3xl font-semibold text-emerald-950 sm:text-4xl">
                {culinary.name}
              </h1>
              <p className="max-w-3xl text-base text-stone-600 sm:text-lg">
                {summaryParagraph ?? culinary.description}
              </p>
            </div>
          </header>

          <section aria-labelledby="gallery-heading" className="space-y-6">
            <h2 id="gallery-heading" className="sr-only">
              Galeri foto {culinary.name}
            </h2>
            <figure className="relative overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_top,_rgba(220,153,60,0.35),_rgba(33,118,90,0.1))]">
              {primaryPhoto ? (
                <Image
                  src={primaryPhoto}
                  alt={`Tampilan hidangan ${culinary.name}`}
                  width={1280}
                  height={720}
                  priority
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  unoptimized
                />
              ) : (
                <div className="flex min-h-[320px] items-center justify-center px-6 py-20 text-center text-sm font-medium text-emerald-900/70">
                  Foto hidangan akan segera tersedia.
                </div>
              )}
              <figcaption className="sr-only">{`Penampilan utama dari ${culinary.name}`}</figcaption>
            </figure>

            {secondaryPhotos.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" role="list">
                {secondaryPhotos.slice(0, 4).map((photo, index) => (
                  <figure
                    key={photo}
                    role="listitem"
                    className="relative overflow-hidden rounded-2xl bg-emerald-100/40"
                  >
                    <Image
                      src={photo}
                      alt={`Detail ${culinary.name} foto ${index + 2}`}
                      width={400}
                      height={300}
                      className="h-28 w-full object-cover sm:h-32"
                      sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
                      unoptimized
                    />
                  </figure>
                ))}
              </div>
            )}
          </section>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <section aria-labelledby="story-heading" className="space-y-6">
              <h2 id="story-heading" className="text-2xl font-semibold text-emerald-900">
                Cerita Rasa
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-stone-700">
                {detailParagraphs.length > 0
                  ? detailParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  : (
                    <p>
                      Sajian khas desa ini dibuat dari bahan-bahan segar pilihan warga setempat. Tanyakan pada host Anda
                      untuk merasakan pengalaman menyantapnya langsung bersama keluarga desa.
                    </p>
                  )}
              </div>
            </section>

            <aside aria-labelledby="info-heading" className="space-y-6">
              <Card>
                <CardHeader className="space-y-2">
                  <Badge className="w-fit">Informasi penting</Badge>
                  <CardTitle id="info-heading">Rangkuman</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4 text-sm text-stone-700">
                    <div className="flex flex-col gap-1">
                      <dt className="font-semibold text-emerald-900">Rentang harga</dt>
                      <dd className="text-base font-semibold text-emerald-700">
                        {culinary.priceRange ?? 'Hubungi host untuk detail harga' }
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="font-semibold text-emerald-900">Tempat terbaik</dt>
                      <dd>{culinary.location}</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="font-semibold text-emerald-900">Tips host</dt>
                      <dd>
                        Nikmati bersama sambal dan lalapan segar pada sore hari setelah berkeliling desa.
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="bg-emerald-600 text-white">
                <CardHeader className="space-y-2">
                  <CardTitle>Siap mencicipi?</CardTitle>
                  <p className="text-sm text-white/80">
                    Hubungi host Anda atau tim Village Stay untuk memesan pengalaman kuliner pribadi.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
                  >
                    Hubungi tim Village Stay
                  </Link>
                  <Link
                    href="/homestays"
                    className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Temukan homestay terdekat
                  </Link>
                </CardContent>
              </Card>
            </aside>
          </div>

          <section aria-labelledby="map-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="map-heading" className="text-2xl font-semibold text-emerald-900">
                Peta dan rute
              </h2>
              <span className="text-sm text-stone-500">Koordinat: {culinary.latitude ?? '-'}, {culinary.longitude ?? '-'}</span>
            </div>
            {culinary.mapsEmbedCode ? (
              <MapEmbedDisplay embedCode={culinary.mapsEmbedCode} className="rounded-3xl" />
            ) : (
              <div className="rounded-3xl overflow-hidden border border-emerald-100 bg-white shadow-sm">
                <div
                  className="flex h-96 items-center justify-center bg-emerald-50/60 text-center text-sm text-stone-500"
                  role="img"
                  aria-label={`Peta lokasi ${culinary.location}`}
                >
                  Peta interaktif akan ditampilkan di sini.
                </div>
              </div>
            )}
          </section>
        </article>
      </Container>
    </div>
  );
}
