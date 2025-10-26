import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all attractions (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attractions = await prisma.attraction.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(attractions);
  } catch (error) {
    console.error('Error fetching attractions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attractions' },
      { status: 500 }
    );
  }
}

// POST - Create a new attraction (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, location, photos, latitude, longitude, mapsEmbedCode, featured, published } =
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
    const existingAttraction = await prisma.attraction.findUnique({
      where: { slug },
    });

    if (existingAttraction) {
      return NextResponse.json(
        { error: 'An attraction with this name already exists' },
        { status: 400 }
      );
    }

    // Create attraction
    const attraction = await prisma.attraction.create({
      data: {
        name: name.trim(),
        slug,
        description: description.trim(),
        location: location.trim(),
        photos: photos || '[]',
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        mapsEmbedCode: mapsEmbedCode || null,
        featured: featured || false,
        published: published || false,
      },
    });

    return NextResponse.json(attraction, { status: 201 });
  } catch (error) {
    console.error('Error creating attraction:', error);
    return NextResponse.json(
      { error: 'Failed to create attraction' },
      { status: 500 }
    );
  }
}
