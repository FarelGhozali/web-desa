import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Local Cuisine',
  description: 'Discover authentic traditional dishes and the rich culinary heritage of our village.',
};

export default function CulinaryPage() {
  // TODO: Fetch culinary items from database
  const culinaryItems = [1, 2, 3, 4, 5, 6]; // Placeholder

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Local Cuisine
          </h1>
          <p className="text-lg text-gray-600">
            Taste authentic traditional dishes and discover our culinary heritage
          </p>
        </div>

        {/* Culinary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {culinaryItems.map((id) => (
            <Link key={id} href={`/culinary/dish-${id}`}>
              <Card hover>
                <div className="h-64 bg-gray-300"></div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle>Traditional Dish {id}</CardTitle>
                    <Badge variant="info">Popular</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Authentic village recipe passed down through generations
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">📍 Available at local warung</span>
                    <span className="font-semibold text-blue-600">Rp 25.000</span>
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
