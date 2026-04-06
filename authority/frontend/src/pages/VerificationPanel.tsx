import { ShieldCheck, ShieldX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { useCases, useEvidence, useVerifyEvidence } from "../hooks/useAuthorityData";
import { useSelectedCase } from "../hooks/useSelectedCase";

export default function VerificationPanel() {
  const { selectedCaseId, setSelectedCaseId } = useSelectedCase();
  const { data: cases, isLoading: casesLoading } = useCases();
  const { data: evidence, isLoading } = useEvidence(selectedCaseId);
  const verifyEvidence = useVerifyEvidence();
  const [selectedEvidenceId, setSelectedEvidenceId] = useState("");
  const [hashQuery, setHashQuery] = useState("");
  const verificationError =
    verifyEvidence.error instanceof Error
      ? verifyEvidence.error.message
      : "Verification request failed.";

  useEffect(() => {
    if (!selectedCaseId && cases?.[0]?.id) {
      setSelectedCaseId(cases[0].id);
    }
  }, [cases, selectedCaseId, setSelectedCaseId]);

  useEffect(() => {
    if (selectedCaseId && cases && !cases.some((caseEntry) => caseEntry.id === selectedCaseId)) {
      setSelectedCaseId(cases[0]?.id);
    }
  }, [cases, selectedCaseId, setSelectedCaseId]);

  const filteredEvidence = useMemo(() => {
    return (evidence ?? []).filter((item) =>
      item.hash.toLowerCase().includes(hashQuery.toLowerCase()),
    );
  }, [evidence, hashQuery]);

  useEffect(() => {
    if (filteredEvidence[0]?.id) {
      setSelectedEvidenceId(filteredEvidence[0].id);
    } else {
      setSelectedEvidenceId("");
    }
  }, [filteredEvidence]);

  useEffect(() => {
    verifyEvidence.reset();
  }, [selectedCaseId, selectedEvidenceId]);

  const selectedEvidence = filteredEvidence.find((item) => item.id === selectedEvidenceId);
  const verificationTone =
    verifyEvidence.data?.status === "INVALID"
      ? "border-red-400/30 bg-red-500/10"
      : verifyEvidence.data?.status === "VALID_ON_CHAIN"
        ? "border-emerald-400/30 bg-emerald-500/10"
        : "border-amber-400/30 bg-amber-500/10";
  const verificationIcon =
    verifyEvidence.data?.status === "INVALID" ? (
      <ShieldX className="text-red-300" />
    ) : (
      <ShieldCheck
        className={
          verifyEvidence.data?.status === "VALID_ON_CHAIN"
            ? "text-emerald-300"
            : "text-amber-300"
        }
      />
    );
  const verificationLabel =
    verifyEvidence.data?.status === "VALID_ON_CHAIN"
      ? "Verification status: VALID ON CHAIN"
      : verifyEvidence.data?.status === "VALID_LOCAL"
        ? "Verification status: LOCAL INTEGRITY CONFIRMED"
        : "Verification status: INVALID";
  const chainStatusLabel =
    verifyEvidence.data?.chainStatus === "NOT_CONFIGURED"
      ? "Blockchain not configured"
      : verifyEvidence.data?.chainStatus === "VERIFIED"
        ? "Blockchain verified"
        : verifyEvidence.data?.chainStatus === "MISMATCH"
          ? "Blockchain mismatch"
          : "Blockchain unavailable";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="rounded-md border border-borderline bg-white p-6">
        <p className="text-[11px] uppercase tracking-[0.25em] text-state-gold">Verification Panel</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Backend evidence verification</h2>
        <p className="mt-3 text-sm text-slate-600">
          The backend verifies stored evidence by recalculating file hashes and optionally checking the blockchain.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-700">Case</label>
            <select
              value={selectedCaseId ?? ""}
              onChange={(event) => setSelectedCaseId(event.target.value || undefined)}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500"
              disabled={casesLoading || !cases?.length}
            >
              {!cases?.length ? (
                <option value="">No cases available</option>
              ) : (
                cases.map((caseEntry) => (
                  <option key={caseEntry.id} value={caseEntry.id} className="bg-steel">
                    {caseEntry.id} • {caseEntry.incidentType} • {caseEntry.evidenceCount} file(s)
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-700">Hash Search</label>
            <input
              value={hashQuery}
              onChange={(event) => setHashQuery(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none placeholder:text-state-slate focus:border-blue-500"
              placeholder="Search stored evidence hash"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-700">Evidence Package</label>
            <select
              value={selectedEvidenceId}
              onChange={(event) => setSelectedEvidenceId(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500"
              disabled={!selectedCaseId || isLoading || filteredEvidence.length === 0}
            >
              {filteredEvidence.length === 0 ? (
                <option value="">
                  {selectedCaseId ? "No evidence available for this case" : "Select a case first"}
                </option>
              ) : (
                filteredEvidence.map((item) => (
                  <option key={item.id} value={item.id} className="bg-steel">
                    {item.id} • {item.caseId} • {item.type}
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            type="button"
            onClick={() => selectedEvidenceId && verifyEvidence.mutate(selectedEvidenceId)}
            disabled={!selectedEvidenceId || verifyEvidence.isPending}
            className="inline-flex items-center rounded-md border border-state-navy bg-state-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123159] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500"
          >
            Verify Evidence
          </button>
        </div>

        {selectedEvidence && (
          <div className="mt-6 rounded-md border border-borderline bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{selectedEvidence.title}</p>
            <p className="mt-2 break-all">{selectedEvidence.hash}</p>
            <div className="mt-3">
              <StatusBadge status={selectedEvidence.status} />
            </div>
          </div>
        )}
      </section>

      <section className="rounded-md border border-borderline bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900">Verification Result</h3>
        <p className="text-sm text-state-slate">Response from `POST /api/evidence/verify/:id`.</p>

        {!verifyEvidence.data && !verifyEvidence.isPending && (
          <div className="mt-6 rounded-md border border-dashed border-borderline p-10 text-center text-sm text-state-slate">
            Select a case, choose one of its evidence packages, and run verification.
          </div>
        )}

        {verifyEvidence.isPending && (
          <div className="mt-6 rounded-md border border-borderline bg-slate-50 p-10 text-center text-sm text-state-slate">
            Recomputing file hashes and checking blockchain state...
          </div>
        )}

        {verifyEvidence.isError && (
          <div className="mt-6 rounded-md border border-red-400/30 bg-red-950/30 p-5 text-sm text-red-200">
            {verificationError}
          </div>
        )}

        {verifyEvidence.data && (
          <div className="mt-6 space-y-4">
            <div className={`rounded-md border p-5 ${verificationTone}`}>
              <div className="flex items-center gap-3">
                {verificationIcon}
                <p className="font-medium text-slate-900">{verificationLabel}</p>
              </div>
            </div>

            <div className="rounded-md border border-borderline bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Local Match</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {verifyEvidence.data.localMatch ? "True" : "False"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Chain Match</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {verifyEvidence.data.chainMatch === null
                      ? "Not Available"
                      : verifyEvidence.data.chainMatch
                        ? "True"
                        : "False"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Blockchain State</p>
                  <p className="mt-1 text-sm text-slate-900">{chainStatusLabel}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recalculated Hash</p>
                  <p className="mt-1 break-all text-sm text-slate-900">
                    {verifyEvidence.data.recalculatedHash}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stored Hash</p>
                  <p className="mt-1 break-all text-sm text-slate-900">
                    {verifyEvidence.data.blockchainHash}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
