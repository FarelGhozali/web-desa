import type { Metadata } from 'next';
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

  return (
    <div className="py-16">
      <Container size="lg">
        {/* Photo Gallery */}
        <div className="mb-8">
          <div className="mb-4 h-96 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(220,153,60,0.4),_rgba(220,153,60,0.08))]"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-amber-100/70"></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <article className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl text-stone-900">
            Traditional Dish {slug}
          </h1>
          
          <div className="mb-6 flex items-center gap-4 text-emerald-700">
            <span className="text-2xl font-semibold">Rp 25.000 - Rp 50.000</span>
          </div>

          <div className="prose prose-lg max-w-none text-stone-600">
            <h2>Tentang hidangan ini</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <h2>Bahan utama</h2>
            <ul>
              <li>Traditional spices</li>
              <li>Fresh local vegetables</li>
              <li>Free-range chicken</li>
              <li>Aromatic herbs</li>
            </ul>

            <h2>Tempat mencicipi</h2>
            <p>
              This dish is available at various local warungs (small restaurants) throughout 
              the village. Ask your homestay host for recommendations on the best places to try it.
            </p>
          </div>

          {/* Location */}
          <div className="mt-8">
            <h2 className="mb-4 text-2xl">Lokasi</h2>
            <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 text-stone-500">
              Peta warung akan ditampilkan di sini
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
