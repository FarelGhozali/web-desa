import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Desa Serenity",
  description: "Understand how Desa Serenity collects and protects your personal information while using our homestay platform.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-emerald-900">Privacy Policy</h1>
      <p className="text-emerald-700">
        This is a placeholder for the privacy policy. Update this page with the village&apos;s data handling practices,
        cookie usage, and contact details for privacy inquiries.
      </p>
    </section>
  );
}
