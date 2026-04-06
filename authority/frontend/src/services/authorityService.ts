import {
  AuditLog,
  BackendAccessLog,
  BackendEvidence,
  Case,
  EvidenceItem,
  PaginatedResponse,
} from "../types/models";
import { mapAccessLog, mapEvidenceToCases, mapEvidenceToItem } from "../utils/transformers";
import { apiRequest } from "./apiClient";

type VerifyResponse = {
  evidenceId: string;
  status: "VALID_LOCAL" | "VALID_ON_CHAIN" | "INVALID";
  localMatch: boolean;
  chainMatch: boolean | null;
  chainStatus: "NOT_CONFIGURED" | "VERIFIED" | "MISMATCH" | "UNAVAILABLE";
  isBlockchainConfigured: boolean;
  recalculatedHash: string;
  blockchainHash: string;
};

export async function getAuthorityEvidence(token: string) {
  const response = await apiRequest<PaginatedResponse<BackendEvidence>>("/admin/all-evidence?limit=100", {
    token,
  });

  return response.items;
}

export async function getCases(token: string): Promise<Case[]> {
  const evidence = await getAuthorityEvidence(token);
  return mapEvidenceToCases(evidence);
}

export async function getCaseById(token: string, caseId?: string): Promise<Case | undefined> {
  const cases = await getCases(token);
  return cases.find((entry) => entry.id === caseId);
}

export async function getEvidence(token: string, caseId?: string): Promise<EvidenceItem[]> {
  const evidence = await getAuthorityEvidence(token);
  const filtered = caseId ? evidence.filter((item) => item.caseId === caseId) : evidence;
  return filtered.map(mapEvidenceToItem);
}

export async function getAuditLogs(token: string): Promise<AuditLog[]> {
  const response = await apiRequest<PaginatedResponse<BackendAccessLog>>("/admin/access-logs?limit=100", {
    token,
  });
  return response.items.map(mapAccessLog);
}

export async function verifyEvidenceById(token: string, evidenceId: string) {
  return apiRequest<VerifyResponse>(`/evidence/verify/${evidenceId}`, {
    method: "POST",
    token,
  });
}
