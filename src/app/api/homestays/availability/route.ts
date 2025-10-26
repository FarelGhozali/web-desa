import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { homestayId, checkInDate, checkOutDate, numberOfGuests } = await req.json();

    // Validation
    if (!homestayId || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    // Get the homestay
    const homestay = await prisma.homestay.findUnique({
      where: { id: homestayId },
    });

    if (!homestay) {
      return NextResponse.json(
        { error: 'Homestay not found' },
        { status: 404 }
      );
    }

    // Check if guest count exceeds max guests
    if (numberOfGuests && numberOfGuests > homestay.maxGuests) {
      return NextResponse.json(
        {
          available: false,
          reason: 'GUEST_LIMIT_EXCEEDED',
          message: `Jumlah tamu melebihi kapasitas maksimal (${homestay.maxGuests} tamu)`,
        },
        { status: 200 }
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        homestayId,
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

    if (overlappingBooking) {
      return NextResponse.json(
        {
          available: false,
          reason: 'NOT_AVAILABLE',
          message: 'Homestay tidak tersedia untuk tanggal yang dipilih',
        },
        { status: 200 }
      );
    }

    // Available
    return NextResponse.json(
      {
        available: true,
        reason: 'AVAILABLE',
        message: 'Homestay tersedia untuk tanggal yang dipilih',
        homestayId,
        checkInDate,
        checkOutDate,
        numberOfGuests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
