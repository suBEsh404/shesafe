import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { exportUsers, inviteUser } from '../usersSlice'

export const UserActions = () => {
  const dispatch = useAppDispatch()
  const actionStatus = useAppSelector((state) => state.users.actionStatus)

  const handleInvite = () => {
    const name = window.prompt('Invite user name')?.trim()
    if (!name) return

    const email = window.prompt('Invite user email')?.trim()
    if (!email) return

    dispatch(inviteUser({ name, email, role: 'authority' }))
  }

  const handleExport = () => {
    dispatch(exportUsers())
      .unwrap()
      .then((csv) => {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `admin-users-${new Date().toISOString()}.csv`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        URL.revokeObjectURL(url)
      })
      .catch(() => {})
  }

  return (
    <div className="panel-actions">
      <button
        className="pill active"
        onClick={handleInvite}
        disabled={actionStatus === 'loading'}
      >
        Invite
      </button>
      <button
        className="pill"
        onClick={handleExport}
        disabled={actionStatus === 'loading'}
      >
        Export
      </button>
    </div>
  )
}
