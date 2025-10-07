import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Desa Serenity",
  description:
    "Learn about the cooperative behind Desa Serenity, our regenerative tourism mission, and the people who host you.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-emerald-950">About Desa Serenity</h1>
        <p className="text-emerald-700">
          Desa Serenity is a collective of hosts, guides, and artisans who steward the heritage of our mountain village.
          Every booking fuels community-led conservation, cultural education, and regenerative farming initiatives.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-emerald-900">Our story</h2>
        <p className="text-sm text-emerald-700">
          Decades ago, villagers formed a cooperative to protect the sacred river and terraced farms. Today, that same
          spirit powers our tourism model. Hosts are trained in hospitality, storytellers document oral histories, and
          youth collectives lead eco-treks.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-emerald-900">Community impact</h2>
        <ul className="space-y-2 text-sm text-emerald-700">
          <li>• 60% of profits reinvested into micro-farming, education, and reforestation programs.</li>
          <li>• Transparent governance with quarterly village assemblies.</li>
          <li>• Youth mentorship pairing students with artisans, guides, and culinary masters.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-emerald-900">Meet the collective</h2>
        <p className="text-sm text-emerald-700">
          Once the CMS is ready, this space will introduce the people behind your experiences. Expect host profiles,
          artisan spotlights, and program milestones.
        </p>
      </section>
    </section>
  );
}
