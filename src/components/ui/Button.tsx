import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ButtonVariants = "primary" | "secondary" | "ghost";

type ButtonSizes = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariants;
  size?: ButtonSizes;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
};

type ConditionalProps =
  | ({ as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: "link"; href: string } & Omit<ButtonHTMLAttributes<HTMLAnchorElement>, "href">);

export type ButtonProps = BaseProps & ConditionalProps;

const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<ButtonVariants, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-500",
  secondary: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
  ghost: "bg-transparent text-emerald-700 hover:bg-emerald-100",
};

const sizeStyles: Record<ButtonSizes, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className,
  children,
  as = "button",
  ...props
}: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  const content = (
    <span className="inline-flex items-center gap-2">
      {icon && iconPosition === "left" ? <span className="shrink-0">{icon}</span> : null}
      <span>{children}</span>
      {icon && iconPosition === "right" ? <span className="shrink-0">{icon}</span> : null}
    </span>
  );

  if (as === "link") {
    const { href, ...linkProps } = props as { href: string } & ButtonHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
