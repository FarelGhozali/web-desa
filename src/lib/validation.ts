import { z } from 'zod';

/**
 * Validate if a string is a URL, blob URL, or relative path
 */
const isValidPhotoUrl = (url: string): boolean => {
  // Check if it's a relative path (uploaded to local storage)
  if (url.startsWith('/uploads/')) {
    return true;
  }

  try {
    new URL(url);
    return true;
  } catch {
    // Check if it's a blob URL
    return url.startsWith('blob:');
  }
};

/**
 * Homestay validation schema for creating and updating homestays
 */
export const homestaySchema = z.object({
  name: z
    .string()
    .min(3, 'Nama homestay minimal 3 karakter')
    .max(100, 'Nama homestay maksimal 100 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(100, 'Slug maksimal 100 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan dash'),
  description: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(5000, 'Deskripsi maksimal 5000 karakter'),
  address: z
    .string()
    .min(5, 'Alamat minimal 5 karakter')
    .max(200, 'Alamat maksimal 200 karakter'),
  pricePerNight: z
    .number()
    .int('Harga harus berupa angka bulat')
    .positive('Harga harus lebih dari 0'),
  maxGuests: z
    .number()
    .int('Kuota tamu harus berupa angka bulat')
    .min(1, 'Kuota tamu minimal 1 orang')
    .max(50, 'Kuota tamu maksimal 50 orang'),
  photos: z
    .array(z.string())
    .min(1, 'Minimal 1 foto harus diunggah')
    .refine(
      (urls) => urls.every(isValidPhotoUrl),
      'Semua URL foto harus valid'
    ),
  amenities: z
    .array(z.string())
    .min(1, 'Minimal 1 amenitas harus ditambahkan'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type HomestayInput = z.infer<typeof homestaySchema>;

/**
 * Form schema for client-side validation (more lenient for UX)
 */
export const homestayFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama homestay minimal 3 karakter')
    .max(100, 'Nama homestay maksimal 100 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(100, 'Slug maksimal 100 karakter'),
  description: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(5000, 'Deskripsi maksimal 5000 karakter'),
  address: z
    .string()
    .min(5, 'Alamat minimal 5 karakter')
    .max(200, 'Alamat maksimal 200 karakter'),
  pricePerNight: z
    .string()
    .refine((val: string) => !isNaN(Number(val)) && Number(val) > 0, 'Harga harus berupa angka positif'),
  maxGuests: z
    .string()
    .refine((val: string) => !isNaN(Number(val)) && Number(val) >= 1, 'Kuota tamu minimal 1 orang'),
  photos: z.array(z.string()).min(1, 'Minimal 1 foto harus diunggah'),
  amenities: z.array(z.string()).min(1, 'Minimal 1 amenitas harus ditambahkan'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type HomestayFormInput = z.infer<typeof homestayFormSchema>;
