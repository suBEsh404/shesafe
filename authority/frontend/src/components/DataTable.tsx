import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

type Column<T> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  emptyMessage: string;
  defaultSortKey?: keyof T | string;
};

export default function DataTable<T>({
  columns,
  data,
  searchPlaceholder = "Filter records",
  emptyMessage,
  defaultSortKey,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | undefined>(
    defaultSortKey ? String(defaultSortKey) : undefined,
  );
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    const filtered = data.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(normalizedQuery),
    );

    if (!sortKey) {
      return filtered;
    }

    return [...filtered].sort((left, right) => {
      const leftRecord = left as Record<string, unknown>;
      const rightRecord = right as Record<string, unknown>;
      const a = String(leftRecord[sortKey] ?? "");
      const b = String(rightRecord[sortKey] ?? "");
      return direction === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    });
  }, [data, direction, query, sortKey]);

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(columnKey);
    setDirection("asc");
  };

  return (
    <div className="rounded-xl border border-borderline bg-panel shadow-panel">
      <div className="flex flex-col gap-3 border-b border-borderline p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-state-gold">Records Registry</p>
          <h3 className="mt-1 text-lg font-semibold text-state-ivory">Operational Records</h3>
          <p className="text-sm text-state-slate">Sortable and searchable evidence ledger view.</p>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-borderline bg-white px-3 py-2 text-sm text-slate-700">
          <Search size={16} className="text-state-slate" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent outline-none placeholder:text-state-slate md:min-w-64"
          />
        </label>
      </div>

      {filteredRows.length === 0 ? (
        <div className="p-10 text-center text-sm text-state-slate">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-borderline text-left">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.18em] text-state-slate">
              <tr>
                {columns.map((column) => (
                  <th key={String(column.key)} className="px-4 py-3 font-medium">
                    <button
                      type="button"
                      className="flex items-center gap-2"
                      onClick={() => column.sortable && handleSort(String(column.key))}
                    >
                      <span>{column.header}</span>
                      {column.sortable &&
                        (sortKey === String(column.key) && direction === "asc" ? (
                          <ArrowUpAZ size={14} />
                        ) : (
                          <ArrowDownAZ size={14} />
                        ))}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-borderline text-sm text-slate-700">
              {filteredRows.map((row, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-transparent" : "bg-slate-50/70"} hover:bg-slate-100`}
                >
                  {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-4 align-top">
                      {column.render
                        ? column.render(row)
                        : String((row as Record<string, unknown>)[String(column.key)] ?? "--")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
