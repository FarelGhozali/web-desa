import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // TODO: Fetch post from database
  return {
    title: `Blog Post ${slug}`,
    description: 'Read this insightful article about village life and local culture',
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  // TODO: Fetch post from database by slug
  // const post = await prisma.post.findUnique({ 
  //   where: { slug },
  //   include: { author: true, category: true }
  // });
  // if (!post || !post.published) notFound();

  return (
    <div className="py-16">
      <Container size="md">
        <article className="space-y-10">
          {/* Header */}
          <header className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="info">Tips Perjalanan</Badge>
              <span className="text-sm text-stone-500">15 Maret 2024</span>
            </div>

            <h1 className="text-4xl text-stone-900 md:text-5xl">
              Blog Post Title {slug}
            </h1>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-emerald-100"></div>
              <div>
                <p className="font-medium text-stone-900">Admin Desa</p>
                <p className="text-sm text-stone-500">Pemandu Desa Harmoni</p>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          <div className="h-96 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(46,127,82,0.35),_rgba(46,127,82,0.08))]"></div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-emerald-50">
            <p className="lead">
              This is an engaging introduction to the blog post that captures the reader&apos;s attention 
              and provides a preview of what they&apos;ll learn.
            </p>

            <h2>Understanding Village Life</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <h2>Tips for Visitors</h2>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
              in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <ul>
              <li>Respect local customs and traditions</li>
              <li>Learn a few words in the local language</li>
              <li>Support local businesses</li>
              <li>Be mindful of the environment</li>
            </ul>

            <h2>Conclusion</h2>
            <p>
              Visiting our village is more than just a vacation - it&apos;s an opportunity to 
              connect with nature, experience authentic culture, and create lasting memories.
            </p>
          </div>

          {/* Share Section */}
          <div className="border-t border-stone-200/70 pt-8">
            <p className="mb-4 text-sm text-stone-500">Bagikan artikel ini:</p>
            <div className="flex gap-4 text-sm font-semibold uppercase tracking-[0.3em]">
              <button className="text-emerald-700 transition hover:text-emerald-900">Facebook</button>
              <button className="text-emerald-700 transition hover:text-emerald-900">Instagram</button>
              <button className="text-emerald-700 transition hover:text-emerald-900">WhatsApp</button>
            </div>
          </div>

          {/* Related Posts */}
          <div className="space-y-6">
            <h2 className="text-2xl text-stone-900">Artikel terkait</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Link key={i} href={`/blog/related-post-${i}`} className="group">
                  <div className="mb-3 h-48 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(130,180,90,0.4),_rgba(130,180,90,0.08))] transition-opacity group-hover:opacity-90"></div>
                  <h3 className="text-lg font-semibold text-stone-900 transition-colors group-hover:text-emerald-700">
                    Related Article Title {i}
                  </h3>
                  <p className="mt-2 text-sm text-emerald-50">
                    A brief description of the related article...
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
