export const ErrorState = ({ message }: { message: string }) => {
  return (
    <div className="panel empty-state">
      <h3>Something went wrong</h3>
      <p className="panel-sub">{message}</p>
    </div>
  )
}
