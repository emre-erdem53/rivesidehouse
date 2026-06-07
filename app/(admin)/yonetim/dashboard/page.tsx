import { auth } from "@/auth";
import { Icon } from "@/components/ui/Icon";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  getDashboardStats,
  getReservations,
  type ReservationRow,
} from "@/lib/admin/queries";
import { formatCurrency, formatDate } from "@/lib/site";
import type { ReservationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const [stats, reservations] = await Promise.all([
    getDashboardStats(),
    getReservations(),
  ]);
  const recent = reservations.slice(0, 5);

  // Basit aylık doluluk trendi (örnek görsel veri)
  const trend = [40, 55, 75, 85, 60, 90, stats.occupancy || 82];
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem"];

  const columns: Column<ReservationRow>[] = [
    {
      header: "Konuk",
      cell: (r) => (
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold text-xs">
            {r.guestName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <span className="font-body-md text-body-md">{r.guestName}</span>
        </div>
      ),
    },
    { header: "Oda", cell: (r) => r.roomName },
    {
      header: "Tarih",
      cell: (r) => (
        <span className="text-sm">
          {formatDate(r.checkIn)} – {formatDate(r.checkOut)}
        </span>
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
      <header className="mb-lg flex justify-between items-end">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary mb-xs">
            Hoş geldiniz, {session?.user?.name ?? "Yönetici"}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Riverside Tiny House bugün oldukça sakin ve huzurlu.
          </p>
        </div>
        {!stats.available && (
          <span className="flex items-center gap-xs text-secondary font-label-sm bg-secondary-container/40 px-sm py-xs rounded-full">
            <Icon name="info" className="text-[18px]" />
            Demo veri (veritabanı bağlı değil)
          </span>
        )}
      </header>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <StatCard
          label="Bugünkü Girişler"
          value={`${stats.todayCheckIns}`}
          suffix="konuk"
          icon="login"
        />
        <div className="bg-secondary-container rounded-xl p-md border border-outline-variant/10 shadow-sm relative overflow-hidden wood-texture">
          <h3 className="font-label-md text-label-md text-on-secondary-container mb-sm uppercase tracking-wider">
            Doluluk Oranı
          </h3>
          <span className="font-display-lg text-display-lg text-on-secondary-container">
            %{stats.occupancy}
          </span>
          <div className="mt-md w-full bg-surface/30 h-2 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full transition-all duration-1000"
              style={{ width: `${stats.occupancy}%` }}
            />
          </div>
          <p className="mt-sm text-xs text-on-secondary-fixed-variant">
            Toplam {stats.roomCount} odanın {stats.occupiedToday}&apos;i dolu
          </p>
        </div>
        <StatCard
          label="Aylık Gelir"
          value={formatCurrency(stats.monthlyRevenue)}
          icon="payments"
        />
      </div>

      {/* Doluluk trendi */}
      <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/10 shadow-md mb-lg">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-sm text-headline-sm text-primary">
            Doluluk Trendleri
          </h3>
          <span className="px-sm py-xs rounded-lg text-xs font-bold bg-primary text-on-primary">
            Aylık
          </span>
        </div>
        <div className="h-64 w-full flex items-end gap-sm px-xs border-b border-outline-variant/30">
          {trend.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-primary-fixed-dim/30 hover:bg-primary-fixed-dim transition-colors rounded-t-lg group relative"
              style={{ height: `${h}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] px-xs py-[2px] rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {h}%
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-sm text-xs font-bold text-on-surface-variant opacity-60 px-xs">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      {/* Son rezervasyonlar */}
      <section>
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-sm text-headline-sm text-primary">
            Son Rezervasyonlar
          </h3>
          <a
            href="/yonetim/rezervasyonlar"
            className="text-primary font-bold text-sm hover:underline"
          >
            Tümünü Gör
          </a>
        </div>
        <DataTable
          columns={columns}
          rows={recent}
          getKey={(r) => r.id}
          empty="Henüz rezervasyon yok. Senkronizasyonu çalıştırın veya yeni rezervasyon oluşturun."
        />
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: string;
}) {
  return (
    <div className="mist-glass rounded-xl p-md border border-outline-variant/10 shadow-sm relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-5 text-primary">
        <Icon name={icon} className="text-[80px]" />
      </div>
      <h3 className="font-label-md text-label-md text-secondary mb-sm uppercase tracking-wider">
        {label}
      </h3>
      <div className="flex items-baseline gap-xs">
        <span className="font-display-lg text-display-lg text-primary">
          {value}
        </span>
        {suffix && (
          <span className="font-body-md text-body-md text-on-surface-variant">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
