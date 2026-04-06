import type { User } from '../../../types/user.types'
import { UserRow } from './UserRow'

interface Props {
  users: User[]
}

export const UsersTable = ({ users }: Props) => {
  return (
    <div className="table">
      <div className="table-row head">
        <span>User</span>
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span>Last Active</span>
      </div>
      {users.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  )
}
