export type EvidenceStatus = 'verified' | 'flagged' | 'pending'

export interface EvidenceItem {
  id: string
  hash: string
  uploader: string
  type: string
  status: EvidenceStatus
  timestamp: string
}
