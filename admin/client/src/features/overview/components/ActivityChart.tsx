import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ActiveUserPoint, LedgerRow } from '../../../types/overview.types'
import { BarChart } from '../../../components/charts/BarChart'
import { LineChart } from '../../../components/charts/LineChart'

interface ActivityChartProps {
  uploadBars: number[]
  activeUsers: ActiveUserPoint[]
}

export const ActivityChart = ({ uploadBars, activeUsers }: ActivityChartProps) => {
  const [range, setRange] = useState<'1M' | '3M'>('1M')
  const barData = useMemo(() => {
    const data = uploadBars.map((value, index) => ({
      name: `${index + 1}`,
      value,
    }))
    return range === '1M' ? data.slice(-14) : data
  }, [uploadBars, range])

  return (
    <section className="grid-2">
      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="panel-title">Daily Evidence Intake</p>
            <p className="panel-sub">Submission volumes received across the last 30 days</p>
          </div>
          <div className="panel-actions">
            <button
              className={range === '1M' ? 'pill active' : 'pill'}
              onClick={() => setRange('1M')}
            >
              1M
            </button>
            <button
              className={range === '3M' ? 'pill active' : 'pill'}
              onClick={() => setRange('3M')}
            >
              3M
            </button>
          </div>
        </div>
        <BarChart data={barData} />
      </article>

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="panel-title">Reviewer Activity</p>
            <p className="panel-sub">Operational reviewers active by day</p>
          </div>
          <span className="panel-meta">Current week</span>
        </div>
        <LineChart
          data={activeUsers.map((item) => ({
            name: item.day,
            value: item.value,
          }))}
        />
      </article>
    </section>
  )
}

interface LedgerTableProps {
  rows: LedgerRow[]
}

export const LedgerTable = ({ rows }: LedgerTableProps) => {
  const navigate = useNavigate()
  return (
    <section className="panel table-panel">
      <div className="panel-header">
        <div>
          <p className="panel-title">Recent Chain Activity</p>
          <p className="panel-sub">Latest blockchain confirmations linked to evidence custody</p>
        </div>
        <button className="link" onClick={() => navigate('/evidence')}>
          View review queue
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="table">
        <div className="table-row head">
          <span>Ledger Transaction</span>
          <span>Custody Event</span>
          <span>Validating Node</span>
          <span>Status</span>
          <span>Recorded At</span>
        </div>
        {rows.map((row) => (
          <div key={row.hash} className="table-row">
            <span className="hash" data-label="Ledger Transaction">
              {row.hash}
            </span>
            <span data-label="Custody Event">{row.event}</span>
            <span data-label="Validating Node">{row.validator}</span>
            <span
              className={`status ${row.status.toLowerCase()}`}
              data-label="Status"
            >
              <span className="status-dot" aria-hidden="true"></span>
              {row.status}
            </span>
            <span className="muted" data-label="Recorded At">
              {row.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
