import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Natural Attractions',
  description: 'Explore the breathtaking natural beauty of our village. Discover waterfalls, rice terraces, and hidden gems.',
};

export default function AttractionsPage() {
  // TODO: Fetch attractions from database
  const attractions = [1, 2, 3, 4, 5, 6]; // Placeholder

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Natural Attractions
          </h1>
          <p className="text-lg text-gray-600">
            Explore the breathtaking natural beauty and hidden gems of our village
          </p>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((id) => (
            <Link key={id} href={`/attractions/attraction-${id}`}>
              <Card hover>
                <div className="h-64 bg-gray-300"></div>
                <CardHeader>
                  <CardTitle>Attraction {id}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Beautiful natural landscape worth visiting
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>📍 5 km from village center</span>
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
