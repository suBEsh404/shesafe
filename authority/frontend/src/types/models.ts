export type EvidenceStatus = "VERIFIED" | "PENDING" | "FLAGGED";

export type EvidenceType = "emergency" | "report" | "travel";

export interface EvidenceItem {
  id: string;
  caseId: string;
  title: string;
  type: EvidenceType;
  status: EvidenceStatus;
  hash: string;
  timestamp: string;
  fileSize: string;
  previewUrl: string;
  notes: string;
  blockchainTxHash: string | null;
  blockchainStatus: "PENDING" | "ON_CHAIN" | "FAILED_RETRY" | "FAILED";
  filesCount: number;
  ownerName: string;
  ownerEmail: string | null;
  sessionId: string | null;
  metadata: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  investigator: string;
  badgeId: string;
  action: string;
  timestamp: string;
  status: EvidenceStatus;
  evidenceId: string;
  caseId: string;
  details: Record<string, unknown>;
}

export interface Case {
  id: string;
  title: string;
  incidentType: string;
  leadInvestigator: string;
  priority: "Critical" | "High" | "Medium";
  status: EvidenceStatus;
  createdAt: string;
  jurisdiction: string;
  summary: string;
  evidenceCount: number;
  alerts: string[];
  lastUpdatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "authority" | "admin";
  walletAddress: string | null;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface BackendEvidence {
  id: string;
  caseId: string;
  type: EvidenceType;
  timestamp: string;
  hash: string;
  blockchainTxHash: string | null;
  blockchainStatus: "PENDING" | "ON_CHAIN" | "FAILED_RETRY" | "FAILED";
  sessionId: string | null;
  isAnonymous: boolean;
  fileUrls: string[];
  cloudinaryIds: string[];
  files: Array<{
    order: number;
    label?: string;
    url: string;
    publicId: string;
    provider: "cloudinary" | "ipfs";
    mimeType?: string;
    size?: number;
    isEncrypted: boolean;
    iv: string | null;
    authTag: string | null;
    originalHash: string;
  }>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  ownerUserId?:
    | {
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
        role?: string;
        walletAddress?: string | null;
      }
    | string
    | null;
  ownerAlias?: string | null;
  walletAddress?: string | null;
}

export interface BackendAccessLog {
  _id: string;
  action: string;
  status: "allowed" | "blocked" | "pending";
  createdAt: string;
  details: Record<string, unknown>;
  accessedBy?:
    | {
        _id?: string;
        name?: string;
        email?: string;
        role?: string;
      }
    | null;
  evidenceId?:
    | {
        _id?: string;
        caseId?: string;
        hash?: string;
        type?: string;
        timestamp?: string;
        blockchainStatus?: string;
      }
    | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
