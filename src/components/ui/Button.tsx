import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold uppercase tracking-[0.15em] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-500 focus-visible:ring-offset-stone-100',
      secondary: 'bg-amber-500 text-stone-900 hover:bg-amber-400 focus-visible:ring-amber-500 focus-visible:ring-offset-stone-100',
      outline: 'border-2 border-stone-400 text-stone-900 hover:bg-stone-100 hover:border-stone-500 focus-visible:ring-stone-400 focus-visible:ring-offset-stone-100',
      ghost: 'text-stone-700 hover:bg-emerald-50 focus-visible:ring-emerald-500 focus-visible:ring-offset-stone-100',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 focus-visible:ring-offset-stone-100',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
