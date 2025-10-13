import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminToolbarProps {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}

export default function AdminToolbar({ children, className, sticky = false }: AdminToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between',
        sticky && 'sticky top-20 z-10',
        className,
      )}
    >
      {children}
    </div>
  );
}
