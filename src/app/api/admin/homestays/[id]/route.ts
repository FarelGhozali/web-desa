import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { homestaySchema } from '@/lib/validation';

type Props = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/homestays/[id] - Get a single homestay by ID (Admin only)
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;

    const homestay = await prisma.homestay.findUnique({
      where: { id },
      include: {
        reviews: {
          select: {
            id: true,
            rating: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
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

    // Parse JSON fields and convert BigInt
    const parseData = {
      ...homestay,
      pricePerNight: Number(homestay.pricePerNight),
      photos: typeof homestay.photos === 'string' ? JSON.parse(homestay.photos) : homestay.photos,
      amenities: typeof homestay.amenities === 'string' ? JSON.parse(homestay.amenities) : homestay.amenities,
    };

    return NextResponse.json(parseData);
  } catch (error) {
    console.error('Error fetching homestay:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homestay' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/homestays/[id] - Update a homestay by ID (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // TODO: Add authentication and authorization checks

    // Validate input
    const validation = homestaySchema.safeParse({
      name: body.name,
      slug: body.slug,
      description: body.description,
      address: body.address,
      pricePerNight: body.pricePerNight,
      maxGuests: body.maxGuests,
      photos: body.photos,
      amenities: body.amenities,
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

    // Check if slug already exists (excluding current homestay)
    if (body.slug) {
      const existingSlug = await prisma.homestay.findFirst({
        where: {
          slug: body.slug,
          NOT: { id },
        },
      });

      if (existingSlug) {
        return NextResponse.json(
          { error: 'Slug sudah digunakan. Pilih slug yang lain.' },
          { status: 400 }
        );
      }
    }

    // Store embed code if provided (no parsing needed)
    const embedCode = body.mapsEmbedCode || null;

    const homestay = await prisma.homestay.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        address: body.address,
        pricePerNight: body.pricePerNight,
        maxGuests: body.maxGuests,
        photos: JSON.stringify(body.photos),
        amenities: JSON.stringify(body.amenities),
        mapsEmbedCode: embedCode,
        featured: body.featured,
        published: body.published,
      },
    });

    // Convert BigInt for JSON serialization
    const response = {
      ...homestay,
      pricePerNight: Number(homestay.pricePerNight),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating homestay:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate homestay. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/homestays/[id] - Delete a homestay by ID (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;

    // TODO: Add authentication and authorization checks

    await prisma.homestay.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Homestay deleted successfully' });
  } catch (error) {
    console.error('Error deleting homestay:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus homestay. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
