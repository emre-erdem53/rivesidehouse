import Link from "next/link";
import { site } from "@/lib/site";
import { clsx } from "@/lib/clsx";

const LOGO_RATIO = 505 / 494;

const LOGO_SIZES = {
  header: {
    width: 160,
    height: Math.round(160 / LOGO_RATIO),
    className:
      "h-[68px] w-auto max-w-[min(148px,46vw)] sm:h-20 sm:max-w-none md:h-24 lg:h-28",
  },
  footer: {
    width: 220,
    height: Math.round(220 / LOGO_RATIO),
    className: "h-32 w-auto max-w-[220px] sm:h-36 md:h-40",
  },
} as const;

/**
 * Hafif metin tabanlı wordmark (yedek / alternatif kullanım).
 */
export function Wordmark({
  href = "/",
  className,
  variant = "dark",
}: {
  href?: string;
  className?: string;
  variant?: "dark" | "light";
}) {
  const color = variant === "light" ? "text-on-primary" : "text-primary";
  return (
    <Link
      href={href}
      className={clsx(
        "font-headline-md text-headline-md tracking-tight leading-none",
        color,
        className
      )}
    >
      Riverside
      <span className="block font-label-sm uppercase tracking-[0.3em] opacity-70">
        Tiny House
      </span>
    </Link>
  );
}

/** Gerçek marka SVG logosu (siyah / beyaz). */
export function LogoMark({
  variant = "siyah",
  className,
  width = 200,
  height = Math.round(200 / LOGO_RATIO),
  priority = false,
}: {
  variant?: "siyah" | "beyaz";
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logo-${variant}.svg`}
      alt={site.name}
      width={width}
      height={height}
      className={clsx("block max-w-none object-contain", className)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(priority ? ({ fetchpriority: "high" } as any) : {})}
    />
  );
}

/** Header / footer için hazır boyutlu, tıklanabilir logo. */
export function LogoLink({
  size = "header",
  variant = "siyah",
  href = "/",
  className,
  priority,
}: {
  size?: keyof typeof LOGO_SIZES;
  variant?: "siyah" | "beyaz";
  href?: string;
  className?: string;
  priority?: boolean;
}) {
  const preset = LOGO_SIZES[size];

  return (
    <Link
      href={href}
      aria-label={site.name}
      className={clsx("inline-flex shrink-0 items-center", className)}
    >
      <LogoMark
        variant={variant}
        width={preset.width}
        height={preset.height}
        className={preset.className}
        priority={priority ?? size === "header"}
      />
    </Link>
  );
}
