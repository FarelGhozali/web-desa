import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const maxGuests = searchParams.get('maxGuests');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const facilitiesStr = searchParams.get('facilities');

    // Parse facilities
    const facilities = facilitiesStr ? JSON.parse(facilitiesStr) : [];

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = { published: true };

    // Price filter
    if (minPrice || maxPrice) {
      whereClause.pricePerNight = {};
      if (minPrice) {
        whereClause.pricePerNight.gte = BigInt(parseInt(minPrice));
      }
      if (maxPrice) {
        whereClause.pricePerNight.lte = BigInt(parseInt(maxPrice));
      }
    }

    // Max guests filter
    if (maxGuests) {
      whereClause.maxGuests = {
        gte: parseInt(maxGuests),
      };
    }

    // Determine order by
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'price-asc':
        orderBy.createdAt = undefined;
        orderBy.pricePerNight = 'asc';
        break;
      case 'price-desc':
        orderBy.createdAt = undefined;
        orderBy.pricePerNight = 'desc';
        break;
      case 'newest':
      default:
        orderBy.pricePerNight = undefined;
        orderBy.createdAt = 'desc';
        break;
    }

    // Fetch homestays
    let homestays = await prisma.homestay.findMany({
      where: whereClause,
      orderBy,
      take: 50,
    });

    // Filter by facilities in memory (check if homestay contains all selected facilities)
    if (facilities.length > 0) {
      homestays = homestays.filter((homestay) => {
        const homestayFacilities = homestay.facilities ? JSON.parse(homestay.facilities) : [];
        return facilities.every((facility: string) => homestayFacilities.includes(facility));
      });
    }

    // Parse JSON fields
    const parsedHomestays = homestays.map((h) => ({
      ...h,
      photos: h.photos ? JSON.parse(h.photos) : [],
      facilities: h.facilities ? JSON.parse(h.facilities) : [],
      pricePerNight: Number(h.pricePerNight),
    }));

    return NextResponse.json({
      success: true,
      data: parsedHomestays,
      count: parsedHomestays.length,
    });
  } catch (error) {
    console.error('Filter error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data homestay',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
