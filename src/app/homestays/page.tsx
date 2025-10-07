import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const homestays = [
  {
    name: "Sungai Terrace Homestay",
    slug: "sungai-terrace-homestay",
    price: 68,
    rating: 4.9,
    guests: 4,
    amenities: ["River deck", "Organic breakfast", "Guided canoe"],
  },
  {
    name: "Rumah Bambu Pavilion",
    slug: "rumah-bambu-pavilion",
    price: 82,
    rating: 4.8,
    guests: 3,
    amenities: ["Bamboo bath", "Herb garden", "Cooking class"],
  },
  {
    name: "Sawah Sky Retreat",
    slug: "sawah-sky-retreat",
    price: 95,
    rating: 5.0,
    guests: 5,
    amenities: ["Panoramic deck", "Farmer walk", "Private bonfire"],
  },
];

export const metadata: Metadata = {
  title: "Homestay Collection",
  description:
    "Browse authentic Desa Serenity homestays, compare amenities, and choose the stay that matches your travel style.",
};

export default function HomestaysPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-emerald-950">Homestays</h1>
        <p className="max-w-2xl text-emerald-700">
          Every homestay is hosted by villagers who champion regenerative tourism. Choose a stay that matches your
          rhythm and supports community-led conservation.
        </p>
        <form className="grid gap-4 rounded-3xl border border-emerald-100 bg-white/70 p-4 sm:grid-cols-4">
          <Input name="search" label="Find a stay" placeholder="Search by name or vibe" className="sm:col-span-2" />
          <Input name="checkIn" label="Check-in" type="date" />
          <Input name="checkOut" label="Check-out" type="date" />
          <Button type="submit" className="sm:self-end">
            Update results
          </Button>
        </form>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {homestays.map((homestay) => (
          <Card
            key={homestay.slug}
            header={
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link href={`/homestays/${homestay.slug}`} className="text-xl font-semibold text-emerald-950 hover:text-emerald-600">
                    {homestay.name}
                  </Link>
                  <p className="text-sm text-emerald-600">Up to {homestay.guests} guests</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  ⭐ {homestay.rating.toFixed(1)}
                </span>
              </div>
            }
            footer={
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-emerald-900">${homestay.price} / night</span>
                <Button as="link" href={`/homestays/${homestay.slug}`} variant="ghost">
                  View details
                </Button>
              </div>
            }
          >
            <ul className="space-y-1 text-sm text-emerald-700">
              {homestay.amenities.map((amenity) => (
                <li key={amenity}>• {amenity}</li>
              ))}
            </ul>
          </Card>
        ))}
      </section>
    </div>
  );
}
