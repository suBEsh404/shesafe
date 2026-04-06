import { apiRequest } from '../../services/apiClient'
import { register } from '../../services/authApi'
import type { User, UserStatus } from '../../types/user.types'

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

type UpdateStatusResponse = {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    role: string
    status: User['status']
    lastActive: string
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

export const fetchAuthorities = async (): Promise<User[]> => {
  const response = await apiRequest<AdminUsersResponse>(
    '/api/admin/users?role=authority&limit=100',
    {
      auth: true,
    },
  )

  return response.data.items.map(mapUser)
}

export const createAuthority = async (payload: {
  name: string
  email: string
  password: string
  confirmPassword: string
}): Promise<void> => {
  await register({ ...payload, role: 'authority' })
}

export const changeAuthorityStatus = async (
  userId: string,
  status: Extract<UserStatus, 'active' | 'suspended'>,
): Promise<User> => {
  const response = await apiRequest<UpdateStatusResponse>(
    `/api/admin/users/${userId}/status`,
    {
      method: 'PATCH',
      auth: true,
      body: { status },
    },
  )

  return mapUser(response.data)
}
