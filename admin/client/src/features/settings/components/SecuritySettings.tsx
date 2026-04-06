export const SecuritySettings = ({
  level,
  onReview,
  busy,
}: {
  level: string
  onReview: () => void
  busy: boolean
}) => {
  return (
    <div className="panel">
      <p className="panel-title">Security Baseline</p>
      <p className="panel-sub">{level}</p>
      <button className="pill active" onClick={onReview} disabled={busy}>
        Review Controls
      </button>
    </div>
  )
}
