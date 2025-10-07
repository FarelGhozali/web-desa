import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type BookingSummary = {
  id: string;
  homestay: string;
  slug: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
};

const bookings: Record<"upcoming" | "completed" | "cancelled", BookingSummary[]> = {
  upcoming: [
    {
      id: "booking_1",
      homestay: "Sungai Terrace Homestay",
      slug: "sungai-terrace-homestay",
      checkIn: "2025-05-12",
      checkOut: "2025-05-15",
      guests: 2,
    },
  ],
  completed: [
    {
      id: "booking_2",
      homestay: "Rumah Bambu Pavilion",
      slug: "rumah-bambu-pavilion",
      checkIn: "2025-01-18",
      checkOut: "2025-01-21",
    },
  ],
  cancelled: [],
};

export const metadata: Metadata = {
  title: "Your Stays & Reservations",
  description: "Track upcoming trips, review past stays, and manage Desa Serenity homestay bookings.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-emerald-950">Your dashboard</h1>
        <p className="text-emerald-700">
          Welcome back! Manage your Desa Serenity itineraries, contact hosts, and share reviews to help fellow
          travelers.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card header={<h2 className="text-xl">Upcoming stays</h2>}>
          <div className="space-y-4">
            {bookings.upcoming.length === 0 ? (
              <p className="text-sm text-emerald-600">No upcoming reservations yet. Ready for your next escape?</p>
            ) : (
              bookings.upcoming.map((booking) => (
                <article key={booking.id} className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  <p className="font-semibold text-emerald-900">{booking.homestay}</p>
                  <p>
                    {booking.checkIn} → {booking.checkOut}
                  </p>
                  <p>{booking.guests} guests</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button as="link" href={`/homestays/${booking.slug}`} size="sm">
                      View homestay
                    </Button>
                    <Button variant="ghost" size="sm">
                      Contact host
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </Card>
        <Card header={<h2 className="text-xl">Completed stays</h2>}>
          <div className="space-y-4">
            {bookings.completed.length === 0 ? (
              <p className="text-sm text-emerald-600">Once you complete a stay, it will appear here.</p>
            ) : (
              bookings.completed.map((booking) => (
                <article key={booking.id} className="space-y-2 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  <p className="font-semibold text-emerald-900">{booking.homestay}</p>
                  <p>
                    {booking.checkIn} → {booking.checkOut}
                  </p>
                  <Button variant="ghost" size="sm">
                    Leave a review
                  </Button>
                </article>
              ))
            )}
          </div>
        </Card>
        <Card header={<h2 className="text-xl">Cancelled stays</h2>}>
          {bookings.cancelled.length === 0 ? (
            <p className="text-sm text-emerald-600">No cancellations. We&apos;re glad you&apos;re keeping your plans!</p>
          ) : (
            bookings.cancelled.map((booking) => (
              <article key={booking.id} className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">
                <p className="font-semibold text-emerald-900">{booking.homestay}</p>
                <p>
                  {booking.checkIn} → {booking.checkOut}
                </p>
              </article>
            ))
          )}
        </Card>
      </section>

      <section className="rounded-3xl bg-emerald-100 px-6 py-8 text-emerald-800">
        <h2 className="text-2xl font-semibold">Need to update traveler details?</h2>
        <p className="mt-2 max-w-2xl text-sm">
          Profile management and secure payment vaulting will live here. When NextAuth and payment integrations are
          set up, use this space to connect identities across bookings.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button as="link" href="/homestays" variant="secondary">
            Book another stay
          </Button>
          <Link href="/contact" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
            Chat with our team
          </Link>
        </div>
      </section>
    </div>
  );
}
