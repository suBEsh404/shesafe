import type { EvidenceItem } from '../../../types/evidence.types'
import { getStatusColor } from '../../../utils/getStatusColor'

export const FlagBadge = ({ status }: { status: EvidenceItem['status'] }) => {
  return (
    <span className={getStatusColor(status)}>
      <span className="status-dot" aria-hidden="true"></span>
      {status}
    </span>
  )
}
