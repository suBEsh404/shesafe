import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { RoleTable } from './components/RoleTable'
import { PermissionMatrix } from './components/PermissionMatrix'
import { loadRoles } from './rolesSlice'
import { Loader } from '../../components/ui/Loader'
import { ErrorState } from '../../components/shared/ErrorState'

export const RolesPage = () => {
  const dispatch = useAppDispatch()
  const { roles, permissions, status, error } = useAppSelector(
    (state) => state.roles,
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadRoles())
    }
  }, [dispatch, status])

  return (
    <div className="content">
      <section className="page-title">
        <div>
          <h1>Roles & Permissions</h1>
          <p>Define security posture for each operational unit.</p>
        </div>
      </section>

      {status === 'loading' && <Loader />}
      {status === 'failed' && (
        <ErrorState message={error ?? 'Unable to load roles.'} />
      )}
      {status === 'succeeded' && (
        <section className="grid-2">
          <div className="panel table-panel">
            <div className="panel-header">
              <div>
                <p className="panel-title">Role Registry</p>
                <p className="panel-sub">Profiles synced across deployments</p>
              </div>
            </div>
            <RoleTable roles={roles} />
          </div>
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-title">Permission Matrix</p>
                <p className="panel-sub">Current entitlements</p>
              </div>
            </div>
            <PermissionMatrix permissions={permissions} />
          </div>
        </section>
      )}
    </div>
  )
}

export default RolesPage
