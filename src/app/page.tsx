
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { prisma } from '@/lib/prisma';

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

export default async function HomePage() {
  // Featured homestays
  const homestaysRaw = await prisma.homestay.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
  const homestays = homestaysRaw.map((h) => ({
    ...h,
    photos: h.photos ? JSON.parse(h.photos) : [],
    amenities: h.amenities ? JSON.parse(h.amenities) : [],
  }));

  // Latest blog posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { category: true },
  });

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[102vh] flex items-center justify-center -mt-24">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#fff3d8] via-[#e6f4ec] to-[#fff9ec]"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-70"
          aria-hidden
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(60,119,89,0.14) 0, rgba(60,119,89,0) 55%), radial-gradient(circle at 80% 0%, rgba(255,199,126,0.16) 0, rgba(255,199,126,0) 42%)',
          }}
        />
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-emerald-900 text-center">
            <Badge className="bg-emerald-100/70 text-emerald-900 ring-emerald-300/40">
              Desa Harmoni, Jawa Barat
            </Badge>
            <h1 className="text-4xl leading-tight md:text-6xl">
              Liburan desa yang menyatu dengan keseharian warga.
            </h1>
            <p className="text-lg text-stone-600 md:text-xl">
              Kami merangkai perjalanan yang membuat Anda betah: tidur di rumah panggung yang hangat, bangun bersama
              matahari, dan berbagi meja makan dengan keluarga tuan rumah.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Link href="/homestays">
                <Button size="lg">Cari Homestay</Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="ghost"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                >
                  Kenali Desa Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
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
            {homestays.map((homestay) => (
              <Card key={homestay.id} hover className="bg-white/90 backdrop-blur">
                <div className="relative h-56 overflow-hidden rounded-3xl">
                  {homestay.photos[0] && (
                    <Image
                      src={homestay.photos[0]}
                      alt={homestay.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,121,66,0.35),_rgba(79,121,66,0.06))]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/30 via-emerald-500/10 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-6">
                    <div className="rounded-2xl bg-white/90 p-4 text-stone-800 shadow-lg">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                        {homestay.name}
                      </p>
                      <p className="text-lg font-semibold">{homestay.description.slice(0, 40)}...</p>
                      <p className="text-xs text-stone-500">{homestay.address}</p>
                    </div>
                  </div>
                </div>
                <CardContent>
                  <div className="space-y-4 text-sm text-stone-600">
                    <ul className="space-y-4 mt-4">
                      {homestay.amenities?.slice(0, 3).map((perk: string) => (
                        <li key={perk} className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            ✔
                          </span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between text-stone-700">
                      <span className="text-lg font-semibold text-emerald-700">Rp {homestay.pricePerNight.toLocaleString('id-ID')} / malam</span>
                      <Link
                        href={`/homestays/${homestay.slug}`}
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

          <Card className="relative overflow-hidden border border-emerald-100/70 bg-white/95 p-0 shadow-[0_36px_68px_-36px_rgba(15,118,110,0.45)]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-200/60 via-transparent to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-24 bottom-8 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col gap-8 p-8 sm:p-10">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800 shadow-sm">
                  Weekend itinerary
                </span>
                <h3 className="text-2xl font-semibold text-emerald-950">Rangkaian akhir pekan</h3>
                <p className="max-w-lg text-sm leading-relaxed text-stone-600 sm:text-base">
                  Ideal untuk keluarga atau komunitas kecil. Nikmati dua malam aktivitas fleksibel yang merangkum alam,
                  kuliner, dan budaya desa.
                </p>
              </div>

              <div className="grid gap-4">
                {weekendSchedule.map((item) => (
                  <div
                    key={item.title}
                    className="relative flex items-start gap-4 rounded-2xl border border-emerald-100/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
                      {item.icon}
                    </span>
                    <div className="space-y-1 text-sm sm:text-base">
                      <p className="font-semibold text-emerald-950">{item.title}</p>
                      <p className="text-stone-600">{item.description}</p>
                    </div>
                    <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-500" aria-hidden />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">2N</span>
                <span>Cocok untuk keluarga dengan anak usia sekolah & komunitas kecil</span>
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
            {posts.map((post) => (
              <Card key={post.id} hover className="bg-white shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-900/10">
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden rounded-3xl">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">
                    <span>{post.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span className="h-1 w-1 rounded-full bg-emerald-700" />
                    <span>{post.category?.name || 'Kisah Desa'}</span>
                  </div>
                  <CardTitle className="text-emerald-900">{post.title}</CardTitle>
                  <CardDescription className="text-stone-700">
                    {post.excerpt || post.content.slice(0, 100) + '...'}
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

    </div>
  );
}
