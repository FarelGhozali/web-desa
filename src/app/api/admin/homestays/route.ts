import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/homestays - Get all homestays for admin (with count)
export async function GET() {
  try {
    const homestays = await prisma.homestay.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        pricePerNight: true,
        maxGuests: true,
        featured: true,
        published: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    // Parse and transform data
    const parsedHomestays = homestays.map((homestay) => ({
      ...homestay,
      pricePerNight: Number(homestay.pricePerNight),
      createdAt: homestay.createdAt.toISOString(),
    }));

    return NextResponse.json(parsedHomestays);
  } catch (error) {
    console.error('Error fetching homestays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homestays' },
      { status: 500 }
    );
  }
}
