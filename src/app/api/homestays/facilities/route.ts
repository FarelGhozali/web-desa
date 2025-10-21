import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all published homestays
    const homestays = await prisma.homestay.findMany({
      where: { published: true },
      select: {
        facilities: true,
      },
    });

    // Extract and deduplicate facilities
    const facilitiesSet = new Set<string>();
    
    homestays.forEach((homestay) => {
      if (homestay.facilities) {
        try {
          const parsed = JSON.parse(homestay.facilities);
          if (Array.isArray(parsed)) {
            parsed.forEach((facility: string) => {
              if (facility && typeof facility === 'string') {
                facilitiesSet.add(facility);
              }
            });
          }
        } catch (error) {
          console.error('Error parsing facilities:', error);
        }
      }
    });

    // Convert to sorted array
    const facilities = Array.from(facilitiesSet).sort();

    return NextResponse.json({
      success: true,
      data: facilities,
      count: facilities.length,
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data fasilitas',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
