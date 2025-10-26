import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get single attraction by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attraction = await prisma.attraction.findUnique({
      where: { id: params.id },
    });

    if (!attraction) {
      return NextResponse.json({ error: 'Attraction not found' }, { status: 404 });
    }

    return NextResponse.json(attraction);
  } catch (error) {
    console.error('Error fetching attraction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attraction' },
      { status: 500 }
    );
  }
}

// PATCH - Update attraction
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, location, photos, latitude, longitude, mapsEmbedCode, featured, published } =
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

      // Check if new slug already exists (and is not the current attraction)
      const existingAttraction = await prisma.attraction.findUnique({
        where: { slug },
      });

      if (existingAttraction && existingAttraction.id !== params.id) {
        return NextResponse.json(
          { error: 'An attraction with this name already exists' },
          { status: 400 }
        );
      }

      updateData.slug = slug;
    }

    const attraction = await prisma.attraction.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(attraction);
  } catch (error) {
    console.error('Error updating attraction:', error);
    return NextResponse.json(
      { error: 'Failed to update attraction' },
      { status: 500 }
    );
  }
}

// DELETE - Delete attraction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.attraction.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Attraction deleted successfully' });
  } catch (error) {
    console.error('Error deleting attraction:', error);
    return NextResponse.json(
      { error: 'Failed to delete attraction' },
      { status: 500 }
    );
  }
}
