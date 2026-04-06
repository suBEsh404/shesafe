export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'verified':
    case 'confirmed':
    case 'success':
      return 'status success'
    case 'pending':
    case 'warning':
      return 'status pending'
    case 'flagged':
    case 'error':
    case 'suspended':
      return 'status danger'
    default:
      return 'status'
  }
}
