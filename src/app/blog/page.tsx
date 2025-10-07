import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read about village life, travel tips, cultural insights, and local stories.',
};

export default function BlogPage() {
  // TODO: Fetch blog posts from database
  const posts = [1, 2, 3, 4, 5, 6]; // Placeholder

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Village Stories & Travel Tips
          </h1>
          <p className="text-lg text-gray-600">
            Discover insights about village life, local culture, and travel tips
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="default">All</Badge>
          <Badge variant="info">Travel Tips</Badge>
          <Badge variant="success">Culture</Badge>
          <Badge variant="warning">Food</Badge>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((id) => (
            <Link key={id} href={`/blog/post-${id}`}>
              <Card hover>
                <div className="h-48 bg-gray-300"></div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="info">Travel Tips</Badge>
                    <span className="text-xs text-gray-500">March 15, 2024</span>
                  </div>
                  <CardTitle>Blog Post Title {id}</CardTitle>
                  <p className="text-sm text-gray-600">
                    A compelling excerpt of the blog post that makes readers want to click and read more...
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span>By Admin</span>
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
