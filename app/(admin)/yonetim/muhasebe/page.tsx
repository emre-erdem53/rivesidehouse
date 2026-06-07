import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { getAccountingReport } from "@/lib/admin/accounting";
import type {
  ChannelRow,
  PeriodRow,
  RoomSalesRow,
} from "@/lib/admin/accounting";
import { formatCurrency, formatDate } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AccountingPage() {
  const report = await getAccountingReport();
  const { summary } = report;
  const maxWeekly = Math.max(...report.weeklyPeriods.map((p) => p.revenue), 1);
  const maxMonthly = Math.max(...report.monthlyPeriods.map((p) => p.revenue), 1);

  const roomColumns: Column<RoomSalesRow>[] = [
    { header: "Oda Tipi", cell: (r) => r.roomName },
    {
      header: "Haftalık Satış",
      align: "right",
      cell: (r) => `${r.weeklyUnits} gece`,
    },
    {
      header: "Aylık Satış",
      align: "right",
      cell: (r) => `${r.monthlyUnits} gece`,
    },
    {
      header: "Haftalık Gelir",
      align: "right",
      cell: (r) => formatCurrency(r.weeklyRevenue),
    },
    {
      header: "Aylık Gelir",
      align: "right",
      cell: (r) => (
        <span className="font-bold text-primary">
          {formatCurrency(r.monthlyRevenue)}
        </span>
      ),
    },
    {
      header: "Ort. Gecelik",
      align: "right",
      cell: (r) => formatCurrency(r.avgNightlyRate),
    },
    {
      header: "Pay",
      align: "right",
      cell: (r) => `%${r.revenueShare}`,
    },
  ];

  const channelColumns: Column<ChannelRow>[] = [
    { header: "Kanal", cell: (c) => c.label },
    {
      header: "Rezervasyon",
      align: "right",
      cell: (c) => c.reservations,
    },
    {
      header: "Gece",
      align: "right",
      cell: (c) => c.roomNights,
    },
    {
      header: "Brüt Gelir",
      align: "right",
      cell: (c) => formatCurrency(c.revenue),
    },
    {
      header: "Komisyon",
      align: "right",
      cell: (c) => (
        <span className="text-error">
          -{formatCurrency(c.commission)}{" "}
          <span className="text-on-surface-variant text-xs">
            (%{c.commissionRate})
          </span>
        </span>
      ),
    },
    {
      header: "Net Gelir",
      align: "right",
      cell: (c) => (
        <span className="font-bold text-primary">
          {formatCurrency(c.netRevenue)}
        </span>
      ),
    },
    {
      header: "Pay",
      align: "right",
      cell: (c) => `%${c.sharePercent}`,
    },
  ];

  return (
    <>
      <PageHeader
        title="Muhasebe"
        subtitle="Oda satışları, haftalık ve aylık gelir özeti, kanal komisyonları ve finansal göstergeler."
        action={
          summary.demoMode ? (
            <span className="inline-flex items-center gap-xs text-secondary font-label-sm bg-secondary-container/40 px-sm py-xs rounded-full">
              <Icon name="info" className="text-[18px]" />
              Sunum modu — demo veriler
            </span>
          ) : (
            <span className="font-label-sm text-on-surface-variant">
              Güncelleme: {formatDate(report.generatedAt)}
            </span>
          )
        }
      />

      {/* Özet kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md mb-lg">
        <KpiCard
          label="Haftalık Gelir"
          value={formatCurrency(summary.weeklyRevenue)}
          hint={`${summary.weeklyRoomNights} gece · ${summary.weeklyReservations} rezervasyon`}
          icon="date_range"
        />
        <KpiCard
          label="Aylık Gelir"
          value={formatCurrency(summary.monthlyRevenue)}
          hint={`${summary.monthlyRoomNights} gece · ${summary.monthlyReservations} rezervasyon`}
          icon="calendar_month"
          highlight
        />
        <KpiCard
          label="Yıllık Gelir"
          value={formatCurrency(summary.yearlyRevenue)}
          hint="Ocak – bugün"
          icon="trending_up"
        />
        <KpiCard
          label="Net Aylık Gelir"
          value={formatCurrency(summary.netRevenue)}
          hint={`Komisyon: ${formatCurrency(summary.channelCommission)}`}
          icon="account_balance"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md mb-lg">
        <KpiCard
          label="Ort. Gecelik Fiyat (ADR)"
          value={formatCurrency(summary.avgDailyRate)}
          icon="payments"
        />
        <KpiCard
          label="RevPAR"
          value={formatCurrency(summary.revPar)}
          hint="Oda başına günlük gelir"
          icon="hotel"
        />
        <KpiCard
          label="Bekleyen Tahsilat"
          value={formatCurrency(summary.pendingCollection)}
          hint="Onay bekleyen rezervasyonlar"
          icon="hourglass_empty"
        />
        <KpiCard
          label="İptal Tutarı"
          value={formatCurrency(summary.cancelledAmount)}
          hint="Bu ay iptal edilen"
          icon="cancel"
        />
      </div>

      {/* Haftalık & aylık grafikler */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-lg mb-lg">
        <PeriodChart
          title="Haftalık Gelir"
          subtitle="Son 8 hafta"
          periods={report.weeklyPeriods}
          maxValue={maxWeekly}
        />
        <PeriodChart
          title="Aylık Gelir"
          subtitle="Son 6 ay"
          periods={report.monthlyPeriods}
          maxValue={maxMonthly}
        />
      </div>

      {/* Oda bazlı satış */}
      <section className="mb-lg">
        <SectionTitle
          title="Oda Bazlı Satış"
          subtitle="Haftalık ve aylık gece satış adetleri ile gelir dağılımı"
        />
        <DataTable
          columns={roomColumns}
          rows={report.roomSales}
          getKey={(r) => r.invCode}
        />
      </section>

      {/* Kanal gelirleri */}
      <section className="mb-lg">
        <SectionTitle
          title="Kanal Gelirleri"
          subtitle="Aylık brüt gelir, komisyon kesintileri ve net gelir"
        />
        <DataTable
          columns={channelColumns}
          rows={report.channels}
          getKey={(c) => c.channel}
        />
      </section>

      {/* Finansal özet tablosu */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-lg shadow-sm">
        <SectionTitle title="Aylık Finansal Özet" />
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-md font-body-md text-body-md">
          <FinancialRow label="Brüt Konaklama Geliri" value={summary.grossRevenue} />
          <FinancialRow
            label="Kanal Komisyonları"
            value={-summary.channelCommission}
            negative
          />
          <FinancialRow label="Net Konaklama Geliri" value={summary.netRevenue} bold />
          <FinancialRow label="Bekleyen Tahsilat" value={summary.pendingCollection} />
          <FinancialRow label="İptal Edilen Tutar" value={-summary.cancelledAmount} negative />
          <FinancialRow
            label="Tahmini Tahsil Edilebilir"
            value={summary.netRevenue + summary.pendingCollection}
            bold
          />
        </dl>
      </section>
    </>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`mist-glass rounded-xl p-md border shadow-sm relative overflow-hidden ${
        highlight
          ? "border-primary/20 bg-primary-fixed-dim/10"
          : "border-outline-variant/10"
      }`}
    >
      <div className="absolute -right-3 -top-3 opacity-5 text-primary">
        <Icon name={icon} className="text-[72px]" />
      </div>
      <p className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-xs">
        {label}
      </p>
      <p className="font-headline-sm text-headline-sm text-primary">{value}</p>
      {hint && (
        <p className="mt-xs font-body-md text-body-md text-on-surface-variant text-sm">
          {hint}
        </p>
      )}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-md">
      <h3 className="font-headline-sm text-headline-sm text-primary">{title}</h3>
      {subtitle && (
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function PeriodChart({
  title,
  subtitle,
  periods,
  maxValue,
}: {
  title: string;
  subtitle: string;
  periods: PeriodRow[];
  maxValue: number;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/10 shadow-md">
      <div className="flex justify-between items-center mb-md">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-primary">
            {title}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="h-56 w-full flex items-end gap-xs px-xs border-b border-outline-variant/30 mb-sm">
        {[...periods].reverse().map((p) => (
          <div
            key={p.label}
            className="flex-1 bg-primary-fixed-dim/30 hover:bg-primary-fixed-dim transition-colors rounded-t-lg group relative min-w-0"
            style={{ height: `${Math.max(8, (p.revenue / maxValue) * 100)}%` }}
            title={`${p.label}: ${formatCurrency(p.revenue)}`}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] px-xs py-[2px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {formatCurrency(p.revenue)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-xs text-[10px] font-bold text-on-surface-variant opacity-70">
        {[...periods].reverse().map((p) => (
          <span key={p.label} className="flex-1 text-center truncate">
            {p.label}
          </span>
        ))}
      </div>
      <div className="mt-md grid grid-cols-3 gap-sm text-center text-sm">
        <div className="bg-surface-container-low rounded-lg p-sm">
          <p className="text-on-surface-variant text-xs">Ort. Doluluk</p>
          <p className="font-bold text-primary">
            %
            {Math.round(
              periods.reduce((a, p) => a + p.occupancy, 0) / periods.length
            )}
          </p>
        </div>
        <div className="bg-surface-container-low rounded-lg p-sm">
          <p className="text-on-surface-variant text-xs">Toplam Gece</p>
          <p className="font-bold text-primary">
            {periods.reduce((a, p) => a + p.roomNights, 0)}
          </p>
        </div>
        <div className="bg-surface-container-low rounded-lg p-sm">
          <p className="text-on-surface-variant text-xs">Toplam Gelir</p>
          <p className="font-bold text-primary">
            {formatCurrency(periods.reduce((a, p) => a + p.revenue, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}

function FinancialRow({
  label,
  value,
  bold,
  negative,
}: {
  label: string;
  value: number;
  bold?: boolean;
  negative?: boolean;
}) {
  const formatted = formatCurrency(Math.abs(value));
  const display = negative ? `-${formatted}` : formatted;
  return (
    <div className="flex justify-between items-center border-b border-outline-variant/10 pb-sm">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd
        className={`${bold ? "font-bold" : "font-medium"} ${
          negative ? "text-error" : "text-primary"
        }`}
      >
        {display}
      </dd>
    </div>
  );
}
