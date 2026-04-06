import { apiRequest } from '../../services/apiClient'
import { formatDate } from '../../utils/formatDate'
import type { EvidenceItem } from '../../types/evidence.types'

export type AdminEvidenceResponse = {
  success: boolean
  data: {
    items: Array<{
      _id: string
      hash: string
      type: string
      timestamp: string
      blockchainStatus: string
      ownerAlias?: string
      isAnonymous?: boolean
      ownerUserId?: {
        name?: string
        email?: string
        role?: string
      }
    }>
    total: number
    page: number
    limit: number
    pages: number
  }
}

const mapStatus = (status: string): EvidenceItem['status'] => {
  switch (status) {
    case 'ON_CHAIN':
      return 'verified'
    case 'FAILED':
    case 'FAILED_RETRY':
      return 'flagged'
    default:
      return 'pending'
  }
}

export const fetchAdminEvidence = async (): Promise<EvidenceItem[]> => {
  const response = await apiRequest<AdminEvidenceResponse>('/api/admin/all-evidence', {
    auth: true,
  })

  return response.data.items.map((item) => ({
    id: item._id,
    hash: item.hash,
    uploader:
      item.ownerUserId?.name ||
      item.ownerAlias ||
      (item.isAnonymous ? 'Anonymous' : 'Unknown'),
    type: item.type,
    status: mapStatus(item.blockchainStatus),
    timestamp: formatDate(item.timestamp),
  }))
}
