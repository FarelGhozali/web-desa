import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Homestays',
  description: 'Browse our collection of authentic village homestays. Find the perfect place to stay and experience local life.',
};

export default function HomestaysPage() {
  // TODO: Fetch homestays from database
  const homestays = [1, 2, 3, 4, 5, 6]; // Placeholder

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Homestays
          </h1>
          <p className="text-lg text-gray-600">
            Discover comfortable and authentic accommodations in our village
          </p>
        </div>

        {/* Filter Section - TODO: Implement filters */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Filters coming soon...</p>
        </div>

        {/* Homestay Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homestays.map((id) => (
            <Card key={id} hover>
              <div className="h-48 bg-gray-300"></div>
              <CardHeader>
                <CardTitle>Homestay {id}</CardTitle>
                <p className="text-sm text-gray-600">
                  Beautiful traditional house with modern amenities
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>👤 Max 4 guests</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold text-blue-600">
                      Rp 250.000/night
                    </span>
                    <Link href={`/homestays/homestay-${id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
