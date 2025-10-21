import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { title: true, excerpt: true, coverImage: true },
    });

    if (!post) {
      return {
        title: 'Artikel Tidak Ditemukan',
        description: 'Artikel yang Anda cari tidak tersedia',
      };
    }

    return {
      title: post.title,
      description: post.excerpt || `Baca: ${post.title}`,
      openGraph: {
        type: 'article',
        title: post.title,
        description: post.excerpt || `Baca: ${post.title}`,
        images: post.coverImage ? [{ url: post.coverImage }] : [],
      },
    };
  } catch {
    return {
      title: 'Artikel',
      description: 'Baca artikel menarik tentang desa dan budaya lokal',
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!post || !post.published) {
      notFound();
    }

    return (
      <div className="bg-gradient-to-br from-[#fff6ec] via-[#e9f6ef] to-[#fffaf4] py-16">
        <Container size="md">
          <article className="space-y-10">
            {/* Header */}
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="info">{post.category.name}</Badge>
                <span className="text-sm text-stone-500">
                  {new Date(post.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-stone-900 md:text-5xl">
                {post.title}
              </h1>

              <div className="flex items-center gap-3">
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt={post.author.name || 'Author'}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center font-semibold text-emerald-700">
                    {post.author.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
                <div>
                  <p className="font-medium text-stone-900">{post.author.name || 'Admin'}</p>
                  <p className="text-sm text-stone-500">Penulis</p>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="rounded-3xl overflow-hidden h-96 bg-stone-200">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Content - Rendered as HTML from RichTextEditor */}
            <div
              className="prose prose-lg max-w-none text-stone-800 prose-headings:text-stone-900 prose-p:text-stone-800 prose-strong:text-stone-900 prose-a:text-emerald-600 prose-a:underline hover:prose-a:text-emerald-700 prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Section */}
            <div className="border-t border-stone-200/70 pt-8">
              <p className="mb-4 text-sm text-stone-500">Bagikan artikel ini:</p>
              <div className="flex gap-4 text-sm font-semibold uppercase tracking-[0.3em]">
                <button className="text-emerald-700 transition hover:text-emerald-900">Facebook</button>
                <button className="text-emerald-700 transition hover:text-emerald-900">Instagram</button>
                <button className="text-emerald-700 transition hover:text-emerald-900">WhatsApp</button>
              </div>
            </div>

            {/* Back Link */}
            <div className="pt-4 border-t border-stone-200/70">
              <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 underline text-sm font-medium">
                ← Kembali ke semua artikel
              </Link>
            </div>
          </article>
        </Container>
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}
