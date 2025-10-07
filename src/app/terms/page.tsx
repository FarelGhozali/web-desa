import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Desa Serenity",
  description: "Review the terms and conditions for booking homestays and using the Desa Serenity portal.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-emerald-900">Terms &amp; Conditions</h1>
      <p className="text-emerald-700">
        This is a placeholder for booking policies, cancellation terms, and other important information that governs the
        use of Desa Serenity.
      </p>
    </section>
  );
}
