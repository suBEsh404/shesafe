import type { BlockchainTransaction } from '../../../types/blockchain.types'

export const TransactionList = ({
  items,
}: {
  items: BlockchainTransaction[]
}) => {
  return (
    <div className="table">
      <div className="table-row head">
        <span>Hash</span>
        <span>Validator</span>
        <span>Status</span>
        <span>Gas</span>
        <span>Timestamp</span>
      </div>
      {items.map((item) => (
        <div key={item.id} className="table-row">
          <span className="hash" data-label="Hash">
            {item.hash}
          </span>
          <span data-label="Validator">{item.validator}</span>
          <span className={`status ${item.status}`} data-label="Status">
            <span className="status-dot" aria-hidden="true"></span>
            {item.status}
          </span>
          <span data-label="Gas">{item.gas} Gwei</span>
          <span className="muted" data-label="Timestamp">
            {item.timestamp}
          </span>
        </div>
      ))}
    </div>
  )
}
