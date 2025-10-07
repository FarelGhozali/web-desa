import type { Metadata } from "next";
import Link from "next/link";

const postCatalog = {
  "a-dawn-trek-with-pak-budi": {
    title: "A Dawn Trek with Pak Budi",
    excerpt: "Follow the village&apos;s eldest guide on a misty ridge walk and listen to folklore over ginger tea.",
    content: [
      {
        heading: "Preparing for the climb",
        paragraph:
          "Pak Budi greets each traveler with a woven sash that symbolizes safe passage. Before the trek begins, he shares rituals taught by his grandmother who once guided traders between villages.",
      },
      {
        heading: "Songs along the ridge",
        paragraph:
          "As first light appears, we walk in rhythm to humming led by the youth choir. The melodies echo across the valley, a gentle reminder that the land remembers stories through song.",
      },
      {
        heading: "Breakfast at the summit",
        paragraph:
          "At sunrise, ginger tea and palm sugar cakes are served. Pak Budi explains how the recipes change with the seasons and why gratitude is offered to the four cardinal winds.",
      },
    ],
    category: { name: "Culture", slug: "culture" },
    tags: [
      { name: "Guides", slug: "guides" },
      { name: "Trekking", slug: "trekking" },
    ],
  },
  "harvesting-rice-the-slow-way": {
    title: "Harvesting Rice the Slow Way",
    excerpt: "Experience a communal harvest day and the songs that keep the rhythm of the sickles.",
    content: [
      {
        heading: "Morning dew on the terraces",
        paragraph:
          "The harvest begins before sunrise, with farmers inspecting the grains for readiness. Each terrace carries generations of craftsmanship, maintained by families who share the workload and the joy.",
      },
      {
        heading: "Rhythms of the sickles",
        paragraph:
          "Cutting the rice is accompanied by percussive chants. The sound helps coordinate movements and ensures that the pace protects the roots for regeneration.",
      },
      {
        heading: "Feast of gratitude",
        paragraph:
          "After the harvest, everyone gathers for a communal meal featuring steamed rice, young jackfruit curry, and sambal made from stone-ground chilies.",
      },
    ],
    category: { name: "Sustainability", slug: "sustainability" },
    tags: [
      { name: "Farming", slug: "farming" },
      { name: "Community", slug: "community" },
    ],
  },
};

type BlogSlug = keyof typeof postCatalog;

type BlogPostPageProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const { slug } = params;
  const post = postCatalog[slug as BlogSlug];

  if (!post) {
    return {
      title: "Story not found",
      description: "We couldn&apos;t locate the requested story from Desa Serenity.",
    };
  }

  return {
    title: `${post.title} | Desa Serenity Journal`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = postCatalog[slug as BlogSlug];

  if (!post) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-red-700">Story unavailable</h1>
        <p className="mt-4 text-sm text-red-600">Return to the journal to browse our latest writings.</p>
        <Link href="/blog" className="mt-6 inline-block text-sm font-semibold text-emerald-700">
          Back to the Village Journal
        </Link>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-emerald-500">
          <Link href={`/blog/categories/${post.category.slug}`} className="hover:text-emerald-700">
            {post.category.name}
          </Link>
        </p>
        <h1 className="text-4xl font-bold text-emerald-950">{post.title}</h1>
        <p className="text-lg text-emerald-700">{post.excerpt}</p>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-emerald-500">
          {post.tags.map((tag) => (
            <Link key={tag.slug} href={`/blog/tags/${tag.slug}`} className="rounded-full bg-emerald-100 px-3 py-1">
              #{tag.name}
            </Link>
          ))}
        </div>
      </header>

      <div className="space-y-8 text-lg leading-relaxed text-emerald-800">
        {post.content.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-2xl font-semibold text-emerald-900">{section.heading}</h2>
            <p>{section.paragraph}</p>
          </section>
        ))}
      </div>

      <footer className="rounded-3xl bg-emerald-50 p-6 text-sm text-emerald-700">
        <p>
          Want to experience this story firsthand? Explore our curated stays and itineraries designed by villagers.
        </p>
        <Link href="/homestays" className="mt-3 inline-block font-semibold text-emerald-700 hover:text-emerald-900">
          Browse homestays
        </Link>
      </footer>
    </article>
  );
}
