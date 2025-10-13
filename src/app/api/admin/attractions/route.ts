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
