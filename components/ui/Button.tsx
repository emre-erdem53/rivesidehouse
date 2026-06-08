import Link from "next/link";
import { clsx } from "@/lib/clsx";

type Variant = "primary" | "outline" | "ghost" | "secondary";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] shadow-sm",
  secondary:
    "bg-secondary-container text-on-secondary-container hover:opacity-90",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-on-primary",
  ghost: "text-primary hover:bg-surface-container",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-sm py-xs text-label-sm sm:min-h-11 sm:px-md sm:py-base",
  md: "min-h-11 px-md py-sm text-label-md sm:min-h-12 sm:px-lg",
  lg: "min-h-12 w-full px-lg py-sm text-label-md sm:w-auto sm:min-h-12 sm:px-xl sm:py-md",
};

const baseClass =
  "inline-flex max-w-full items-center justify-center gap-2 rounded-full font-label-md text-center transition-all duration-300 touch-manipulation whitespace-normal leading-snug sm:whitespace-nowrap";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        baseClass,
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  onClick,
}: BaseProps & { href: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        baseClass,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
