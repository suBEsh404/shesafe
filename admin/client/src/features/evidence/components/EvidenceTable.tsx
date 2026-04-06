import type { EvidenceItem } from '../../../types/evidence.types'
import { FlagBadge } from './FlagBadge'
import { HashCell } from './HashCell'

export const EvidenceTable = ({ items }: { items: EvidenceItem[] }) => {
  return (
    <div className="table evidence-table">
      <div className="table-row head evidence-row">
        <span>Evidence ID</span>
        <span>Submitting Officer</span>
        <span>Material Type</span>
        <span>Integrity Status</span>
        <span>Received</span>
      </div>
      {items.map((item) => (
        <div key={item.id} className="table-row evidence-row">
          <span data-label="Evidence ID">
            <HashCell hash={item.hash} />
          </span>
          <span data-label="Submitting Officer">{item.uploader}</span>
          <span data-label="Material Type">{item.type}</span>
          <span data-label="Integrity Status">
            <FlagBadge status={item.status} />
          </span>
          <span className="muted" data-label="Received">
            {item.timestamp}
          </span>
        </div>
      ))}
    </div>
  )
}
