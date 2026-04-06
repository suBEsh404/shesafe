import type { User } from '../../types/user.types'
import { apiRequest } from '../../services/apiClient'
import { env } from '../../config/env'
import { getAccessToken } from '../../utils/authStorage'

type AdminUsersResponse = {
  success: boolean
  data: {
    items: Array<{
      id: string
      name: string
      email: string
      role: string
      status: User['status']
      lastActive: string
    }>
  }
}

type InviteUserResponse = {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    role: string
    status: User['status']
    invitedAt: string
  }
}

const titleCase = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value

const mapUser = (item: {
  id: string
  name: string
  email: string
  role: string
  status: User['status']
  lastActive: string
}): User => ({
  id: item.id,
  name: item.name,
  email: item.email,
  role: titleCase(item.role),
  status: item.status,
  lastActive: item.lastActive,
})

export const fetchUsers = async (): Promise<User[]> => {
  const response = await apiRequest<AdminUsersResponse>('/api/admin/users', {
    auth: true,
  })
  return response.data.items.map(mapUser)
}

export const inviteAdminUser = async (payload: {
  name: string
  email: string
  role?: 'user' | 'authority' | 'admin'
}): Promise<InviteUserResponse['data']> => {
  const response = await apiRequest<InviteUserResponse>('/api/admin/users/invite', {
    method: 'POST',
    auth: true,
    body: payload,
  })

  return response.data
}

export const exportAdminUsersCsv = async (): Promise<string> => {
  const accessToken = getAccessToken()
  const response = await fetch(`${env.apiBaseUrl}/api/admin/users/export?format=csv`, {
    headers: {
      Accept: 'text/csv',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error('Unable to export users.')
  }

  return response.text()
}
