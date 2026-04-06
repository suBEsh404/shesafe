import { useEffect } from 'react'
import { AlertTriangle, FileKey2, ShieldCheck, TimerReset } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { EvidenceTable } from './components/EvidenceTable'
import { loadEvidence } from './evidenceSlice'
import { Loader } from '../../components/ui/Loader'
import { ErrorState } from '../../components/shared/ErrorState'
import { EmptyState } from '../../components/shared/EmptyState'

export const EvidencePage = () => {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.evidence)
  const role = useAppSelector((state) => state.auth.role)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadEvidence())
    }
  }, [dispatch, status])

  const verifiedCount = items.filter((item) => item.status === 'verified').length
  const pendingCount = items.filter((item) => item.status === 'pending').length
  const flaggedCount = items.filter((item) => item.status === 'flagged').length

  const summaryCards = [
    {
      label: 'Verified',
      value: verifiedCount,
      note: 'Evidence items anchored and validated on chain',
      tone: 'verified',
      icon: ShieldCheck,
    },
    {
      label: 'Pending Review',
      value: pendingCount,
      note: 'Submissions awaiting supervisory validation',
      tone: 'pending',
      icon: TimerReset,
    },
    {
      label: 'Flagged',
      value: flaggedCount,
      note: 'Records requiring exception handling or escalation',
      tone: 'flagged',
      icon: AlertTriangle,
    },
    {
      label: 'Evidence Ledger IDs',
      value: items.length,
      note: 'Registered digital evidence packages in current queue',
      tone: 'default',
      icon: FileKey2,
    },
  ]

  return (
    <div className="content">
      <section className="page-title">
        <div>
          <p className="section-kicker">Evidence review</p>
          <h1>Secure Digital Evidence Register</h1>
          <p>
            Review blockchain-sealed submissions, monitor verification state,
            and inspect the current chain-of-custody intake queue.
          </p>
        </div>
      </section>

      <section className="grid-4">
        {summaryCards.map((card) => {
          const Icon = card.icon

          return (
            <article key={card.label} className={`metric-panel tone-${card.tone}`}>
              <div className="metric-panel-top">
                <span className="section-kicker">{card.label}</span>
                <Icon size={16} strokeWidth={2} />
              </div>
              <h3>{card.value}</h3>
              <p>{card.note}</p>
            </article>
          )
        })}
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <div>
            <p className="panel-title">Evidence Intake Queue</p>
            <p className="panel-sub">All registered submissions with blockchain integrity states</p>
          </div>
          <div className="panel-filters">
            <span className="filter-chip active">All items</span>
            <span className="filter-chip">Video / image</span>
            <span className="filter-chip">Escalated only</span>
          </div>
        </div>
        {status === 'loading' && <Loader />}
        {status === 'failed' && (
          <ErrorState message={error ?? 'Unable to load evidence.'} />
        )}
        {status === 'succeeded' && role !== 'admin' && (
          <EmptyState
            title="Administrative review required"
            message="Only authorized administrators can inspect the full evidence register."
          />
        )}
        {status === 'succeeded' && role === 'admin' && (
          <EvidenceTable items={items} />
        )}
      </section>
    </div>
  )
}

export default EvidencePage
