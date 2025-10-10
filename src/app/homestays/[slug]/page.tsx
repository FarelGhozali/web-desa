import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // TODO: Fetch homestay from database
  return {
    title: `Homestay ${slug}`,
    description: 'Experience authentic village life in this beautiful homestay',
  };
}

export default async function HomestayDetailPage({ params }: Props) {
  const { slug } = await params;
  // TODO: Fetch homestay from database by slug
  // const homestay = await prisma.homestay.findUnique({ where: { slug } });

  return (
    <div className="py-16">
      <Container>
        {/* Photo Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-96 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(47,127,82,0.35),_rgba(47,127,82,0.05))]"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[186px] rounded-3xl bg-emerald-100/70"></div>
              <div className="h-[186px] rounded-3xl bg-emerald-100/70"></div>
              <div className="h-[186px] rounded-3xl bg-emerald-100/70"></div>
              <div className="h-[186px] rounded-3xl bg-emerald-100/70"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="mb-4 text-4xl text-stone-50">
              Homestay {slug}
            </h1>
            
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center">
                <span className="text-amber-500">★★★★★</span>
                <span className="ml-2 text-stone-600">4.8 (24 ulasan)</span>
              </div>
              <span className="text-stone-600">📍 Pusat Desa</span>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl">Tentang homestay ini</h2>
              <p className="text-emerald-50">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl">Fasilitas</h2>
              <div className="grid grid-cols-2 gap-4 text-emerald-50">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Free WiFi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Air Conditioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Kitchen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Parking</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl">Testimoni tamu</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-stone-200/70 pb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-emerald-100"></div>
                      <div>
                        <p className="font-semibold">Tamu {i}</p>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <span className="text-amber-500">★★★★★</span>
                          <span>2 minggu lalu</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-emerald-50">
                      Great experience! The host was very welcoming and the place was clean and comfortable.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-emerald-100/70 bg-white/90 p-6 shadow-lg backdrop-blur">
              <div className="mb-6">
                <span className="text-3xl font-semibold text-emerald-700">Rp 250.000</span>
                <span className="text-stone-600"> / malam</span>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-stone-200/80 bg-white/85 px-3 py-2 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-stone-200/80 bg-white/85 px-3 py-2 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">
                    Tamu
                  </label>
                  <select className="w-full rounded-xl border border-stone-200/80 bg-white/85 px-3 py-2 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100">
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                  </select>
                </div>

                <Button fullWidth size="lg">
                  Pesan sekarang
                </Button>

                <p className="text-center text-xs text-stone-500">
                  Anda belum akan ditagih
                </p>
              </div>

              <div className="mt-6 border-t border-stone-200/70 pt-6 text-sm text-stone-700">
                <div className="mb-2 flex justify-between">
                  <span>Rp 250.000 × 3 malam</span>
                  <span>Rp 750.000</span>
                </div>
                <div className="flex justify-between border-t border-stone-200/70 pt-2 font-semibold text-stone-900">
                  <span>Total</span>
                  <span>Rp 750.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
