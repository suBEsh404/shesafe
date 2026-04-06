export const roleGuard = (role: string, allowed: string[]) => {
  return allowed.includes(role)
}
