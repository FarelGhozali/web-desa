
import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Jurnal Desa',
  description: 'Kumpulan cerita warga, panduan perjalanan, dan inspirasi hidup sederhana dari Desa Harmoni.',
};


// TODO: Optionally fetch categories from DB if needed
const categories = [
  { label: 'Semua', variant: 'default' as const },
  { label: 'Tips Perjalanan', variant: 'info' as const },
  { label: 'Budaya', variant: 'success' as const },
  { label: 'Kuliner', variant: 'warning' as const },
];

// Server Component
export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
    include: {
      author: true,
      category: true,
    },
  });

  return (
    <div className="py-16">
      <Container className="space-y-10">
        <div className="space-y-4 text-center">
          <Badge className="mx-auto bg-emerald-100/80 text-emerald-900 ring-emerald-300/40">Jurnal Desa</Badge>
          <h1 className="text-3xl md:text-4xl">Cerita yang membuat Anda rindu akan suasana desa.</h1>
          <p className="mx-auto max-w-2xl text-emerald-50">
            Telusuri kisah-kisah warga, rekomendasi aktivitas akhir pekan, hingga resep keluarga yang bisa Anda coba
            sepulang dari sini.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Badge key={category.label} variant={category.variant}>
              {category.label}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card hover className="bg-white">
                {post.coverImage && (
                  <div className="h-48 rounded-3xl overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    <Badge variant={post.category?.slug === 'travel-tips' ? 'info' : post.category?.slug === 'culture' ? 'success' : post.category?.slug === 'food' ? 'warning' : 'default'}>
                      {post.category?.name || 'Lainnya'}
                    </Badge>
                    <span>{post.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription className="text-stone-600">
                    {post.excerpt || post.content.slice(0, 100) + '...'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-3 text-sm text-stone-500">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                    {post.author?.name ? post.author.name[0] : 'A'}
                  </div>
                  <span>Oleh {post.author?.name || 'Admin'}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
