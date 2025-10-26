import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { checkInDate, checkOutDate, numberOfGuests, excludeHomestayId } = await req.json();

    // Validation
    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Get all published homestays excluding the one being checked
    const allHomestays = await prisma.homestay.findMany({
      where: {
        published: true,
        NOT: {
          id: excludeHomestayId,
        },
      },
      take: 6, // Limit to 6 alternatives
    });

    // Filter homestays: check availability and guest capacity
    const availableHomestays = [];

    for (const homestay of allHomestays) {
      // Check guest capacity
      if (numberOfGuests && numberOfGuests > homestay.maxGuests) {
        continue;
      }

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

      if (!overlappingBooking) {
        availableHomestays.push({
          id: homestay.id,
          name: homestay.name,
          slug: homestay.slug,
          description: homestay.description,
          pricePerNight: Number(homestay.pricePerNight),
          maxGuests: homestay.maxGuests,
          address: homestay.address,
          photos: homestay.photos ? JSON.parse(homestay.photos) : [],
          facilities: homestay.facilities ? JSON.parse(homestay.facilities) : [],
        });
      }

      if (availableHomestays.length >= 3) {
        break; // Get top 3 alternatives
      }
    }

    return NextResponse.json(
      {
        alternatives: availableHomestays,
        count: availableHomestays.length,
        checkInDate,
        checkOutDate,
        numberOfGuests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get alternatives error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alternative homestays' },
      { status: 500 }
    );
  }
}
