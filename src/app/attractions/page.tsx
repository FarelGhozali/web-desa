import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";

const attractions = [
  {
    name: "Telaga Aurora Waterfall",
    slug: "telaga-aurora-waterfall",
    summary: "A cascade hidden behind a bamboo forest with natural rock pools for a refreshing dip.",
  },
  {
    name: "Bukit Lembayung Sunrise",
    slug: "bukit-lembayung-sunrise",
    summary: "Panoramic sunrise trek with traditional breakfast served by the hiking collective.",
  },
  {
    name: "Bambu Harmoni Forest",
    slug: "bambu-harmoni-forest",
    summary: "Guided meditation walks under century-old bamboo groves.",
  },
];

export const metadata: Metadata = {
  title: "Natural Attractions",
  description: "Plan eco-friendly adventures around Desa Serenity with curated trails, waterfalls, and scenic peaks.",
};

export default function AttractionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-emerald-950">Natural attractions</h1>
        <p className="max-w-2xl text-emerald-700">
          Guided by villagers trained in eco-interpretation, every journey is mindful of the land and its stories. Choose
          an experience suited to your curiosity and pace.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {attractions.map((attraction) => (
          <Card
            key={attraction.slug}
            header={
              <Link href={`/attractions/${attraction.slug}`} className="text-xl font-semibold text-emerald-950 hover:text-emerald-600">
                {attraction.name}
              </Link>
            }
            footer={
              <Link href={`/attractions/${attraction.slug}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                View full guide
              </Link>
            }
          >
            <p className="text-sm text-emerald-700">{attraction.summary}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
