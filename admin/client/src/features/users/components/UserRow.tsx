import type { User } from '../../../types/user.types'
import { getStatusColor } from '../../../utils/getStatusColor'

interface Props {
  user: User
}

export const UserRow = ({ user }: Props) => {
  return (
    <div className="table-row">
      <span className="hash" data-label="User">{user.name}</span>
      <span data-label="Email">{user.email}</span>
      <span data-label="Role">{user.role}</span>
      <span className={getStatusColor(user.status)} data-label="Status">
        <span className="status-dot" aria-hidden="true"></span>
        {user.status}
      </span>
      <span className="muted" data-label="Last Active">{user.lastActive}</span>
    </div>
  )
}
