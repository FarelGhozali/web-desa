import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = req.nextUrl.searchParams;
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: 'Missing check-in or check-out date' },
        { status: 400 }
      );
    }

    const homestay = await prisma.homestay.findUnique({
      where: { slug },
    });

    if (!homestay) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        homestayId: homestay.id,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            checkInDate: { lt: checkOut },
            checkOutDate: { gt: checkIn },
          },
        ],
      },
    });

    const isAvailable = !overlappingBooking;

    return NextResponse.json({
      available: isAvailable,
      homestayId: homestay.id,
      checkInDate,
      checkOutDate,
    });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
