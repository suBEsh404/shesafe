export const NetworkStatus = ({ status }: { status: string }) => {
  return (
    <div className="chip">
      <span className="status-dot" aria-hidden="true"></span>
      Network Status {status}
    </div>
  )
}
