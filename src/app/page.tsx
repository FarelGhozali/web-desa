import Link from 'next/link';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const highlightFeatures = [
  {
    icon: '🏡',
    title: 'Stay with Local Families',
    description: 'Wake up to the aroma of freshly steamed rice and stories shared over morning coffee.',
  },
  {
    icon: '🌿',
    title: 'Hands-on Experiences',
    description: 'Join farmers in the fields, learn traditional crafts, and cook over wood-fired stoves.',
  },
  {
    icon: '🪕',
    title: 'Culture & Warmth',
    description: 'Feel the rhythm of village music, evening fireflies, and heartfelt community gatherings.',
  },
];

const experienceHighlights = [
  {
    icon: '🌅',
    title: 'Dawn Terraces Walk',
    blurb: 'Follow our guides through emerald rice terraces and misty hillsides at sunrise.',
  },
  {
    icon: '🥥',
    title: 'Coconut Harvest',
    blurb: 'Climb with local farmers, collect fresh coconuts, and enjoy sweet kelapa muda together.',
  },
  {
    icon: '🔥',
    title: 'Night Bonfire Tales',
    blurb: 'Gather around the fire for storytelling, traditional songs, and starlit skies.',
  },
];

const weekendSchedule = [
  {
    icon: '🌾',
    title: 'Sabtu pagi',
    description: 'Panen sayur organik & workshop memasak lalapan khas desa.',
  },
  {
    icon: '🚣',
    title: 'Sabtu sore',
    description: 'Susur sungai dengan perahu bambu ditemani anak-anak desa.',
  },
  {
    icon: '🌙',
    title: 'Minggu malam',
    description: 'Api unggun, jagung bakar, dan pertunjukan angklung.',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0, rgba(255,255,255,0) 55%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.2) 0, rgba(255,255,255,0) 40%)',
          }}
        />
        <Container className="relative py-20 md:py-28">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="space-y-8 text-emerald-50">
              <Badge className="bg-white/15 text-white ring-white/30">Desa Harmoni, Jawa Barat</Badge>
              <div className="space-y-6">
                <h1 className="text-4xl leading-tight md:text-6xl">
                  Rasakan hangatnya hidup di pedesaan, langsung dari sumbernya.
                </h1>
                <p className="text-lg text-emerald-100/90 md:text-xl">
                  Menginap di homestay nyaman milik warga, belajar dari alam, dan pulang dengan cerita yang tak
                  terlupakan.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/homestays">
                  <Button size="lg">Cari Homestay</Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                    Kenali Desa Kami
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
                {[{ label: 'Keluarga tuan rumah', value: '58+' }, { label: 'Pengalaman autentik', value: '24' }, { label: 'Rekomendasi tamu', value: '97%' }].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/10 p-4">
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-100/80">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-full bg-emerald-600/30 blur-3xl md:block" />
              <div className="absolute -right-16 bottom-8 hidden h-40 w-40 rounded-full bg-amber-400/40 blur-3xl md:block" />
              <Card className="relative border-white/10 bg-white/10 text-white shadow-2xl">
                <div className="h-56 bg-gradient-to-br from-emerald-700/40 via-emerald-500/30 to-amber-400/30 backdrop-blur-sm">
                  <div className="flex h-full items-end justify-between px-6 py-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/80">
                        Panorama Desa
                      </p>
                      <p className="text-lg font-semibold">Bukit Cempaka</p>
                    </div>
                    <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
                      Sunrise
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">Jadwal tur desa</CardTitle>
                  <CardDescription className="text-emerald-100/80">
                    06.00 Trekking sawah • 10.00 Membatik • 18.30 Api unggun & cerita rakyat
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-emerald-100/80">
                    <p>“Keluarga Bu Sari membuat kami serasa tinggal dengan saudara sendiri.”</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/20" />
                      <div>
                        <p className="text-sm font-semibold text-white">Rina & Adi</p>
                        <p className="text-xs text-emerald-100/70">Jakarta • Menginap 3 malam</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Mengapa memilih kami</p>
            <h2 className="mt-4 text-3xl md:text-4xl">
              Setiap perjalanan adalah kolaborasi hangat antara tamu dan warga desa.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {highlightFeatures.map((feature) => (
              <Card key={feature.title} hover className="bg-white">
                <CardHeader className="flex flex-col gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                    {feature.icon}
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-stone-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Homestays */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdf8f1] via-[#f1e1c8] to-[#e0caa4]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.65),transparent_55%)]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(37,88,58,0.18),transparent_60%)]" aria-hidden />
        <Container className="relative">
          <div className="flex flex-col gap-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Rekomendasi warga</p>
            <h2 className="text-3xl md:text-4xl text-emerald-900">Homestay pilihan dengan keramahan khas pedesaan.</h2>
            <p className="mx-auto max-w-2xl text-stone-600">
              Semua homestay kami kurasi langsung bersama warga untuk memastikan kenyamanan, kebersihan, dan
              pengalaman autentik.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} hover className="bg-white/90 backdrop-blur">
                <div className="relative h-56 overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,121,66,0.45),_rgba(79,121,66,0.08))]" />
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-6">
                    <div className="rounded-2xl bg-white/90 p-4 text-stone-800 shadow-lg">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                        Homestay {i}
                      </p>
                      <p className="text-lg font-semibold">Rumah Kayu Lembah Padi</p>
                      <p className="text-xs text-stone-500">Dusun Sumber Rejeki</p>
                    </div>
                  </div>
                </div>
                <CardContent>
                  <div className="space-y-4 text-sm text-stone-600">
                    <ul className="space-y-2">
                      {[ 'Sarapan dari kebun sendiri', '2 kamar tidur', 'Air panas' ].map((perk) => (
                        <li key={perk} className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            ✔
                          </span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between text-stone-700">
                      <span className="text-lg font-semibold text-emerald-700">Rp 280.000 / malam</span>
                      <Link
                        href={`/homestays/homestay-${i}`}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 transition hover:bg-emerald-700 hover:text-white"
                      >
                        Lihat Detail →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/homestays">
              <Button variant="outline" size="lg">
                Lihat semua homestay
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Experiences */}
      <section>
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Pengalaman khas desa</p>
            <h2 className="text-3xl md:text-4xl">Ikuti ritme alam dan budaya kami setiap hari.</h2>
            <p className="text-emerald-50">
              Dari bertani bersama warga hingga belajar menenun tikar pandan, kami menyiapkan rangkaian kegiatan yang
              bisa Anda pilih sesuai minat. Semua aktivitas dipandu langsung oleh pelaku lokal.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {experienceHighlights.map((item) => (
                <div key={item.title} className="flex flex-col gap-3 rounded-3xl bg-emerald-50/80 p-5">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm font-semibold text-emerald-900">{item.title}</p>
                  <p className="text-sm text-emerald-800/80">{item.blurb}</p>
                </div>
              ))}
            </div>
            <Link href="/attractions" className="inline-flex text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Jelajahi kegiatan lainnya →
            </Link>
          </div>

          <Card className="relative overflow-hidden border-none bg-transparent p-0 shadow-[0_38px_80px_-40px_rgba(12,74,64,0.55)] backdrop-blur-0">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_-10%,rgba(255,255,255,0.45),transparent_55%),radial-gradient(circle_at_90%_0%,rgba(244,220,164,0.35),transparent_70%)]"
              aria-hidden
            />
            <div className="relative rounded-3xl bg-gradient-to-b from-[#0c2f28] via-white to-[#f6d9a4] p-[1px]">
              <div className="relative rounded-[26px] bg-white/95 p-8 text-stone-800 shadow-[0_26px_60px_-38px_rgba(12,74,64,0.65)] sm:p-10">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900">
                      Weekend itinerary
                    </span>
                    <h3 className="text-2xl font-semibold text-stone-900">Rangkaian akhir pekan</h3>
                    <p className="max-w-lg text-sm leading-relaxed text-stone-600 sm:text-base">
                      Ideal untuk keluarga atau komunitas kecil. Nikmati dua malam penuh aktivitas fleksibel yang
                      menggabungkan alam, kuliner, dan budaya desa.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {weekendSchedule.map((item) => (
                      <div
                        key={item.title}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-white to-amber-50/60 p-5 shadow-[0_16px_40px_-30px_rgba(58,95,11,0.35)] ring-1 ring-emerald-900/10 transition duration-300 hover:shadow-[0_26px_60px_-28px_rgba(12,74,64,0.5)]"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,94,80,0.08),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                        <div className="relative flex items-start gap-4">
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg">
                            {item.icon}
                          </span>
                          <div className="space-y-1 text-sm sm:text-base">
                            <p className="font-semibold text-stone-900">
                              {item.title}
                            </p>
                            <p className="text-stone-600">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">2N</span>
                    <span>Cocok untuk keluarga dengan anak usia sekolah & komunitas kecil</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </section>

  {/* Stories */}
  <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-emerald-50" aria-hidden />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Cerita terbaru</p>
            <h2 className="mt-4 text-3xl text-emerald-900 md:text-4xl">Cerita dari warga dan tamu yang pernah singgah.</h2>
            <p className="mt-6 text-stone-700">
              Blog kami berisi tips perjalanan, resep kuliner, kisah sukses UMKM desa, dan ritual adat yang masih
              terjaga.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} hover className="bg-white shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-900/10">
                <div className="h-48 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(84,140,78,0.35),_rgba(232,241,224,0.4))]" />
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">
                    <span>17 Juli 2024</span>
                    <span className="h-1 w-1 rounded-full bg-emerald-700" />
                    <span>Kisah Desa</span>
                  </div>
                  <CardTitle className="text-emerald-900">Jejak kopi robusta di lereng kami</CardTitle>
                  <CardDescription className="text-stone-700">
                    Bagaimana Pak Danu merawat kebun kopi warisan dan membuka kelas cupping untuk pengunjung.
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/blog">
              <Button variant="ghost">Baca cerita lainnya</Button>
            </Link>
          </div>
        </Container>
      </section>

  {/* CTA Section */}
  <section className="relative overflow-hidden -mt-24 -mb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-900" aria-hidden />
        <Container className="relative py-16">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h2 className="text-3xl md:text-4xl">Siap menikmati akhir pekan bernuansa pedesaan?</h2>
            <p className="mt-6 text-lg text-emerald-100/90">
              Tim kami akan membantu menyesuaikan pengalaman sesuai minat Anda—dari kuliner, kerajinan, hingga petualangan alam.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50">
                  Konsultasi itinerary
                </Button>
              </Link>
              <Link href="/homestays">
                <Button size="lg" variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                  Pesan homestay sekarang
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
