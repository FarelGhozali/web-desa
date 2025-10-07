import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
  // if (!attraction) notFound();

  return (
    <div className="py-12">
      <Container size="lg">
        {/* Photo Gallery */}
        <div className="mb-8">
          <div className="h-96 bg-gray-300 rounded-lg mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Attraction {slug}
          </h1>
          
          <div className="flex items-center gap-4 mb-8 text-gray-600">
            <span>📍 Village Area</span>
          </div>

          <div className="prose prose-lg max-w-none">
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
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <div className="h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map will be displayed here</p>
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
