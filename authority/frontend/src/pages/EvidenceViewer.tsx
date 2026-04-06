import { Eye, FileDigit, Image as ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { useEvidence } from "../hooks/useAuthorityData";
import { useSelectedCase } from "../hooks/useSelectedCase";

export default function EvidenceViewer() {
  const { selectedCaseId } = useSelectedCase();
  const { data: evidence, isLoading } = useEvidence(selectedCaseId);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("");

  const featuredEvidence = useMemo(() => {
    const firstId = selectedEvidenceId || evidence?.[0]?.id;
    return evidence?.find((item) => item.id === firstId) ?? evidence?.[0];
  }, [evidence, selectedEvidenceId]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-borderline bg-panel p-6 shadow-panel">
        <p className="text-[11px] uppercase tracking-[0.25em] text-state-gold">Evidence Viewer</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Backend evidence package viewer</h2>
        <p className="mt-3 text-sm text-slate-600">
          Reviewing evidence for {selectedCaseId ?? "all cases"} using files returned by the backend.
        </p>
      </section>

      {isLoading ? (
        <div className="rounded-xl border border-borderline bg-panel p-10 text-center text-sm text-state-slate">
          Loading evidence viewer...
        </div>
      ) : !featuredEvidence ? (
        <div className="rounded-xl border border-borderline bg-panel p-10 text-center text-sm text-state-slate">
          No evidence is available for the current selection.
        </div>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-borderline bg-panel p-5 shadow-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ImageIcon className="text-state-gold" />
                <h3 className="text-lg font-semibold text-slate-900">Preview</h3>
              </div>
              <select
                value={featuredEvidence.id}
                onChange={(event) => setSelectedEvidenceId(event.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
              >
                {(evidence ?? []).map((item) => (
                  <option key={item.id} value={item.id} className="bg-steel">
                    {item.id} • {item.caseId}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-hidden rounded-md border border-borderline">
              {featuredEvidence.previewUrl ? (
                <img
                  src={featuredEvidence.previewUrl}
                  alt={featuredEvidence.title}
                  className="h-[420px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center bg-slate-50 text-sm text-state-slate">
                  No preview URL available for this evidence package.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-borderline bg-panel p-5 shadow-panel">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Eye className="text-state-gold" />
                  <h3 className="text-lg font-semibold text-slate-900">Evidence Metadata</h3>
                </div>
                <StatusBadge status={featuredEvidence.status} />
              </div>
              <div className="space-y-4 text-sm text-slate-600">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Owner</p>
                  <p className="mt-1 text-slate-900">{featuredEvidence.ownerName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Hash</p>
                  <p className="mt-1 break-all text-slate-900">{featuredEvidence.hash}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Timestamp</p>
                    <p className="mt-1 text-slate-900">
                      {new Date(featuredEvidence.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">File Size</p>
                    <p className="mt-1 text-slate-900">{featuredEvidence.fileSize}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</p>
                  <p className="mt-1 text-slate-900">{featuredEvidence.notes}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-borderline bg-panel p-5 shadow-panel">
              <div className="mb-4 flex items-center gap-3">
                <FileDigit className="text-state-gold" />
                <h3 className="text-lg font-semibold text-slate-900">Custody Markers</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <p>Case ID: {featuredEvidence.caseId}</p>
                <p>Evidence Type: {featuredEvidence.type}</p>
                <p>Blockchain Status: {featuredEvidence.blockchainStatus}</p>
                <p>Transaction Hash: {featuredEvidence.blockchainTxHash ?? "Pending / unavailable"}</p>
                <p>Session ID: {featuredEvidence.sessionId ?? "Not part of a batch session"}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
