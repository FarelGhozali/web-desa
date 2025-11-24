import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get single culinary by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const culinary = await prisma.culinary.findUnique({
      where: { id },
    });

    if (!culinary) {
      return NextResponse.json({ error: 'Culinary not found' }, { status: 404 });
    }

    return NextResponse.json(culinary);
  } catch (error) {
    console.error('Error fetching culinary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch culinary' },
      { status: 500 }
    );
  }
}

// PATCH - Update culinary
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, location, photos, latitude, longitude, priceRange, mapsEmbedCode, featured, published } =
      body;

    // Validation
    if (name !== undefined && name.trim().length < 3) {
      return NextResponse.json(
        { error: 'Name must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (description !== undefined && description.trim().length < 20) {
      return NextResponse.json(
        { error: 'Description must be at least 20 characters' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (location !== undefined) updateData.location = location.trim();
    if (photos !== undefined) updateData.photos = photos || '[]';
    if (latitude !== undefined) updateData.latitude = latitude ? parseFloat(latitude) : null;
    if (longitude !== undefined) updateData.longitude = longitude ? parseFloat(longitude) : null;
    if (priceRange !== undefined) updateData.priceRange = priceRange || null;
    if (mapsEmbedCode !== undefined) updateData.mapsEmbedCode = mapsEmbedCode || null;
    if (featured !== undefined) updateData.featured = featured;
    if (published !== undefined) updateData.published = published;

    // If name is being updated, also update slug
    if (name !== undefined) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if new slug already exists (and is not the current culinary)
      const existingCulinary = await prisma.culinary.findUnique({
        where: { slug },
      });

      if (existingCulinary && existingCulinary.id !== id) {
        return NextResponse.json(
          { error: 'A culinary with this name already exists' },
          { status: 400 }
        );
      }

      updateData.slug = slug;
    }

    const culinary = await prisma.culinary.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(culinary);
  } catch (error) {
    console.error('Error updating culinary:', error);
    return NextResponse.json(
      { error: 'Failed to update culinary' },
      { status: 500 }
    );
  }
}

// DELETE - Delete culinary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.culinary.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Culinary deleted successfully' });
  } catch (error) {
    console.error('Error deleting culinary:', error);
    return NextResponse.json(
      { error: 'Failed to delete culinary' },
      { status: 500 }
    );
  }
}
