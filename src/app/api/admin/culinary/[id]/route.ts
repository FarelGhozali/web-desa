import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH - Update culinary
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

    const culinary = await prisma.culinary.update({
      where: { id: params.id },
      data: body,
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.culinary.delete({
      where: { id: params.id },
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
