import {
  AlertTriangle,
  BriefcaseBusiness,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import MetricsCard from "../components/MetricsCard";
import StatusBadge from "../components/StatusBadge";
import { useAuditLogs, useCases, useEvidence } from "../hooks/useAuthorityData";
import { useAuth } from "../hooks/useAuth";

export default function DashboardOverview() {
  const { session } = useAuth();
  const { data: cases, isLoading: casesLoading } = useCases();
  const { data: evidence, isLoading: evidenceLoading } = useEvidence();
  const { data: logs, isLoading: logsLoading } = useAuditLogs();

  const flaggedEvidence = evidence?.filter((item) => item.status === "FLAGGED").length ?? 0;
  const verifiedEvidence = evidence?.filter((item) => item.status === "VERIFIED").length ?? 0;

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-borderline bg-white p-6">
        <div className="mb-4 h-1 w-24 rounded-full bg-state-gold/80" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-state-gold">Authority Operations Console</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Secure Evidence Oversight Dashboard
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Official authority interface for custody review, evidence verification, and
              operational audit supervision.
            </p>
          </div>
          <div className="rounded-md border border-borderline bg-slate-50 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.25em] text-state-slate">Session Holder</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{session?.user.name}</p>
            <p className="text-sm text-slate-600">Authority Division Access</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricsCard
          title="Active Cases"
          value={casesLoading ? "..." : cases?.length ?? 0}
          detail="Unique case IDs derived from backend evidence records."
          icon={<BriefcaseBusiness size={22} />}
        />
        <MetricsCard
          title="Evidence Packages"
          value={evidenceLoading ? "..." : evidence?.length ?? 0}
          detail="Evidence entries currently available through admin/authority APIs."
          icon={<Fingerprint size={22} />}
        />
        <MetricsCard
          title="Verified Records"
          value={evidenceLoading ? "..." : verifiedEvidence}
          detail="Packages already anchored on-chain or confirmed by status."
          icon={<ShieldCheck size={22} />}
        />
        <MetricsCard
          title="Flagged Records"
          value={evidenceLoading ? "..." : flaggedEvidence}
          detail="Packages with failed blockchain or integrity conditions."
          icon={<AlertTriangle size={22} />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-md border border-borderline bg-white p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-state-gold">Audit Feed</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Recent Access Activity</h3>
          <p className="mb-4 text-sm text-state-slate">Loaded from `/api/admin/access-logs`.</p>
          <div className="space-y-4">
            {logsLoading ? (
              <p className="text-sm text-slate-400">Loading access activity...</p>
            ) : logs && logs.length > 0 ? (
              logs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-3 rounded-lg border border-borderline bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {log.action} on case {log.caseId}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {log.investigator} • {log.badgeId}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                    <StatusBadge status={log.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No audit logs are currently available.</p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-borderline bg-white p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-state-gold">Alerts Desk</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Case Alerts</h3>
          <p className="text-sm text-state-slate">Grouped from evidence and blockchain status.</p>
          <div className="mt-4 space-y-4">
            {casesLoading ? (
              <p className="text-sm text-slate-400">Loading case alerts...</p>
            ) : cases && cases.length > 0 ? (
              cases.slice(0, 4).map((caseEntry) => (
                <div key={caseEntry.id} className="rounded-lg border border-borderline bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{caseEntry.title}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {caseEntry.id}
                      </p>
                    </div>
                    <StatusBadge status={caseEntry.status} />
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    {caseEntry.alerts.map((alert) => (
                      <p key={alert}>{alert}</p>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No cases found from current backend data.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
