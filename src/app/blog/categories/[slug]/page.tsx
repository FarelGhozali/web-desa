import type { Metadata } from "next";
import Link from "next/link";

const categories = {
  culture: {
    name: "Culture",
    description: "Stories celebrating rituals, arts, and guardians of Desa Serenity.",
    posts: [
      {
        title: "A Dawn Trek with Pak Budi",
        slug: "a-dawn-trek-with-pak-budi",
        excerpt: "Follow the village&apos;s eldest guide on a misty ridge walk and listen to folklore over ginger tea.",
      },
    ],
  },
  sustainability: {
    name: "Sustainability",
    description: "Articles exploring regenerative farming, conservation, and eco-friendly travel.",
    posts: [
      {
        title: "Harvesting Rice the Slow Way",
        slug: "harvesting-rice-the-slow-way",
        excerpt: "Experience a communal harvest day and the songs that keep the rhythm of the sickles.",
      },
    ],
  },
};

type CategorySlug = keyof typeof categories;

type CategoryPageProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const { slug } = params;
  const category = categories[slug as CategorySlug];

  if (!category) {
    return {
      title: "Category not found",
      description: "We couldn&apos;t find the requested story category.",
    };
  }

  return {
    title: `${category.name} Stories | Desa Serenity Journal`,
    description: category.description,
  };
}

export default function BlogCategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = categories[slug as CategorySlug];

  if (!category) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-red-700">Category unavailable</h1>
        <p className="mt-3 text-sm text-red-600">Please browse all journal entries to continue your exploration.</p>
        <Link href="/blog" className="mt-6 inline-block text-sm font-semibold text-emerald-700">
          Back to blog
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-emerald-950">{category.name}</h1>
        <p className="text-sm text-emerald-700">{category.description}</p>
      </header>

      <div className="space-y-6">
        {category.posts.map((post) => (
          <article key={post.slug} className="space-y-3 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-emerald-900">
              <Link href={`/blog/${post.slug}`} className="hover:text-emerald-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-emerald-700">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
              Read story
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
