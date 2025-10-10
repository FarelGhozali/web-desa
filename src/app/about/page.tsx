import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Tentang Desa Harmoni',
  description: 'Kenali sejarah, budaya, dan gaya hidup masyarakat Desa Harmoni yang menyambut setiap tamu seperti keluarga.',
};

export default function AboutPage() {
  return (
    <div className="py-16">
      <Container size="md" className="space-y-12">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-700 to-amber-600 opacity-80" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0, rgba(255,255,255,0) 55%)' }} />
          <div className="relative flex flex-col gap-6 px-8 py-16 text-white md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-4">
              <Badge className="bg-white/20 text-white ring-white/40">Cerita Desa</Badge>
              <h1 className="text-4xl md:text-5xl">Tentang Desa Harmoni</h1>
              <p className="text-lg text-emerald-50/90">
                Desa kami tumbuh dengan prinsip gotong royong—mengundang tamu untuk ikut menjaga alam, budaya,
                dan kearifan lokal yang diwariskan turun-temurun.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.3em] text-emerald-50">
              Berdiri sejak 1821
            </div>
          </div>
        </div>

        <article className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-3xl">Jejak sejarah yang dijaga</h2>
            <p className="text-lg text-emerald-50">
              Desa Harmoni berdiri di kaki perbukitan yang kaya mata air. Warga generasi awal membuka sawah berteras
              dan menanam pohon pelindung agar sumber air tetap terjaga. Kini, kami tetap memegang teguh adat sambil
              menyambut tamu yang ingin belajar dari alam.
            </p>
          </section>

          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-2xl">Budaya & tradisi</h3>
              <p className="text-emerald-50">
                Setiap minggu, kami mengadakan latihan tari jaipong dan gamelan untuk anak-anak desa. Tamu dapat ikut
                serta mencoba alat musik tradisional atau sekadar menikmati suasana hangat di pendopo.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl">Keindahan alam</h3>
              <p className="text-emerald-50">
                Hamparan sawah, sungai kecil, dan kebun kopi adalah pemandangan sehari-hari kami. Jalur trekking ringan
                tersedia bagi tamu yang ingin mengawali pagi dengan udara segar dan pemandangan matahari terbit.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl">Pariwisata berkelanjutan</h3>
            <p className="text-emerald-50">
              Setiap reservasi homestay menyisihkan dana konservasi untuk menjaga hutan desa, mendukung UMKM perempuan,
              dan membiayai beasiswa anak petani. Kami percaya wisata bisa menjadi jalan untuk saling menguatkan.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl">Bergabunglah dengan keluarga kami</h3>
            <p className="text-emerald-50">
              Kami mengundang Anda merasakan keseharian yang sederhana namun bermakna. Kenali gaya hidup bertani,
              belajar memasak makanan warisan, dan pulang dengan pandangan baru tentang arti kebersamaan.
            </p>
          </section>
        </article>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[{
            value: '200+',
            label: 'Tahun sejarah',
          }, {
            value: '58',
            label: 'Keluarga homestay',
          }, {
            value: '17',
            label: 'Atraksi alam',
          }].map((item) => (
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
