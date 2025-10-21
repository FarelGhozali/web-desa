import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { homestaySchema } from '@/lib/validation';

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

    // Convert BigInt to number for JSON serialization
    const parsedHomestays = homestays.map((homestay) => ({
      ...homestay,
      pricePerNight: Number(homestay.pricePerNight),
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

// POST /api/homestays - Create a new homestay (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Add authentication and authorization checks
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Validate input
    const validation = homestaySchema.safeParse({
      name: body.name,
      slug: body.slug,
      description: body.description,
      address: body.address,
      pricePerNight: body.pricePerNight,
      maxGuests: body.maxGuests,
      photos: body.photos,
      facilities: body.facilities,
      mapsEmbedCode: body.mapsEmbedCode,
      featured: body.featured,
      published: body.published,
    });

    if (!validation.success) {
      const errors = validation.error.flatten();
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors.fieldErrors,
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingSlug = await prisma.homestay.findUnique({
      where: { slug: body.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug sudah digunakan. Pilih slug yang lain.' },
        { status: 400 }
      );
    }

    // Store embed code if provided (no parsing needed)
    const embedCode = body.mapsEmbedCode || null;

    const homestay = await prisma.homestay.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        address: body.address,
        pricePerNight: body.pricePerNight,
        maxGuests: body.maxGuests,
        photos: JSON.stringify(body.photos),
        facilities: JSON.stringify(body.facilities),
        mapsEmbedCode: embedCode,
        featured: body.featured || false,
        published: body.published || false,
      },
    });

    // Convert BigInt to number for JSON serialization
    const response = {
      ...homestay,
      pricePerNight: Number(homestay.pricePerNight),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating homestay:', error);
    return NextResponse.json(
      { error: 'Gagal membuat homestay. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
