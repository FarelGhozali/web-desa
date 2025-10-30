import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Tentang Desa Harmoni',
  description: 'Kenali sejarah, budaya, dan gaya hidup masyarakat Desa Harmoni yang menyambut setiap tamu seperti keluarga.',
};

export default async function AboutPage() {
  // Fetch counts from the database (server-side)
  const [homestayCount, attractionCount] = await Promise.all([
    prisma.homestay.count({ where: { published: true } }),
    prisma.attraction.count({ where: { published: true } }),
  ]);

  const stats = [
    {
      value: '200+',
      label: 'Tahun sejarah',
    },
    {
      value: String(homestayCount ?? 0),
      label: 'Homestay',
    },
    {
      value: String(attractionCount ?? 0),
      label: 'Attractions',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#fff6ec] via-[#e9f6ef] to-[#fffaf4] py-16">
      <Container size="md" className="space-y-12">
        <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-800/70">
          <Link href="/" className="transition hover:text-emerald-700">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-emerald-900">Tentang Kami</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-emerald-100/60 bg-white/90 shadow-[0_28px_96px_-64px_rgba(15,118,110,0.45)]">
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle at 18% 18%, rgba(84,146,110,0.18) 0, rgba(84,146,110,0) 55%), radial-gradient(circle at 82% 8%, rgba(254,202,123,0.22) 0, rgba(254,202,123,0) 50%)' }} />
          <div className="relative flex flex-col gap-6 px-8 py-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-4">
              <Badge className="bg-emerald-100/80 text-emerald-900 ring-emerald-300/40">Cerita Desa</Badge>
              <h1 className="text-4xl md:text-5xl text-emerald-950">Tentang Desa Harmoni</h1>
              <p className="text-lg leading-relaxed text-stone-600">
                Desa kami tumbuh dengan prinsip gotong royong—mengundang tamu untuk ikut menjaga alam, budaya,
                dan kearifan lokal yang diwariskan turun-temurun.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white/70 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Berdiri sejak 1821
            </div>
          </div>
        </div>

        <article className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-3xl text-emerald-950">Jejak sejarah yang dijaga</h2>
            <p className="text-lg leading-relaxed text-stone-600">
              Desa Harmoni berdiri di kaki perbukitan yang kaya mata air. Warga generasi awal membuka sawah berteras
              dan menanam pohon pelindung agar sumber air tetap terjaga. Kini, kami tetap memegang teguh adat sambil
              menyambut tamu yang ingin belajar dari alam.
            </p>
          </section>

          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-2xl text-emerald-900">Budaya & tradisi</h3>
              <p className="text-stone-600">
                Setiap minggu, kami mengadakan latihan tari jaipong dan gamelan untuk anak-anak desa. Tamu dapat ikut
                serta mencoba alat musik tradisional atau sekadar menikmati suasana hangat di pendopo.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl text-emerald-900">Keindahan alam</h3>
              <p className="text-stone-600">
                Hamparan sawah, sungai kecil, dan kebun kopi adalah pemandangan sehari-hari kami. Jalur trekking ringan
                tersedia bagi tamu yang ingin mengawali pagi dengan udara segar dan pemandangan matahari terbit.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl text-emerald-900">Pariwisata berkelanjutan</h3>
            <p className="text-stone-600">
              Setiap reservasi homestay menyisihkan dana konservasi untuk menjaga hutan desa, mendukung UMKM perempuan,
              dan membiayai beasiswa anak petani. Kami percaya wisata bisa menjadi jalan untuk saling menguatkan.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl text-emerald-900">Bergabunglah dengan keluarga kami</h3>
            <p className="text-stone-600">
              Kami mengundang Anda merasakan keseharian yang sederhana namun bermakna. Kenali gaya hidup bertani,
              belajar memasak makanan warisan, dan pulang dengan pandangan baru tentang arti kebersamaan.
            </p>
          </section>
        </article>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-3xl bg-emerald-50/80 p-8 text-center">
              <p className="text-4xl font-semibold text-emerald-800">{item.value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{item.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
