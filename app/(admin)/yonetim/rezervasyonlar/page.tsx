import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SyncButton } from "@/components/admin/SyncButton";
import { getReservations, type ReservationRow } from "@/lib/admin/queries";
import { formatCurrency, formatDate } from "@/lib/site";
import type { ReservationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const reservations = await getReservations();
  const pending = reservations.filter((r) => r.status === "PENDING").length;
  const confirmed = reservations.filter((r) => r.status === "CONFIRMED").length;

  const columns: Column<ReservationRow>[] = [
    {
      header: "Konuk",
      cell: (r) => (
        <div className="flex items-center gap-sm">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-label-md text-label-md">
            {r.guestName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <p className="font-medium">{r.guestName}</p>
            <p className="text-sm text-on-surface-variant">{r.code}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Tarih",
      cell: (r) => (
        <div>
          <p>
            {formatDate(r.checkIn)} – {formatDate(r.checkOut)}
          </p>
        </div>
      ),
    },
    { header: "Oda", cell: (r) => r.roomName },
    {
      header: "Kanal",
      cell: (r) => (
        <span className="capitalize text-on-surface-variant">{r.channel}</span>
      ),
    },
    {
      header: "Durum",
      cell: (r) => <StatusBadge status={r.status as ReservationStatus} />,
    },
    {
      header: "Tutar",
      align: "right",
      cell: (r) => (
        <span className="font-bold text-primary">
          {formatCurrency(r.totalAmount)}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Rezervasyonlar"
        subtitle="Misafir rezervasyonlarını yönetin ve izleyin."
        action={<SyncButton />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <SummaryCard
          label="Toplam Rezervasyon"
          value={reservations.length}
          icon="calendar_month"
          tone="primary"
        />
        <SummaryCard
          label="Onay Bekleyen"
          value={pending}
          icon="hourglass_empty"
          tone="secondary"
        />
        <SummaryCard
          label="Onaylanan"
          value={confirmed}
          icon="check_circle"
          tone="surface"
        />
      </div>

      <DataTable
        columns={columns}
        rows={reservations}
        getKey={(r) => r.id}
        empty="Henüz rezervasyon yok. HotelRunner senkronizasyonunu çalıştırın."
      />
    </>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: string;
  tone: "primary" | "secondary" | "surface";
}) {
  const tones = {
    primary: "bg-primary-container text-on-primary-container",
    secondary: "bg-secondary-container text-on-secondary-container",
    surface: "bg-surface-container-high text-on-surface",
  };
  return (
    <div className="mist-glass border border-outline-variant/20 rounded-xl p-md flex items-center justify-between shadow-sm">
      <div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
          {label}
        </p>
        <p className="font-headline-sm text-headline-sm text-primary">{value}</p>
      </div>
      <div
        className={`h-12 w-12 rounded-full flex items-center justify-center ${tones[tone]}`}
      >
        <Icon name={icon} />
      </div>
    </div>
  );
}
