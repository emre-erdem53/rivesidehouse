import { clsx } from "@/lib/clsx";

export type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  empty = "Kayıt bulunamadı.",
  getKey,
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: string;
  getKey: (row: T, index: number) => string;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/20">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={clsx(
                    "p-md font-label-md text-label-md text-secondary uppercase tracking-widest whitespace-nowrap",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-xl text-center text-on-surface-variant font-body-md"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={getKey(row, idx)}
                  className="hover:bg-surface-container/30 transition-colors"
                >
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className={clsx(
                        "p-md font-body-md text-body-md text-on-surface",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        col.className
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
