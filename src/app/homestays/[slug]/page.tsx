import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

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
  // if (!homestay) notFound();

  return (
    <div className="py-12">
      <Container>
        {/* Photo Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-96 bg-gray-300 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[186px] bg-gray-300 rounded-lg"></div>
              <div className="h-[186px] bg-gray-300 rounded-lg"></div>
              <div className="h-[186px] bg-gray-300 rounded-lg"></div>
              <div className="h-[186px] bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Homestay {slug}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-500">★★★★★</span>
                <span className="ml-2 text-gray-600">4.8 (24 reviews)</span>
              </div>
              <span className="text-gray-600">📍 Village Center</span>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">About this homestay</h2>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
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
              <h2 className="text-2xl font-semibold mb-4">Guest Reviews</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-semibold">Guest {i}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 text-sm">★★★★★</span>
                          <span className="text-sm text-gray-500">2 weeks ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Great experience! The host was very welcoming and the place was clean and comfortable.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-6">
                <span className="text-3xl font-bold text-blue-600">Rp 250.000</span>
                <span className="text-gray-600"> / night</span>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                  </select>
                </div>

                <Button fullWidth size="lg">
                  Book Now
                </Button>

                <p className="text-xs text-center text-gray-500">
                  You won&apos;t be charged yet
                </p>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Rp 250.000 × 3 nights</span>
                  <span>Rp 750.000</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
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
