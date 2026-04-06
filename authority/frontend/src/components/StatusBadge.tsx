import { EvidenceStatus } from "../types/models";

const statusStyles: Record<EvidenceStatus, string> = {
  VERIFIED: "bg-green-50 text-green-800 ring-1 ring-green-200",
  PENDING: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  FLAGGED: "bg-red-50 text-red-800 ring-1 ring-red-200",
};

type StatusBadgeProps = {
  status: EvidenceStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-[0.18em] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
