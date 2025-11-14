import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for contact message
const contactMessageSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Email tidak valid'),
  subject: z.string().min(5, 'Subjek minimal 5 karakter').max(200),
  message: z.string().min(10, 'Pesan minimal 10 karakter').max(5000),
});

// POST /api/contact/messages - Create new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = contactMessageSchema.parse(body);

    // Save to database
    const message = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        status: 'UNREAD',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Pesan berhasil dikirim. Kami akan merespon dalam 24 jam kerja.',
        data: message,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validasi gagal',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error creating contact message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengirim pesan. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}

// GET /api/contact/messages - Get all contact messages (Admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where = status ? { status } : {};

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.contactMessage.count({ where });

    return NextResponse.json({
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil pesan' },
      { status: 500 }
    );
  }
}
