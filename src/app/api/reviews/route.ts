import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const { rating, comment, homestayId, bookingId } = await request.json();

    // Validation
    if (!rating || !homestayId || !bookingId) {
      return NextResponse.json(
        { message: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating harus antara 1-5' },
        { status: 400 }
      );
    }

    // Comment is optional
    if (comment && typeof comment !== 'string') {
      return NextResponse.json(
        { message: 'Format komentar tidak valid' },
        { status: 400 }
      );
    }

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.id,
        homestayId,
        status: 'COMPLETED',
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking tidak valid atau belum selesai' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this homestay for this booking
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        homestayId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { message: 'Anda sudah memberikan review untuk homestay ini' },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment ? comment.trim() : '',
        userId: user.id,
        homestayId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat membuat review' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const homestayId = request.nextUrl.searchParams.get('homestayId');

    if (!homestayId) {
      return NextResponse.json(
        { message: 'homestayId diperlukan' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        homestayId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil review' },
      { status: 500 }
    );
  }
}
