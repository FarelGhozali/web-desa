import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ slug: string }>;
};

type AttractionData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  photos: string;
  featured: boolean;
  published: boolean;
  latitude: number | null;
  longitude: number | null;
  mapsEmbedCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  
  let attraction: AttractionData | null = null;
  let photos: string[] = [];
  
  try {
    const result = await prisma.attraction.findUnique({
      where: { slug },
    });
    
    if (result) {
      attraction = result as AttractionData;
    }
    
    if (attraction?.photos) {
      try {
        photos = JSON.parse(attraction.photos);
        if (!Array.isArray(photos)) {
          photos = [];
        }
      } catch {
        console.warn('Failed to parse photos JSON for attraction:', slug);
        photos = [];
      }
    }
  } catch (error) {
    console.error('Error fetching attraction:', error);
  }

  const displayName = attraction?.name || attractionName;
  const description = attraction?.description || 'Nikmati pesona alam, budaya, dan keramahan warga desa yang menyejukkan hati.';
  

  return (
    <div className="bg-gradient-to-br from-[#fef7ec] via-[#edf6f1] to-[#fffaf2] pb-20 pt-12">
      <Container size="lg">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Photo Gallery */}
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/70">
            <div className="relative mb-6 h-96 overflow-hidden rounded-2xl">
              {photos.length > 0 ? (
                <Image
                  src={photos[0]}
                  alt={`${displayName} - Hero`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 100vw, 85vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-emerald-200 to-emerald-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-white/15 px-5 py-1 text-xs font-semibold uppercase tracking-widest">
                  Atraksi unggulan
                </span>
                <div>
                  <h1 className="text-3xl font-semibold leading-tight drop-shadow-lg sm:text-4xl">
                    {displayName}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm drop-shadow-md text-white/95">
                    {description}
                  </p>
                </div>
              </div>
            </div>
            {photos.length > 1 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {photos.slice(1).map((photo: string, index: number) => (
                  <div
                    key={index + 1}
                    className="relative h-24 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/70"
                  >
                    <Image
                      src={photo}
                      alt={`${displayName} - Foto ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}
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

            {/* Lokasi: only render when admin provided an embed code */}
            {attraction?.mapsEmbedCode && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-stone-900">Lokasi</h3>
                <p className="text-sm text-stone-600">
                  Peta interaktif akan membantu Anda menemukan rute terbaik menuju {displayName}.
                </p>
                <div className="rounded-3xl overflow-hidden border border-emerald-100 bg-white shadow-sm">
                  <div
                    className="w-full h-96"
                    dangerouslySetInnerHTML={{ __html: attraction.mapsEmbedCode }}
                  />
                </div>
              </div>
            )}
          </article>
        </div>
      </Container>
    </div>
  );
}