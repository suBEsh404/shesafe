import { apiRequest } from '../../services/apiClient'
import type { BlockchainTransaction, BlockSummary } from '../../types/blockchain.types'

export type BlockchainPayload = {
  status: string
  latestBlocks: BlockSummary[]
  transactions: BlockchainTransaction[]
}

type AdminEvidenceResponse = {
  success: boolean
  data: {
    items: Array<{
      _id: string
      hash: string
      blockchainTxHash?: string
      blockchainStatus: string
      timestamp: string
      ownerAlias?: string
      ownerUserId?: {
        role?: string
        name?: string
      }
    }>
  }
}

export const fetchBlockchain = async (): Promise<BlockchainPayload> => {
  const response = await apiRequest<AdminEvidenceResponse>(
    '/api/admin/all-evidence?limit=100',
    {
      auth: true,
    },
  )

  const transactions: BlockchainTransaction[] = response.data.items.map((item) => ({
    id: item._id,
    hash: item.blockchainTxHash || item.hash,
    validator: item.ownerUserId?.name || item.ownerAlias || item.ownerUserId?.role || 'Unknown',
    status: item.blockchainStatus === 'ON_CHAIN' ? 'confirmed' : 'pending',
    gas: 0,
    timestamp: new Date(item.timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))

  const confirmed = transactions.filter((item) => item.status === 'confirmed').length
  const status =
    transactions.length === 0
      ? 'No Data'
      : confirmed / transactions.length >= 0.8
        ? 'Stable'
        : 'Degraded'

  return {
    status,
    latestBlocks: [] as BlockSummary[],
    transactions,
  }
}
