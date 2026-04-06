import type { BlockSummary } from '../../../types/blockchain.types'

export const BlockCard = ({ block }: { block: BlockSummary }) => {
  return (
    <div className="panel small-card">
      <p className="panel-title">Block #{block.height}</p>
      <p className="panel-sub">{block.txCount} transactions</p>
      <p className="muted">{block.time}</p>
    </div>
  )
}
