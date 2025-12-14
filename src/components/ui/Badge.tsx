import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-emerald-100/70 text-emerald-800 ring-1 ring-inset ring-emerald-700/20',
      success: 'bg-lime-100/80 text-lime-800 ring-1 ring-inset ring-lime-700/20',
      warning: 'bg-amber-100/80 text-amber-800 ring-1 ring-inset ring-amber-700/20',
      danger: 'bg-rose-100/80 text-rose-800 ring-1 ring-inset ring-rose-700/20',
      info: 'bg-sky-100/80 text-sky-800 ring-1 ring-inset ring-sky-700/20',
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
