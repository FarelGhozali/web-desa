import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-stone-700">
            {label}
          </label>
        )}
        <select
          className={cn(
            'w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900',
            'focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200',
            'disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
