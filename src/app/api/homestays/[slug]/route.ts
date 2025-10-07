import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ slug: string }>;
};

// GET /api/homestays/[slug] - Get a single homestay by slug
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: 'Homestay not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating = homestay.reviews.length > 0
      ? homestay.reviews.reduce((sum: number, review) => sum + review.rating, 0) / homestay.reviews.length
      : 0;

    return NextResponse.json({
      ...homestay,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: homestay.reviews.length,
    });
  } catch (error) {
    console.error('Error fetching homestay:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homestay' },
      { status: 500 }
    );
  }
}

// PATCH /api/homestays/[slug] - Update a homestay (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // TODO: Add authentication and authorization checks

    const homestay = await prisma.homestay.update({
      where: { slug },
      data: body,
    });

    return NextResponse.json(homestay);
  } catch (error) {
    console.error('Error updating homestay:', error);
    return NextResponse.json(
      { error: 'Failed to update homestay' },
      { status: 500 }
    );
  }
}

// DELETE /api/homestays/[slug] - Delete a homestay (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { slug } = await params;

    // TODO: Add authentication and authorization checks

    await prisma.homestay.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Homestay deleted successfully' });
  } catch (error) {
    console.error('Error deleting homestay:', error);
    return NextResponse.json(
      { error: 'Failed to delete homestay' },
      { status: 500 }
    );
  }
}
