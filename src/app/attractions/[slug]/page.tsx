import type { Metadata } from 'next';
import Container from '@/components/ui/Container';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // TODO: Fetch attraction from database
  return {
    title: `Attraction ${slug}`,
    description: 'Discover the natural beauty of this amazing location',
  };
}

export default async function AttractionDetailPage({ params }: Props) {
  const { slug } = await params;
  // TODO: Fetch attraction from database by slug
  // const attraction = await prisma.attraction.findUnique({ where: { slug } });

  return (
    <div className="py-16">
      <Container size="lg">
        {/* Photo Gallery */}
        <div className="mb-8">
          <div className="mb-4 h-96 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(47,127,82,0.35),_rgba(47,127,82,0.05))]"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-emerald-100/70"></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <article className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl text-stone-900">
            Attraction {slug}
          </h1>
          
          <div className="mb-6 flex items-center gap-4 text-stone-600">
            <span>📍 Kawasan desa</span>
          </div>

          <div className="prose prose-lg max-w-none text-stone-600">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
              in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="mt-8">
            <h2 className="mb-4 text-2xl">Lokasi</h2>
            <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 text-stone-500">
              Peta akan ditampilkan di sini
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
