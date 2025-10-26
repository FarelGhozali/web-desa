import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Default folder is homestays for backward compatibility
const DEFAULT_FOLDER = 'homestays';

/**
 * Generate unique filename
 */
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop();
  return `${timestamp}-${random}.${ext}`;
}

/**
 * POST /api/upload - Upload file to local storage
 * Query params:
 *   - folder: 'homestays' | 'attractions' | 'culinary' (default: 'homestays')
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Get folder from query params (default to homestays)
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || DEFAULT_FOLDER;

    // Validate folder name (security - prevent directory traversal)
    if (!['homestays', 'attractions', 'culinary'].includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder type' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file hanya boleh: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Ukuran file maksimal 5MB, file Anda ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      );
    }

    // Construct upload directory
    const UPLOAD_DIR = join(process.cwd(), `public/uploads/${folder}`);

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const fileName = generateFileName(file.name);
    const filePath = join(UPLOAD_DIR, fileName);

    // Convert file to buffer and write
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return relative path for database storage
    const relativePath = `/uploads/${folder}/${fileName}`;

    return NextResponse.json({
      url: relativePath,
      fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Gagal upload file. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
