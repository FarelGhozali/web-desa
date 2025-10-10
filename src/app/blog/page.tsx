import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Jurnal Desa',
  description: 'Kumpulan cerita warga, panduan perjalanan, dan inspirasi hidup sederhana dari Desa Harmoni.',
};

const categories = [
  { label: 'Semua', variant: 'default' as const },
  { label: 'Tips Perjalanan', variant: 'info' as const },
  { label: 'Budaya', variant: 'success' as const },
  { label: 'Kuliner', variant: 'warning' as const },
];

export default function BlogPage() {
  // TODO: Fetch blog posts from database
  const posts = [1, 2, 3, 4, 5, 6]; // Placeholder

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
          {posts.map((id) => (
            <Link key={id} href={`/blog/post-${id}`}>
              <Card hover className="bg-white">
                <div className="h-48 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(46,127,82,0.4),_rgba(46,127,82,0.05))]" />
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    <Badge variant="info">Tips Perjalanan</Badge>
                    <span>21 Mei 2024</span>
                  </div>
                  <CardTitle>Tiga jalur sepeda favorit warga</CardTitle>
                  <CardDescription className="text-stone-600">
                    Rute sepeda menyusuri pematang sawah, kebun kopi, hingga spot melihat matahari terbenam terbaik.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-3 text-sm text-stone-500">
                  <div className="h-8 w-8 rounded-full bg-emerald-100" />
                  <span>Oleh Tim Pemandu Desa</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
