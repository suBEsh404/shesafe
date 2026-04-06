export const EmptyState = ({
  title,
  message,
}: {
  title: string
  message: string
}) => {
  return (
    <div className="panel empty-state">
      <h3>{title}</h3>
      <p className="panel-sub">{message}</p>
    </div>
  )
}
