import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata: Metadata = {
  title: "Contact Desa Serenity",
  description: "Reach our village collective for booking support, partnership requests, and media inquiries.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-emerald-950">Contact us</h1>
        <p className="text-emerald-700">
          Send us a note for homestay questions, custom itineraries, or collaborative projects. Our community concierge
          will respond within 24 hours on weekdays.
        </p>
        <dl className="grid gap-3 rounded-3xl bg-emerald-50 p-6 text-sm text-emerald-700">
          <div>
            <dt className="font-semibold text-emerald-900">Email</dt>
            <dd>hello@desa-serenity.id</dd>
          </div>
          <div>
            <dt className="font-semibold text-emerald-900">Community centre</dt>
            <dd>Jl. Harmoni No. 5, Desa Serenity, Indonesia</dd>
          </div>
          <div>
            <dt className="font-semibold text-emerald-900">Office hours</dt>
            <dd>Monday – Saturday, 08:00 – 17:00 local time</dd>
          </div>
        </dl>
      </div>

      <form className="space-y-4 rounded-3xl border border-emerald-100 bg-white/70 p-6 shadow-sm">
        <Input label="Full name" name="name" placeholder="Your name" required />
        <Input label="Email" name="email" type="email" placeholder="your@email.com" required />
        <Input label="Phone" name="phone" type="tel" placeholder="Optional" />
        <div>
          <label htmlFor="message" className="text-sm font-medium text-emerald-900">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="mt-2 w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-900 shadow-sm transition placeholder:text-emerald-400 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            placeholder="Share how we can help you plan your journey"
            required
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Send message
        </Button>
        <p className="text-xs text-emerald-500">
          By submitting this form you agree to receive updates about Desa Serenity. You can unsubscribe at any moment.
        </p>
      </form>
    </section>
  );
}
