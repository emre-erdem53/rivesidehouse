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
  sm: "px-md py-base text-label-sm",
  md: "px-md py-sm text-label-md",
  lg: "px-xl py-md text-label-md",
};

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
        "inline-flex items-center justify-center gap-2 rounded-full font-label-md transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
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
}: BaseProps & { href: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-label-md transition-all duration-300",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
