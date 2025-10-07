import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? `input-${Math.random().toString(36).slice(2, 8)}`;

    return (
      <div className="grid gap-2">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-emerald-900">
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-900 shadow-sm transition placeholder:text-emerald-400 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-emerald-50",
            error ? "border-red-400" : undefined,
            className,
          )}
          {...props}
        />
        {hint && !error ? <p className="text-xs text-emerald-500">{hint}</p> : null}
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </div>
    );
  },
);

Input.displayName = "Input";
