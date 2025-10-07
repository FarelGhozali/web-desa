import Link from 'next/link';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 md:py-32">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Experience Authentic Village Life
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Stay in traditional homestays, explore natural beauty, and taste authentic local cuisine
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/homestays">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Browse Homestays
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Homestays */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Homestays
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carefully selected accommodations for an authentic village experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Placeholder for featured homestays */}
            {[1, 2, 3].map((i) => (
              <Card key={i} hover>
                <div className="h-48 bg-gray-300"></div>
                <CardHeader>
                  <CardTitle>Homestay {i}</CardTitle>
                  <p className="text-sm text-gray-600">Beautiful traditional house</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-blue-600">Rp 250.000/night</span>
                    <Link href={`/homestays/homestay-${i}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/homestays">
              <Button variant="outline" size="lg">
                View All Homestays
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Attractions & Culinary Preview */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Attractions */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Natural Attractions
              </h2>
              <p className="text-gray-600 mb-6">
                Explore breathtaking landscapes, waterfalls, rice terraces, and hidden gems in our village.
              </p>
              <Link href="/attractions">
                <Button variant="outline">
                  Discover Attractions
                </Button>
              </Link>
            </div>

            {/* Culinary */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Local Cuisine
              </h2>
              <p className="text-gray-600 mb-6">
                Taste authentic traditional dishes and discover the rich culinary heritage of our village.
              </p>
              <Link href="/culinary">
                <Button variant="outline">
                  Explore Cuisine
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read about village life, travel tips, and local insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Placeholder for blog posts */}
            {[1, 2, 3].map((i) => (
              <Card key={i} hover>
                <div className="h-48 bg-gray-300"></div>
                <CardHeader>
                  <CardTitle>Blog Post {i}</CardTitle>
                  <p className="text-sm text-gray-600">
                    A short excerpt of the blog post content goes here...
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Read More Articles
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience Village Life?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Book your stay today and create unforgettable memories
            </p>
            <Link href="/homestays">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Book Now
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
