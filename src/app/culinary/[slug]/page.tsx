import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // TODO: Fetch culinary item from database
  return {
    title: `Dish ${slug}`,
    description: 'Discover this authentic traditional dish from our village',
  };
}

export default async function CulinaryDetailPage({ params }: Props) {
  const { slug } = await params;
  // TODO: Fetch culinary item from database by slug
  // const culinary = await prisma.culinary.findUnique({ where: { slug } });
  // if (!culinary) notFound();

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
            Traditional Dish {slug}
          </h1>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-semibold text-blue-600">Rp 25.000 - Rp 50.000</span>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>About this dish</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <h2>Ingredients</h2>
            <ul>
              <li>Traditional spices</li>
              <li>Fresh local vegetables</li>
              <li>Free-range chicken</li>
              <li>Aromatic herbs</li>
            </ul>

            <h2>Where to try</h2>
            <p>
              This dish is available at various local warungs (small restaurants) throughout 
              the village. Ask your homestay host for recommendations on the best places to try it.
            </p>
          </div>

          {/* Location */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Where to find</h2>
            <div className="h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map will be displayed here</p>
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
