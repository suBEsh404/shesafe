import { useMemo } from 'react'
import { permissions } from '../config/permissions'
import { useAuth } from './useAuth'

export const usePermissions = () => {
  const { role } = useAuth()

  return useMemo(() => {
    return {
      canViewEvidence: permissions.canViewEvidence.includes(role),
      canManageUsers: permissions.canManageUsers.includes(role),
      canViewBlockchain: permissions.canViewBlockchain.includes(role),
    }
  }, [role])
}
