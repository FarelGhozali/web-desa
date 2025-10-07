import Image from "next/image";
import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const homestayCatalog = {
  "sungai-terrace-homestay": {
    name: "Sungai Terrace Homestay",
    heroImage:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Wake up to the symphony of the river and enjoy handcrafted breakfast prepared by your host, Ibu Sari. This stay comes with optional bird-watching and canoeing tours led by her son, Putra.",
    amenities: ["Organic breakfast", "River deck", "Wi-Fi", "Local guide", "Firefly tour"],
    price: 68,
    rating: 4.9,
    maxGuests: 4,
    mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=110.342%2C-7.793%2C110.344%2C-7.791&layer=mapnik",
  },
};

type HomestaySlug = keyof typeof homestayCatalog;

type HomestayPageProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: HomestayPageProps): Metadata {
  const { slug } = params;
  const homestay = homestayCatalog[slug as HomestaySlug];

  if (!homestay) {
    return {
      title: "Homestay Not Found",
      description: "We could not find the homestay you are looking for.",
    };
  }

  return {
    title: `${homestay.name} | Desa Serenity Homestay`,
    description: homestay.description,
  };
}

export default function HomestayDetailPage({ params }: HomestayPageProps) {
  const { slug } = params;
  const homestay = homestayCatalog[slug as HomestaySlug];

  if (!homestay) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Card className="mt-10 bg-red-50">
          <h1 className="text-xl font-semibold text-red-700">Homestay unavailable</h1>
          <p className="text-sm text-red-600">
            We couldn&apos;t find the homestay you were looking for. Browse our curated listing instead.
          </p>
          <Button as="link" href="/homestays" className="mt-4" variant="secondary">
            Back to homestays
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src={homestay.heroImage}
              alt={homestay.name}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {homestay.gallery.map((image) => (
              <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={image} alt="Homestay view" fill sizes="(min-width: 768px) 20vw, 45vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <Card
          header={<h1 className="text-3xl font-semibold text-emerald-950">{homestay.name}</h1>}
          footer={<Button as="link" href="#booking" size="lg">Reserve now</Button>}
          className="h-fit"
        >
          <div className="space-y-4 text-sm text-emerald-700">
            <p>{homestay.description}</p>
            <div className="flex items-center gap-3 text-emerald-600">
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold">⭐ {homestay.rating.toFixed(1)}</span>
              <span>{homestay.maxGuests} guests</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-emerald-900">Amenities</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {homestay.amenities.map((amenity) => (
                  <li key={amenity} className="rounded-full bg-emerald-100 px-3 py-1 text-center text-emerald-700">
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-lg font-semibold text-emerald-900">${homestay.price} / night</p>
          </div>
        </Card>
      </section>

      <section id="booking" className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card header={<h2 className="text-2xl">Booking details</h2>}>
          <p className="text-sm text-emerald-700">
            Select your travel dates and guest count. You&apos;ll need to sign in or create an account to confirm your
            booking so we can keep your itinerary and payment details secure.
          </p>
          <form className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input label="Check-in" type="date" name="checkIn" required />
            <Input label="Check-out" type="date" name="checkOut" required />
            <Input label="Guests" type="number" min={1} max={homestay.maxGuests} name="guests" required />
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full" size="lg">
                Continue to sign in
              </Button>
            </div>
          </form>
        </Card>
        <Card header={<h2 className="text-2xl">Availability</h2>}>
          <p className="text-sm text-emerald-700">
            Sync with our live availability calendar once the booking engine is connected. For now, we recommend
            contacting the host for last-minute stays.
          </p>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-emerald-500">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, index) => (
              <div
                key={index}
                className="flex h-12 items-center justify-center rounded-xl bg-emerald-100 text-sm text-emerald-700"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card header={<h2 className="text-2xl">Guest reviews</h2>}>
          <div className="space-y-4 text-sm text-emerald-700">
            <article className="rounded-3xl bg-emerald-50 p-4">
              <p className="font-semibold text-emerald-900">Maya • Stayed March 2025</p>
              <p>We loved sunrise canoeing with Putra and the aromatics of Ibu Sari&apos;s kitchen. Truly heartwarming.</p>
            </article>
            <article className="rounded-3xl bg-emerald-50 p-4">
              <p className="font-semibold text-emerald-900">Alex • Stayed January 2025</p>
              <p>Nature, food, people — perfect harmony. The river lullaby still lives in my mind.</p>
            </article>
          </div>
        </Card>
        <Card header={<h2 className="text-2xl">Map &amp; directions</h2>}>
          <div className="overflow-hidden rounded-2xl">
            <iframe
              src={homestay.mapEmbed}
              title="Homestay map"
              className="h-72 w-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-sm text-emerald-700">
            Reach out to the host for eco-friendly transport options from the main station or airport shuttle.
          </p>
        </Card>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-emerald-100 px-6 py-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-emerald-900">Explore more village stays</h2>
          <p className="text-sm text-emerald-700">Discover other hosted experiences curated by Desa Serenity.</p>
        </div>
        <Button as="link" href="/homestays" variant="secondary">
          View all homestays
        </Button>
      </div>
    </div>
  );
}
