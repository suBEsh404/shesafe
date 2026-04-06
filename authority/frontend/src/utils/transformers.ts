import {
  AuditLog,
  BackendAccessLog,
  BackendEvidence,
  Case,
  EvidenceItem,
  EvidenceStatus,
} from "../types/models";

function formatFileSize(bytes?: number) {
  if (!bytes || Number.isNaN(bytes)) {
    return "--";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function mapBlockchainStatusToEvidenceStatus(
  status: BackendEvidence["blockchainStatus"],
): EvidenceStatus {
  if (status === "ON_CHAIN") {
    return "VERIFIED";
  }

  if (status === "FAILED" || status === "FAILED_RETRY") {
    return "FLAGGED";
  }

  return "PENDING";
}

export function mapEvidenceToItem(evidence: BackendEvidence): EvidenceItem {
  const owner =
    evidence.ownerUserId && typeof evidence.ownerUserId === "object"
      ? evidence.ownerUserId
      : null;

  return {
    id: evidence.id,
    caseId: evidence.caseId,
    title: `${evidence.type.toUpperCase()} Evidence Package`,
    type: evidence.type,
    status: mapBlockchainStatusToEvidenceStatus(evidence.blockchainStatus),
    hash: evidence.hash,
    timestamp: evidence.timestamp,
    fileSize: formatFileSize(
      evidence.files.reduce((sum, file) => sum + (file.size ?? 0), 0),
    ),
    previewUrl: evidence.fileUrls[0] ?? "",
    notes:
      typeof evidence.metadata.description === "string"
        ? evidence.metadata.description
        : `Evidence batch with ${evidence.files.length} file(s).`,
    blockchainTxHash: evidence.blockchainTxHash,
    blockchainStatus: evidence.blockchainStatus,
    filesCount: evidence.files.length,
    ownerName: owner?.name ?? evidence.ownerAlias ?? "Anonymous Submitter",
    ownerEmail: owner?.email ?? null,
    sessionId: evidence.sessionId,
    metadata: evidence.metadata,
  };
}

export function mapEvidenceToCases(evidenceItems: BackendEvidence[]): Case[] {
  const grouped = new Map<string, BackendEvidence[]>();

  evidenceItems.forEach((item) => {
    const existing = grouped.get(item.caseId) ?? [];
    existing.push(item);
    grouped.set(item.caseId, existing);
  });

  return Array.from(grouped.entries())
    .map(([caseId, items]) => {
      const sorted = [...items].sort(
        (left, right) =>
          new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
      );
      const latest = sorted[0];
      const statuses = sorted.map((item) =>
        mapBlockchainStatusToEvidenceStatus(item.blockchainStatus),
      );
      const caseStatus = statuses.includes("FLAGGED")
        ? "FLAGGED"
        : statuses.includes("PENDING")
          ? "PENDING"
          : "VERIFIED";
      const evidenceCount = sorted.reduce((sum, item) => sum + item.files.length, 0);

      return {
        id: caseId,
        title: `Case ${caseId}`,
        incidentType: latest.type.toUpperCase(),
        leadInvestigator:
          typeof latest.ownerUserId === "object" && latest.ownerUserId?.name
            ? latest.ownerUserId.name
            : latest.ownerAlias ?? "Authority Intake",
        priority: statuses.includes("FLAGGED")
          ? "Critical"
          : statuses.includes("PENDING")
            ? "High"
            : "Medium",
        status: caseStatus,
        createdAt: sorted[sorted.length - 1].createdAt,
        jurisdiction: "Authority Network",
        summary: `${sorted.length} evidence submission(s) recorded for this case.`,
        evidenceCount,
        alerts: [
          `${statuses.filter((status) => status === "FLAGGED").length} flagged record(s)`,
          `${sorted.filter((item) => item.blockchainStatus === "PENDING").length} pending blockchain write(s)`,
        ],
        lastUpdatedAt: latest.updatedAt,
      } satisfies Case;
    })
    .sort(
      (left, right) =>
        new Date(right.lastUpdatedAt).getTime() - new Date(left.lastUpdatedAt).getTime(),
    );
}

export function mapAccessLog(log: BackendAccessLog): AuditLog {
  const role = log.accessedBy?.role?.toUpperCase() ?? "UNKNOWN";
  return {
    id: log._id,
    investigator: log.accessedBy?.name ?? "System",
    badgeId: role,
    action: log.action,
    timestamp: log.createdAt,
    status:
      log.status === "allowed"
        ? "VERIFIED"
        : log.status === "pending"
          ? "PENDING"
          : "FLAGGED",
    evidenceId: log.evidenceId?._id ?? "--",
    caseId: log.evidenceId?.caseId ?? "--",
    details: log.details ?? {},
  };
}
