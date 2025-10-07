import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";

const posts = [
  {
    title: "A Dawn Trek with Pak Budi",
    slug: "a-dawn-trek-with-pak-budi",
    excerpt: "Follow the village&apos;s eldest guide on a misty ridge walk and listen to folklore over ginger tea.",
    category: { name: "Culture", slug: "culture" },
    tags: [
      { name: "Guides", slug: "guides" },
      { name: "Trekking", slug: "trekking" },
    ],
  },
  {
    title: "Harvesting Rice the Slow Way",
    slug: "harvesting-rice-the-slow-way",
    excerpt: "Experience a communal harvest day and the songs that keep the rhythm of the sickles.",
    category: { name: "Sustainability", slug: "sustainability" },
    tags: [
      { name: "Farming", slug: "farming" },
      { name: "Community", slug: "community" },
    ],
  },
];

export const metadata: Metadata = {
  title: "Village Journal",
  description: "Read stories from Desa Serenity: homestay hosts, nature guides, culinary artisans, and travelers.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-emerald-950">Village journal</h1>
        <p className="text-emerald-700">
          Articles curated by our storytellers and conservation partners. Filter by category or follow tags to personalize
          your inspiration feed.
        </p>
      </header>

      <section className="grid gap-6">
        {posts.map((post) => (
          <Card
            key={post.slug}
            header={
              <Link href={`/blog/${post.slug}`} className="text-2xl font-semibold text-emerald-950 hover:text-emerald-600">
                {post.title}
              </Link>
            }
            footer={
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-emerald-500">
                <Link href={`/blog/categories/${post.category.slug}`} className="rounded-full bg-emerald-100 px-2 py-1">
                  {post.category.name}
                </Link>
                {post.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/blog/tags/${tag.slug}`}
                    className="rounded-full border border-emerald-200 px-2 py-1"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            }
          >
            <p className="text-sm text-emerald-700">{post.excerpt}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
