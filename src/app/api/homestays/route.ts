import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/homestays - Get all homestays
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');

    const homestays = await prisma.homestay.findMany({
      where: {
        published: true,
        ...(featured === 'true' && { featured: true }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: featured === 'true' ? 6 : undefined,
    });

    return NextResponse.json(homestays);
  } catch (error) {
    console.error('Error fetching homestays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homestays' },
      { status: 500 }
    );
  }
}

// POST /api/homestays - Create a new homestay (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Add authentication and authorization checks
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const homestay = await prisma.homestay.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        address: body.address,
        pricePerNight: body.pricePerNight,
        maxGuests: body.maxGuests,
        photos: body.photos || [],
        amenities: body.amenities || [],
        latitude: body.latitude,
        longitude: body.longitude,
        featured: body.featured || false,
        published: body.published || false,
      },
    });

    return NextResponse.json(homestay, { status: 201 });
  } catch (error) {
    console.error('Error creating homestay:', error);
    return NextResponse.json(
      { error: 'Failed to create homestay' },
      { status: 500 }
    );
  }
}
