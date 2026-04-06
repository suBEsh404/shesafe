export const KPIBox = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="panel small-card">
      <p className="panel-title">{label}</p>
      <p className="kpi-value">{value}</p>
    </div>
  )
}
