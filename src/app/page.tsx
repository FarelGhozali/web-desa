import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Live like a Local in Desa Serenity",
  description:
    "Stay in charming homestays, explore hidden waterfalls, taste heirloom recipes, and get inspired by village stories.",
};

const featuredHomestays = [
  {
    name: "Sungai Terrace Homestay",
    price: 68,
    rating: 4.9,
    slug: "sungai-terrace-homestay",
    description: "Riverside rooms with organic breakfasts and sunrise canoe trips.",
  },
  {
    name: "Rumah Bambu Pavilion",
    price: 82,
    rating: 4.8,
    slug: "rumah-bambu-pavilion",
    description: "Handcrafted bamboo villas with private herb gardens.",
  },
  {
    name: "Sawah Sky Retreat",
    price: 95,
    rating: 5.0,
    slug: "sawah-sky-retreat",
    description: "Panoramic rice field views and guided farming experiences.",
  },
];

const highlights = [
  {
    title: "Natural Attractions",
    description: "Hike to emerald waterfalls, sunrise peaks, and hidden bamboo forests led by village guardians.",
    href: "/attractions",
  },
  {
    title: "Village Cuisine",
    description: "Taste ceremonial feasts, age-old fermentation recipes, and farm-to-table experiences.",
    href: "/cuisine",
  },
  {
    title: "Local Stories",
    description: "Read journal entries by villagers, cultural artisans, and eco-guides on our blog.",
    href: "/blog",
  },
];

const latestPosts = [
  {
    title: "A Dawn Trek with Pak Budi",
    category: "Culture",
    slug: "a-dawn-trek-with-pak-budi",
    excerpt: "Follow the village&apos;s eldest guide on a misty ridge walk and listen to folklore over ginger tea.",
  },
  {
    title: "Harvesting Rice the Slow Way",
    category: "Sustainability",
    slug: "harvesting-rice-the-slow-way",
    excerpt: "Experience a communal harvest day and the songs that keep the rhythm of the sickles.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            Village Homestay Collective
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">
            Discover the soul of Desa Serenity through curated homestays and local stories.
          </h1>
          <p className="text-lg text-emerald-800">
            Book authentic stays hosted by villagers, embark on guided nature trips, and savor generations-old recipes.
            Your booking directly supports community-led conservation.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as="link" href="/homestays" size="lg">
              Browse Homestays
            </Button>
            <Button as="link" href="/about" variant="secondary" size="lg">
              Learn about the Village
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-200 via-emerald-300 to-emerald-500 p-8 text-emerald-900 shadow-lg">
          <p className="text-sm uppercase tracking-widest">Why stay with us</p>
          <ul className="mt-6 space-y-4 text-lg font-medium">
            <li>🌱 Regenerative tourism powered by the village cooperative</li>
            <li>🛖 Handpicked homestays with modern comforts</li>
            <li>🍲 Immersive culinary and craft workshops</li>
            <li>🗺️ Personalized itineraries by local guides</li>
          </ul>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-emerald-950">Featured Homestays</h2>
            <p className="text-emerald-700">Intimate stays curated for slow travelers and nature lovers.</p>
          </div>
          <Button as="link" href="/homestays" variant="ghost">
            View all
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredHomestays.map((homestay) => (
            <Card
              key={homestay.slug}
              header={
                <Link href={`/homestays/${homestay.slug}`} className="transition hover:text-emerald-600">
                  {homestay.name}
                </Link>
              }
              footer={
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-emerald-900">${homestay.price}/night</span>
                  <span className="text-emerald-600">⭐ {homestay.rating.toFixed(1)}</span>
                </div>
              }
            >
              <p className="text-sm text-emerald-700">{homestay.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map((highlight) => (
          <Card
            key={highlight.title}
            header={highlight.title}
            footer={
              <Link href={highlight.href} className="font-semibold text-emerald-700 hover:text-emerald-900">
                Explore {highlight.title.toLowerCase()}
              </Link>
            }
          >
            <p className="text-sm text-emerald-700">{highlight.description}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold text-emerald-950">Fresh from the Village Journal</h2>
          <p className="text-emerald-700">Stories, traditions, and travel tips curated by our village writers.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {latestPosts.map((post) => (
            <Card
              key={post.slug}
              header={
                <Link href={`/blog/${post.slug}`} className="text-xl font-semibold text-emerald-900 hover:text-emerald-600">
                  {post.title}
                </Link>
              }
              footer={<span className="text-xs uppercase tracking-wide text-emerald-500">{post.category}</span>}
            >
              <p className="text-sm text-emerald-700">{post.excerpt}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
