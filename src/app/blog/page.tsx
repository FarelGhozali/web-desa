
import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
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
    <div className="bg-gradient-to-br from-[#fff6ec] via-[#e9f6ef] to-[#fffaf4] py-16">
      <Container className="space-y-12">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-emerald-800/70">
          <Link href="/" className="transition hover:text-emerald-700">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-emerald-900">Jurnal Desa</span>
        </div>

        <div className="space-y-4 text-center">
          <Badge className="mx-auto bg-emerald-100/80 text-emerald-900 ring-emerald-300/40">Jurnal Desa</Badge>
          <h1 className="text-3xl md:text-4xl text-emerald-950">Cerita yang membuat Anda rindu akan suasana desa.</h1>
          <p className="mx-auto max-w-2xl text-stone-600">
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
                  <div className="relative h-48 overflow-hidden rounded-3xl">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      unoptimized
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

        <div className="grid gap-6 rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-sm md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-emerald-950">Dapatkan cerita desa langsung melalui email</h2>
            <p className="text-sm leading-relaxed text-stone-600">
              Kami kirimkan highlight bulanan berisi update homestay baru, agenda budaya, dan resep favorit warga.
              Tidak ada spam—hanya kabar baik dari desa.
            </p>
          </div>
          <form className="grid gap-3 text-sm text-stone-600">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm text-stone-700 focus:border-emerald-400 focus:outline-none"
              required
            />
            <Button type="submit" fullWidth>
              Daftar buletin desa
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
