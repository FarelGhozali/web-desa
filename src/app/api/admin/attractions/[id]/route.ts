import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const attraction = await prisma.attraction.update({
      where: { id: params.id },
      data: body,
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
