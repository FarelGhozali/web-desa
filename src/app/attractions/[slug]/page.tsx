import Image from "next/image";
import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";

const attractionCatalog = {
  "telaga-aurora-waterfall": {
    name: "Telaga Aurora Waterfall",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    description:
      "An hour&apos;s gentle hike brings you to a dreamlike waterfall where morning light refracts into dazzling colors. Local guardians maintain the trail and limit group sizes to preserve the ecosystem.",
    highlights: [
      "Guided by certified eco-interpretation hosts",
      "Herbal tea ceremony by the riverside",
      "Limited to 12 guests per day",
    ],
  },
  "bukit-lembayung-sunrise": {
    name: "Bukit Lembayung Sunrise",
    heroImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    description:
      "Begin before dawn to witness a horizon of golden rice terraces. Sunrise breakfast features heirloom coffee beans and forest honey pancakes prepared by the women&apos;s cooperative.",
    highlights: [
      "Pre-dawn storytelling circle",
      "Bird-watching with binoculars provided",
      "Option to extend to the meditation plateau",
    ],
  },
  "bambu-harmoni-forest": {
    name: "Bambu Harmoni Forest",
    heroImage:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
    description:
      "Explore ancient bamboo corridors while listening to sonic installations created by local musicians. The trail is designed for mindful movement and includes a guided breathing practice.",
    highlights: [
      "Sound bath under the canopy",
      "Handmade bamboo instrument workshop",
      "Forest-to-table picnic",
    ],
  },
};

type AttractionSlug = keyof typeof attractionCatalog;

type AttractionPageProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: AttractionPageProps): Metadata {
  const { slug } = params;
  const attraction = attractionCatalog[slug as AttractionSlug];

  if (!attraction) {
    return {
      title: "Attraction not found",
      description: "We couldn&apos;t locate the requested attraction in Desa Serenity.",
    };
  }

  return {
    title: `${attraction.name} | Desa Serenity Attractions`,
    description: attraction.description,
  };
}

export default function AttractionDetailPage({ params }: AttractionPageProps) {
  const { slug } = params;
  const attraction = attractionCatalog[slug as AttractionSlug];

  if (!attraction) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Card className="mt-10 bg-red-50">
          <h1 className="text-xl font-semibold text-red-700">Experience unavailable</h1>
          <p className="text-sm text-red-600">Try exploring other guided experiences curated by our village collective.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6">
      <section className="space-y-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
          <Image
            src={attraction.heroImage}
            alt={attraction.name}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-emerald-950">{attraction.name}</h1>
          <p className="text-lg text-emerald-700">{attraction.description}</p>
          <ul className="grid gap-3 rounded-3xl bg-emerald-50 p-6 text-sm text-emerald-700 sm:grid-cols-3">
            {attraction.highlights.map((highlight) => (
              <li key={highlight} className="rounded-2xl bg-white/80 p-4">
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card header={<h2 className="text-2xl">Itinerary snapshot</h2>}>
          <ol className="space-y-3 text-sm text-emerald-700">
            <li><strong>05:00</strong> • Meet at the village hall for a safety briefing and herbal tonic.</li>
            <li><strong>06:00</strong> • Guided trail walk with interpretive storytelling.</li>
            <li><strong>07:30</strong> • Highlight moment at the main viewpoint with photography tips.</li>
            <li><strong>08:30</strong> • Community breakfast featuring seasonal produce.</li>
          </ol>
        </Card>
        <Card header={<h2 className="text-2xl">What to prepare</h2>}>
          <ul className="space-y-2 text-sm text-emerald-700">
            <li>• Comfortable shoes, refillable water bottle, eco-friendly sunscreen.</li>
            <li>• Cashless payments via the cooperative&apos;s QR system.</li>
            <li>• Open heart for cultural exchanges and mindful silence moments.</li>
          </ul>
          <p className="mt-4 text-xs text-emerald-500">
            Full equipment list and safety guidelines will be delivered via email once booking integrations are enabled.
          </p>
        </Card>
      </section>
    </div>
  );
}
