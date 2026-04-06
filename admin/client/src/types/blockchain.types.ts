export interface BlockchainTransaction {
  id: string
  hash: string
  validator: string
  status: 'confirmed' | 'pending'
  gas: number
  timestamp: string
}

export interface BlockSummary {
  id: string
  height: number
  txCount: number
  time: string
}
