import { apiRequest } from '../../services/apiClient'

export type RolesPayload = {
  roles: string[]
  permissions: Record<string, string[]>
}

type AdminUsersResponse = {
  success: boolean
  data: {
    items: Array<{
      role: string
    }>
  }
}

const toTitleCase = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value

export const fetchRoles = async (): Promise<RolesPayload> => {
  const response = await apiRequest<AdminUsersResponse>('/api/admin/users?limit=500', {
    auth: true,
  })

  const uniqueRoles = Array.from(
    new Set(response.data.items.map((item) => toTitleCase(item.role)).filter(Boolean)),
  )

  return {
    roles: uniqueRoles,
    permissions: Object.fromEntries(uniqueRoles.map((role) => [role, []])),
  }
}
