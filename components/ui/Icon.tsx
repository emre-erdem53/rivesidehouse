import { clsx } from "@/lib/clsx";

export function Icon({
  name,
  className,
  fill = false,
  style,
}: {
  name: string;
  className?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={clsx("material-symbols-outlined", fill && "fill", className)}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
