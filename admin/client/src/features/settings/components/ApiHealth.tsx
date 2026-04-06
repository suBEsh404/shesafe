export const ApiHealth = ({ status }: { status: string }) => {
  return (
    <div className="panel">
      <p className="panel-title">API Health</p>
      <p className="panel-sub">{status}</p>
    </div>
  )
}
