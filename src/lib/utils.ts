import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate SEO-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Format price in IDR (Indonesian Rupiah)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Calculate number of nights between two dates
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Convert BigInt values to numbers for JSON serialization
 * Used primarily for Prisma database responses
 */
export function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'bigint') {
    return Number(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = serializeBigInt(value);
    }
    return result;
  }

  return obj;
}

/**
 * Parse Google Maps URL to extract latitude and longitude
 * Supports multiple Google Maps URL formats:
 * - https://maps.google.com/?q=latitude,longitude
 * - https://www.google.com/maps/place/...@latitude,longitude
 * - https://www.google.com/maps/dir/...@latitude,longitude
 * - https://goo.gl/maps/... (shortened URL - returns null)
 */
export function parseGoogleMapsUrl(url: string): {
  latitude: number;
  longitude: number;
} | null {
  if (!url || !url.trim()) return null;

  try {
    // Parse the URL
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Format 1: maps.google.com/?q=latitude,longitude
    if (urlObj.hostname === 'maps.google.com' || urlObj.hostname === 'www.maps.google.com') {
      const qParam = urlObj.searchParams.get('q');
      if (qParam) {
        const coords = qParam.split(',');
        if (coords.length === 2) {
          const lat = parseFloat(coords[0].trim());
          const lng = parseFloat(coords[1].trim());
          if (!isNaN(lat) && !isNaN(lng)) {
            return { latitude: lat, longitude: lng };
          }
        }
      }
    }

    // Format 2: google.com/maps/place/...@latitude,longitude
    // Format 3: google.com/maps/dir/...@latitude,longitude
    if (
      urlObj.hostname === 'google.com' ||
      urlObj.hostname === 'www.google.com'
    ) {
      if (pathname.includes('/maps/place/') || pathname.includes('/maps/dir/')) {
        // Extract coordinates from URL path (between @ and /)
        const match = urlObj.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          if (!isNaN(lat) && !isNaN(lng)) {
            return { latitude: lat, longitude: lng };
          }
        }
      }
    }

    // Format 4: maps.app.goo.gl (shortened URL)
    if (urlObj.hostname === 'maps.app.goo.gl' || urlObj.hostname === 'goo.gl') {
      // Shortened URLs cannot be parsed without fetching
      console.warn('Shortened Google Maps URLs cannot be parsed directly. Please use the full link.');
      return null;
    }

    return null;
  } catch (error) {
    console.error('Error parsing Google Maps URL:', error);
    return null;
  }
}
