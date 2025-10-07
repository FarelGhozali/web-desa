import type { Metadata } from "next";
import Link from "next/link";

const tags = {
  guides: {
    name: "Guides",
    description: "Meet the guides preserving oral histories and caring for Desa Serenity&apos;s trails.",
    posts: [
      {
        title: "A Dawn Trek with Pak Budi",
        slug: "a-dawn-trek-with-pak-budi",
      },
    ],
  },
  trekking: {
    name: "Trekking",
    description: "Routes for slow travelers, sunrise chasers, and mindful hikers.",
    posts: [
      {
        title: "A Dawn Trek with Pak Budi",
        slug: "a-dawn-trek-with-pak-budi",
      },
    ],
  },
  farming: {
    name: "Farming",
    description: "Agricultural practices that honor soil, water, and community.",
    posts: [
      {
        title: "Harvesting Rice the Slow Way",
        slug: "harvesting-rice-the-slow-way",
      },
    ],
  },
  community: {
    name: "Community",
    description: "Stories led by villagers who co-create experiences with travelers.",
    posts: [
      {
        title: "Harvesting Rice the Slow Way",
        slug: "harvesting-rice-the-slow-way",
      },
    ],
  },
};

type TagSlug = keyof typeof tags;

type TagPageProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: TagPageProps): Metadata {
  const { slug } = params;
  const tag = tags[slug as TagSlug];

  if (!tag) {
    return {
      title: "Tag not found",
      description: "We couldn&apos;t find stories for the requested tag.",
    };
  }

  return {
    title: `#${tag.name} Stories | Desa Serenity Journal`,
    description: tag.description,
  };
}

export default function BlogTagPage({ params }: TagPageProps) {
  const { slug } = params;
  const tag = tags[slug as TagSlug];

  if (!tag) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-red-700">Tag unavailable</h1>
        <p className="mt-3 text-sm text-red-600">Return to the journal to continue exploring village stories.</p>
        <Link href="/blog" className="mt-6 inline-block text-sm font-semibold text-emerald-700">
          Back to blog
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-emerald-950">#{tag.name}</h1>
        <p className="text-sm text-emerald-700">{tag.description}</p>
      </header>

      <div className="space-y-6">
        {tag.posts.map((post) => (
          <article key={post.slug} className="space-y-3 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-emerald-900">
              <Link href={`/blog/${post.slug}`} className="hover:text-emerald-600">
                {post.title}
              </Link>
            </h2>
            <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
              Read story
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
