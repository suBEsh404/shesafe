import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import {
  getAuditLogs,
  getCaseById,
  getCases,
  getEvidence,
  verifyEvidenceById,
} from "../services/authorityService";

export function useCases() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["cases", session?.user.id],
    queryFn: () => getCases(session!.accessToken),
    enabled: Boolean(session?.accessToken),
  });
}

export function useCaseDetail(caseId?: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["case", caseId, session?.user.id],
    queryFn: () => getCaseById(session!.accessToken, caseId),
    enabled: Boolean(session?.accessToken && caseId),
  });
}

export function useEvidence(caseId?: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["evidence", caseId ?? "all", session?.user.id],
    queryFn: () => getEvidence(session!.accessToken, caseId),
    enabled: Boolean(session?.accessToken),
  });
}

export function useAuditLogs() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["audit-logs", session?.user.id],
    queryFn: () => getAuditLogs(session!.accessToken),
    enabled: Boolean(session?.accessToken),
  });
}

export function useVerifyEvidence() {
  const { session } = useAuth();

  return useMutation({
    mutationFn: (evidenceId: string) => verifyEvidenceById(session!.accessToken, evidenceId),
  });
}
