export type UserStatus = 'active' | 'pending' | 'suspended'

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: UserStatus
  lastActive: string
}
