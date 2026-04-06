export const StorageMeter = ({
  used,
  total,
}: {
  used: number
  total: number
}) => {
  const percent = Math.round((used / total) * 100)

  return (
    <div className="panel">
      <p className="panel-title">Storage</p>
      <p className="panel-sub">{used} TB of {total} TB</p>
      <div className="meter">
        <div className="meter-fill" style={{ width: `${percent}%` }}></div>
      </div>
      <p className="muted">{percent}% utilised</p>
    </div>
  )
}
