import { clsx } from "@/lib/clsx";
import type { ReservationStatus } from "@prisma/client";

const map: Record<ReservationStatus, { label: string; cls: string }> = {
  PENDING: {
    label: "Beklemede",
    cls: "bg-secondary-container text-on-secondary-container",
  },
  CONFIRMED: {
    label: "Onaylandı",
    cls: "bg-primary-fixed-dim/30 text-on-primary-fixed-variant",
  },
  CANCELLED: {
    label: "İptal Edildi",
    cls: "bg-error-container text-on-error-container",
  },
  CHECKED_IN: {
    label: "Giriş Yapıldı",
    cls: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
  CHECKED_OUT: {
    label: "Çıkış Yapıldı",
    cls: "bg-surface-container-high text-on-surface-variant",
  },
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const item = map[status] ?? map.PENDING;
  return (
    <span
      className={clsx(
        "inline-flex items-center px-sm py-xs rounded-full text-xs font-bold",
        item.cls
      )}
    >
      {item.label}
    </span>
  );
}
