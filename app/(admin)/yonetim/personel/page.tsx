import { PageHeader } from "@/components/admin/PageHeader";
import { AddStaffForm } from "@/components/admin/AddStaffForm";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Icon } from "@/components/ui/Icon";
import { getStaff } from "@/lib/admin/queries";
import { clsx } from "@/lib/clsx";

export const dynamic = "force-dynamic";

type StaffRow = Awaited<ReturnType<typeof getStaff>>[number];

export default async function StaffPage() {
  const staff = await getStaff();

  const columns: Column<StaffRow>[] = [
    {
      header: "Personel",
      cell: (s) => (
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
            {s.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <span className="font-body-md text-body-md">{s.fullName}</span>
        </div>
      ),
    },
    { header: "Görev", cell: (s) => s.role },
    { header: "Departman", cell: (s) => s.department ?? "—" },
    { header: "Vardiya", cell: (s) => s.shift ?? "—" },
    { header: "E-posta", cell: (s) => s.email ?? "—" },
    {
      header: "Durum",
      cell: (s) => (
        <span
          className={clsx(
            "inline-flex items-center gap-1 px-sm py-xs rounded-full text-xs font-bold",
            s.isActive
              ? "bg-primary-fixed-dim/30 text-on-primary-fixed-variant"
              : "bg-surface-container-high text-on-surface-variant"
          )}
        >
          <Icon
            name={s.isActive ? "check_circle" : "cancel"}
            className="text-[14px]"
          />
          {s.isActive ? "Aktif" : "Pasif"}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Personel"
        subtitle="Ekip üyelerini yönetin ve yeni personel ekleyin."
      />
      <AddStaffForm />
      <DataTable
        columns={columns}
        rows={staff}
        getKey={(s) => s.id}
        empty="Henüz personel kaydı yok. Yukarıdaki formdan ekleyin (veritabanı bağlantısı gerekir)."
      />
    </>
  );
}
