import { Lock, ShieldCheck } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAuditLogs } from "../hooks/useAuthorityData";
import { useAuth } from "../hooks/useAuth";
import { AuditLog } from "../types/models";

export default function AccessControl() {
  const { data: logs, isLoading } = useAuditLogs();
  const { session } = useAuth();

  const columns = [
    { key: "investigator", header: "Investigator", sortable: true },
    { key: "badgeId", header: "Role", sortable: true },
    { key: "action", header: "Action", sortable: true },
    { key: "caseId", header: "Case ID", sortable: true },
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (row: AuditLog) => new Date(row.timestamp).toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: AuditLog) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-xl border border-borderline bg-panel p-6 shadow-panel">
          <div className="flex items-center gap-3">
            <Lock className="text-state-gold" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-state-gold">Access Control</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Audit oversight</h2>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Reading live access events from the backend as <span className="font-semibold text-slate-900">authority</span>.
          </p>
        </div>

        <div className="rounded-xl border border-borderline bg-panel p-6 shadow-panel">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-state-gold" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-state-gold">Policy Snapshot</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">Integrated backend rules</h3>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Only `authority` accounts should access this dashboard.</li>
            <li>Evidence verification is executed server-side against stored files and hashes.</li>
            <li>Access events shown here come from persisted backend access logs.</li>
          </ul>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-xl border border-borderline bg-panel p-10 text-center text-sm text-state-slate">
          Loading audit logs...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={logs ?? []}
          defaultSortKey="timestamp"
          searchPlaceholder="Search audit logs"
          emptyMessage="No audit logs are currently available."
        />
      )}
    </div>
  );
}
