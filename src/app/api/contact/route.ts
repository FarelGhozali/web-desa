import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/contact - Get contact info
export async function GET() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();

    if (!contactInfo) {
      return NextResponse.json(
        { error: 'Contact info tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil informasi kontak' },
      { status: 500 }
    );
  }
}

// PATCH /api/contact - Update contact info (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication and authorization checks
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { email, phone, address, mapsEmbedCode } = body;

    // Validate input
    if (!email || !phone || !address) {
      return NextResponse.json(
        { error: 'Email, telepon, dan alamat wajib diisi' },
        { status: 400 }
      );
    }

    // Get or create contact info
    let contactInfo = await prisma.contactInfo.findFirst();

    if (!contactInfo) {
      // Create new contact info
      contactInfo = await prisma.contactInfo.create({
        data: {
          email,
          phone,
          address,
          mapsEmbedCode: mapsEmbedCode || null,
        },
      });
    } else {
      // Update existing contact info
      contactInfo = await prisma.contactInfo.update({
        where: { id: contactInfo.id },
        data: {
          email,
          phone,
          address,
          mapsEmbedCode: mapsEmbedCode || null,
        },
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate informasi kontak' },
      { status: 500 }
    );
  }
}
