import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/contact/messages/[id] - Update message status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status wajib diisi' },
        { status: 400 }
      );
    }

    const validStatuses = ['UNREAD', 'READ', 'REPLIED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate pesan' },
      { status: 500 }
    );
  }
}

// DELETE /api/contact/messages/[id] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus pesan' },
      { status: 500 }
    );
  }
}
