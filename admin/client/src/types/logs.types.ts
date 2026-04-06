export interface LogEntry {
  id: string
  actor: string
  action: string
  status: 'success' | 'warning' | 'error'
  time: string
}
