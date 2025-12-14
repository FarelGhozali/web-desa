import { prisma } from '@/lib/prisma';
import Container from '@/components/ui/Container';
import type { Metadata } from 'next';
import Image from 'next/image';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const homestay = await prisma.homestay.findUnique({
    where: { slug },
  });

  return {
    title: homestay ? `Review ${homestay.name}` : 'Review',
    description: homestay ? `Review dan rating untuk ${homestay.name}` : 'Review homestay',
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default async function ReviewsPage({ params }: Props) {
  const { slug } = await params;

  const homestay = await prisma.homestay.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!homestay) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <Container>
          <p className="text-center text-stone-600">Homestay tidak ditemukan</p>
        </Container>
      </div>
    );
  }

  const reviews = homestay.reviews as Review[];
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Container>
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-stone-900">{homestay.name}</h1>
          <p className="text-stone-600">Review dari tamu kami</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Rating Summary */}
          <div className="rounded-lg border border-stone-200 bg-white p-6 lg:col-span-1">
            <div className="mb-6 text-center">
              <p className="mb-2 text-5xl font-bold text-stone-900">{averageRating}</p>
              <div className="mb-2 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= Math.round(parseFloat(averageRating.toString()))
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-stone-600">Dari {reviews.length} review</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-stone-700 w-8">{rating}★</span>
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all"
                      style={{
                        width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-stone-600 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 lg:col-span-2">
            {reviews.length === 0 ? (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center">
                <p className="text-stone-600">Belum ada review untuk homestay ini</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-stone-200 bg-white p-6">
                  {/* Reviewer Info */}
                  <div className="mb-3 flex items-center gap-3">
                    {review.user.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name || 'User'}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700">
                        {review.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-stone-900">{review.user.name || 'Anonymous'}</p>
                      <p className="text-sm text-stone-600">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-stone-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
