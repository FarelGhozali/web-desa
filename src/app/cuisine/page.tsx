import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";

const culinarySpots = [
  {
    name: "Dapur Ibu Sari",
    slug: "dapur-ibu-sari",
    summary: "Home-cooked degustation of river fish, heirloom rice, and wildflower salads.",
  },
  {
    name: "Kopi Lembayung Roastery",
    slug: "kopi-lembayung-roastery",
    summary: "Sample micro-lot beans roasted on bamboo charcoal with barista-led cupping sessions.",
  },
  {
    name: "Pasar Malam Culinary Walk",
    slug: "pasar-malam-culinary-walk",
    summary: "Night food tour featuring artisanal snacks, fermented beverages, and storytelling kiosks.",
  },
];

export const metadata: Metadata = {
  title: "Local Cuisine & Food Experiences",
  description: "Taste Desa Serenity through communal kitchens, specialty roasteries, and guided night markets.",
};

export default function CuisinePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-emerald-950">Local cuisine</h1>
        <p className="max-w-2xl text-emerald-700">
          Our culinary programs celebrate ancestral recipes and ingredients cultivated through regenerative farming.
          Reserve a tasting or workshop to support the village kitchen cooperative.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {culinarySpots.map((experience) => (
          <Card
            key={experience.slug}
            header={
              <Link href={`/cuisine/${experience.slug}`} className="text-xl font-semibold text-emerald-950 hover:text-emerald-600">
                {experience.name}
              </Link>
            }
            footer={
              <Link href={`/cuisine/${experience.slug}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                View experience
              </Link>
            }
          >
            <p className="text-sm text-emerald-700">{experience.summary}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
