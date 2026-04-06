import { MapPinned, NotebookTabs, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useCaseDetail, useEvidence } from "../hooks/useAuthorityData";
import { useSelectedCase } from "../hooks/useSelectedCase";

export default function CaseDetail() {
  const { caseId } = useParams();
  const { setSelectedCaseId } = useSelectedCase();
  const { data: caseEntry, isLoading: caseLoading } = useCaseDetail(caseId);
  const { data: evidence, isLoading: evidenceLoading } = useEvidence(caseId);

  useEffect(() => {
    if (caseId) {
      setSelectedCaseId(caseId);
    }
  }, [caseId, setSelectedCaseId]);

  if (caseLoading) {
    return (
      <div className="rounded-xl border border-borderline bg-panel p-10 text-center text-sm text-state-slate">
        Loading case dossier...
      </div>
    );
  }

  if (!caseEntry) {
    return (
      <div className="rounded-xl border border-borderline bg-panel p-10 text-center text-sm text-state-slate">
        Case not found in backend evidence records.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-borderline bg-panel p-6 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-state-gold">{caseEntry.id}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{caseEntry.title}</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-600">{caseEntry.summary}</p>
          </div>
          <StatusBadge status={caseEntry.status} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-borderline bg-panel p-5 shadow-panel">
            <div className="mb-4 flex items-center gap-3">
              <NotebookTabs className="text-state-gold" />
              <h3 className="text-lg font-semibold text-slate-900">Case Information</h3>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-borderline bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Incident Type</dt>
                <dd className="mt-1 text-sm text-slate-900">{caseEntry.incidentType}</dd>
              </div>
              <div className="rounded-md border border-borderline bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Lead</dt>
                <dd className="mt-1 text-sm text-slate-900">{caseEntry.leadInvestigator}</dd>
              </div>
              <div className="rounded-md border border-borderline bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Created</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(caseEntry.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="rounded-md border border-borderline bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Updated</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(caseEntry.lastUpdatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-borderline bg-panel p-5 shadow-panel">
            <div className="mb-4 flex items-center gap-3">
              <MapPinned className="text-state-gold" />
              <h3 className="text-lg font-semibold text-slate-900">Evidence Map View</h3>
            </div>
            <div className="rounded-md border border-borderline bg-slate-50 p-5">
              <div className="rounded-md border border-borderline bg-white p-6">
                <p className="text-sm text-slate-600">
                  The backend currently stores location inside metadata for emergency or travel flows.
                </p>
                <p className="mt-4 text-sm text-slate-900">
                  Latest evidence package: {evidence?.[0]?.title ?? "No evidence available"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Coordinates are shown when submitted in metadata during upload.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-borderline bg-panel p-5 shadow-panel">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="text-state-gold" />
            <h3 className="text-lg font-semibold text-slate-900">Evidence Timeline</h3>
          </div>
          <div className="space-y-4">
            {evidenceLoading ? (
              <p className="text-sm text-slate-400">Loading evidence timeline...</p>
            ) : evidence && evidence.length > 0 ? (
              evidence.map((item) => (
                <div key={item.id} className="rounded-md border border-borderline bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.type} • {item.filesCount} file(s) • {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{item.notes}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No evidence registered for this case.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
