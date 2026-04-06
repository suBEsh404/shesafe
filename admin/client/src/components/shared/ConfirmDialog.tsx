import { Button } from '../ui/Button'

export const ConfirmDialog = ({
  title,
  description,
  onConfirm,
  onCancel,
}: {
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
}) => {
  return (
    <div className="panel">
      <h3>{title}</h3>
      <p className="panel-sub">{description}</p>
      <div className="panel-actions">
        <Button onClick={onCancel}>Cancel</Button>
        <Button className="btn-primary" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  )
}
