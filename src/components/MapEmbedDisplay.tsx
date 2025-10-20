'use client';

interface MapEmbedDisplayProps {
  embedCode?: string | null;
  className?: string;
}

/**
 * Display Google Maps embed iframe safely
 * 
 * @param embedCode - The iframe embed code from Google Maps
 * @param className - Additional CSS classes for the container
 */
export default function MapEmbedDisplay({ embedCode, className = '' }: MapEmbedDisplayProps) {
  if (!embedCode) {
    return null;
  }

  return (
    <div className={`w-full rounded-lg overflow-hidden border border-stone-200 ${className}`}>
      <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    </div>
  );
}
