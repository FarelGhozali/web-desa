import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import BookingForm from '@/components/BookingForm';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const homestay = await prisma.homestay.findUnique({ where: { slug } });

  if (!homestay) {
    return {
      title: 'Homestay Tidak Ditemukan',
      description: 'Homestay yang Anda cari tidak ditemukan',
    };
  }

  return {
    title: `${homestay.name} - Pemesanan Homestay`,
    description: homestay.description,
  };
}

export default async function HomestayDetailPage({ params }: Props) {
  const { slug } = await params;
  const homestay = await prisma.homestay.findUnique({
    where: { slug },
    include: {
      reviews: {
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      },
    },
  });

  if (!homestay) {
    notFound();
  }

  const amenities = homestay.amenities.split(',').map((a) => a.trim());

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
            <h1 className="mb-4 text-4xl text-stone-900">
              {homestay.name}
            </h1>
            
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center">
                <span className="text-amber-500">★★★★★</span>
                <span className="ml-2 text-stone-600">{homestay.reviews.length} ulasan</span>
              </div>
              <span className="text-stone-600">📍 {homestay.address}</span>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl text-stone-900">Tentang homestay ini</h2>
              <p className="text-stone-600">
                {homestay.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl text-stone-900">Fasilitas</h2>
              <div className="grid grid-cols-2 gap-4 text-stone-700">
                {amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl text-stone-900">Testimoni tamu</h2>
                {homestay.reviews.length > 0 && (
                  <Link href={`/homestays/${homestay.slug}/reviews`}>
                    <Button variant="secondary" className="text-sm">
                      Lihat Semua ({homestay.reviews.length})
                    </Button>
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {homestay.reviews.length > 0 ? (
                  homestay.reviews.map((review) => (
                    <div key={review.id} className="border-b border-stone-200/70 pb-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-emerald-100"></div>
                        <div>
                          <p className="font-semibold text-stone-900">{review.user.name}</p>
                          <div className="flex items-center gap-2 text-xs text-stone-500">
                            <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                            <span>
                              {new Date(review.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-stone-600">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-stone-600">Belum ada ulasan. Jadilah yang pertama!</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm
                homestayId={homestay.id}
                pricePerNight={homestay.pricePerNight}
                maxGuests={homestay.maxGuests}
                homestayName={homestay.name}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
