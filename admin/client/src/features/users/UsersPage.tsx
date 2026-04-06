import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { UsersTable } from './components/UsersTable'
import { UserActions } from './components/UserActions'
import { clearUsersActionMessage, loadUsers } from './usersSlice'
import { Loader } from '../../components/ui/Loader'
import { ErrorState } from '../../components/shared/ErrorState'

export const UsersPage = () => {
  const dispatch = useAppDispatch()
  const { users, status, error, actionMessage, actionStatus } = useAppSelector(
    (state) => state.users,
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadUsers())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (!actionMessage) return
    const timer = window.setTimeout(() => {
      dispatch(clearUsersActionMessage())
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [actionMessage, dispatch])

  return (
    <div className="content">
      <section className="page-title">
        <div>
          <h1>Users</h1>
          <p>Manage access, permissions, and operational roles.</p>
        </div>
        <UserActions />
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <div>
            <p className="panel-title">Active Operators</p>
            <p className="panel-sub">Live accounts across tactical units</p>
          </div>
        </div>
        {actionMessage && (
          <p className={actionStatus === 'failed' ? 'form-error' : 'panel-sub'}>
            {actionMessage}
          </p>
        )}
        {status === 'loading' && <Loader />}
        {status === 'failed' && (
          <ErrorState message={error ?? 'Unable to load users.'} />
        )}
        {status === 'succeeded' && <UsersTable users={users} />}
      </section>
    </div>
  )
}

export default UsersPage
