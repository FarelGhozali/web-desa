import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({
  header,
  footer,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-3xl border border-emerald-100 bg-white/80 shadow-sm backdrop-blur transition hover:shadow-md",
        className,
      )}
      {...props}
    >
      {header ? <header className="p-6 pb-0 text-lg font-semibold text-emerald-950">{header}</header> : null}
      <div className={cn("p-6", header ? "pt-4" : undefined)}>{children}</div>
      {footer ? <footer className="mt-auto px-6 pb-6 pt-0 text-sm text-emerald-700">{footer}</footer> : null}
    </article>
  );
}
