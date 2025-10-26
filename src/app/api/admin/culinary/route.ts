import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all culinary (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const culinary = await prisma.culinary.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(culinary);
  } catch (error) {
    console.error('Error fetching culinary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch culinary' },
      { status: 500 }
    );
  }
}

// POST - Create a new culinary (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, location, photos, latitude, longitude, priceRange, mapsEmbedCode, featured, published } =
      await request.json();

    // Validation
    if (!name || !description || !location) {
      return NextResponse.json(
        { error: 'Name, description, and location are required' },
        { status: 400 }
      );
    }

    if (name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Name must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (description.trim().length < 20) {
      return NextResponse.json(
        { error: 'Description must be at least 20 characters' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const existingCulinary = await prisma.culinary.findUnique({
      where: { slug },
    });

    if (existingCulinary) {
      return NextResponse.json(
        { error: 'A culinary with this name already exists' },
        { status: 400 }
      );
    }

    // Create culinary
    const culinary = await prisma.culinary.create({
      data: {
        name: name.trim(),
        slug,
        description: description.trim(),
        location: location.trim(),
        photos: photos || '[]',
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        priceRange: priceRange || null,
        mapsEmbedCode: mapsEmbedCode || null,
        featured: featured || false,
        published: published || false,
      },
    });

    return NextResponse.json(culinary, { status: 201 });
  } catch (error) {
    console.error('Error creating culinary:', error);
    return NextResponse.json(
      { error: 'Failed to create culinary' },
      { status: 500 }
    );
  }
}
