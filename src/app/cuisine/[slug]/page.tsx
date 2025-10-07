import Image from "next/image";
import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";

const culinaryCatalog = {
  "dapur-ibu-sari": {
    name: "Dapur Ibu Sari",
    heroImage:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80",
    description:
      "A communal kitchen where Ibu Sari and her apprentice chefs reinterpret village recipes with ingredients from regenerative farms.",
    menu: [
      "Smoked river fish with tamarind flowers",
      "Heritage turmeric rice wrapped in banana leaves",
      "Wildflower salad with bamboo shoots",
    ],
  },
  "kopi-lembayung-roastery": {
    name: "Kopi Lembayung Roastery",
    heroImage:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80",
    description:
      "The village roastery sources beans from terraced coffee gardens and roasts them on bamboo charcoal ovens.",
    menu: [
      "Honey-processed espresso flight",
      "Cascara tonic with forest herbs",
      "Latte art and cupping workshop",
    ],
  },
  "pasar-malam-culinary-walk": {
    name: "Pasar Malam Culinary Walk",
    heroImage:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
    description:
      "Stroll through the night market alongside storytellers who reveal the history of beloved snacks and fermented tonics.",
    menu: [
      "Charcoal-grilled sticky rice balls",
      "Spiced palm sugar beverages",
      "Fermented cassava fritters",
    ],
  },
};

type CulinarySlug = keyof typeof culinaryCatalog;

type CulinaryPageProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: CulinaryPageProps): Metadata {
  const { slug } = params;
  const culinary = culinaryCatalog[slug as CulinarySlug];

  if (!culinary) {
    return {
      title: "Experience not found",
      description: "We couldn&apos;t locate the requested culinary experience.",
    };
  }

  return {
    title: `${culinary.name} | Desa Serenity Cuisine`,
    description: culinary.description,
  };
}

export default function CulinaryDetailPage({ params }: CulinaryPageProps) {
  const { slug } = params;
  const culinary = culinaryCatalog[slug as CulinarySlug];

  if (!culinary) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Card className="mt-10 bg-red-50">
          <h1 className="text-xl font-semibold text-red-700">Experience unavailable</h1>
          <p className="text-sm text-red-600">Try another culinary journey hosted by our village kitchen collective.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6">
      <section className="space-y-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
          <Image
            src={culinary.heroImage}
            alt={culinary.name}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-emerald-950">{culinary.name}</h1>
          <p className="text-lg text-emerald-700">{culinary.description}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card header={<h2 className="text-2xl">Signature tastings</h2>}>
          <ul className="space-y-2 text-sm text-emerald-700">
            {culinary.menu.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-emerald-500">Full seasonal menu will be synced once the CMS is connected.</p>
        </Card>
        <Card header={<h2 className="text-2xl">Community impact</h2>}>
          <p className="text-sm text-emerald-700">
            15% of every booking is invested into the village seed bank and culinary apprenticeship scholarships. Your
            tasting session sustains dignified livelihoods for kitchen artisans.
          </p>
        </Card>
      </section>
    </div>
  );
}
