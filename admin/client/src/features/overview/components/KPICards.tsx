import { ShieldCheck, Clock3, AlertTriangle, Database } from 'lucide-react'
import type { KPI } from '../../../types/common.types'

interface Props {
  items: KPI[]
}

const iconMap = {
  sky: ShieldCheck,
  amber: Clock3,
  emerald: Database,
  default: AlertTriangle,
} as const

export const KPICards = ({ items }: Props) => {
  return (
    <section className="kpi-grid">
      {items.map((item) => (
        <article key={item.title} className={`kpi-card ${item.tone ?? ''}`}>
          <div className="kpi-top">
            <p className="kpi-title">{item.title}</p>
            <span className="kpi-icon" aria-hidden="true">
              {(item.tone ? iconMap[item.tone] : iconMap.default)({
                size: 16,
                strokeWidth: 2,
              })}
            </span>
          </div>
          <p className="kpi-value">{item.value}</p>
          <p className="kpi-trend">{item.trend}</p>
        </article>
      ))}
    </section>
  )
}
