import { FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useCases } from "../hooks/useAuthorityData";
import { useSelectedCase } from "../hooks/useSelectedCase";
import { Case } from "../types/models";

export default function CaseManagement() {
  const { data: cases, isLoading } = useCases();
  const { setSelectedCaseId } = useSelectedCase();

  const columns = [
    {
      key: "id",
      header: "Case ID",
      sortable: true,
      render: (row: Case) => (
        <button
          type="button"
          onClick={() => setSelectedCaseId(row.id)}
          className="text-left font-semibold text-state-ivory underline-offset-4 hover:underline"
        >
          {row.id}
        </button>
      ),
    },
    { key: "incidentType", header: "Type", sortable: true },
    { key: "leadInvestigator", header: "Owner / Submitter", sortable: true },
    { key: "evidenceCount", header: "Files", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: Case) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: Case) => (
        <Link
          to={`/cases/${row.id}`}
          onClick={() => setSelectedCaseId(row.id)}
          className="inline-flex rounded-md border border-state-navy bg-state-navy px-3 py-2 text-sm font-medium text-white"
        >
          Open Case
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-borderline bg-panel p-6 shadow-panel">
        <p className="text-[11px] uppercase tracking-[0.25em] text-state-gold">Case Management</p>
        <h2 className="mt-2 text-3xl font-semibold text-state-ivory">Case registry from backend evidence</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Cases are grouped dynamically from the backend `caseId` field across evidence packages.
        </p>
      </section>

      {isLoading ? (
        <div className="rounded-xl border border-borderline bg-panel p-10 text-center text-sm text-state-slate">
          Loading case ledger...
        </div>
      ) : !cases || cases.length === 0 ? (
        <div className="rounded-xl border border-borderline bg-panel p-10 text-center">
          <FolderOpen className="mx-auto mb-4 text-state-slate" size={28} />
          <p className="text-sm text-state-slate">No cases were derived from the backend yet.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={cases}
          defaultSortKey="id"
          searchPlaceholder="Search case records"
          emptyMessage="No case records available."
        />
      )}
    </div>
  );
}
