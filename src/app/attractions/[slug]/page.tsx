import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import MapEmbedDisplay from '@/components/MapEmbedDisplay';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ slug: string }>;
};

const formatSlugToTitle = (value: string): string =>
  value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const attraction = await prisma.attraction.findUnique({
      where: { slug },
    });

    if (attraction) {
      return {
        title: `${attraction.name} | Atraksi Desa Wisata`,
        description: attraction.description.substring(0, 160),
      };
    }
  } catch (error) {
    console.error('Error fetching attraction for metadata:', error);
  }

  const attractionName = formatSlugToTitle(slug);
  return {
    title: `${attractionName} | Atraksi Desa Wisata`,
    description: `Jelajahi ${attractionName} dan temukan pengalaman alam terbaik di desa wisata kami.`,
  };
}

export default async function AttractionDetailPage({ params }: Props) {
  const { slug } = await params;
  const attractionName = formatSlugToTitle(slug);
  
  let attraction = null;
  try {
    attraction = await prisma.attraction.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error('Error fetching attraction:', error);
  }

  const displayName = attraction?.name || attractionName;
  const description = attraction?.description || 'Nikmati pesona alam, budaya, dan keramahan warga desa yang menyejukkan hati.';
  const location = attraction?.location || 'Kawasan desa wisata';

  return (
    <div className="bg-gradient-to-br from-[#fef7ec] via-[#edf6f1] to-[#fffaf2] pb-20 pt-12">
      <Container size="lg">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Photo Gallery */}
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/70">
            <div className="relative mb-6 h-96 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-emerald-200 to-emerald-100" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(47,127,82,0.55),_transparent_65%)]" />
              <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-white/15 px-5 py-1 text-xs font-semibold uppercase tracking-widest">
                  Atraksi unggulan
                </span>
                <div>
                  <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                    {displayName}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm text-white/90">
                    {description}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-24 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50/70 text-xs font-semibold uppercase tracking-widest text-emerald-600"
                >
                  Foto {i}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <article className="space-y-10 rounded-3xl border border-emerald-100 bg-white p-8 shadow-md shadow-emerald-100/70 lg:p-12">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full bg-emerald-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Jelajah desa wisata
              </span>
              <h2 className="text-3xl font-semibold text-stone-900 sm:text-4xl">
                {displayName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1">
                  <span aria-hidden="true">📍</span>
                  {location}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1">
                  <span aria-hidden="true">🌿</span>
                  Panorama alami
                </span>
              </div>
            </div>

            <div className="space-y-6 text-base leading-relaxed text-stone-700">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-stone-900">Lokasi</h3>
              <p className="text-sm text-stone-600">
                Peta interaktif akan membantu Anda menemukan rute terbaik menuju {displayName}.
              </p>
              {attraction?.mapsEmbedCode ? (
                <MapEmbedDisplay embedCode={attraction.mapsEmbedCode} className="rounded-3xl" />
              ) : (
                <div className="rounded-3xl overflow-hidden border border-emerald-100 bg-white shadow-sm">
                  <div className="flex h-96 items-center justify-center rounded-2xl border-dashed border-emerald-300 bg-emerald-50/60 text-sm font-medium text-emerald-600">
                    Peta akan ditampilkan di sini
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </Container>
    </div>
  );
}
