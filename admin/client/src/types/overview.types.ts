export type LedgerRow = {
  hash: string
  event: string
  validator: string
  status: 'Confirmed' | 'Pending'
  time: string
}

export type ActiveUserPoint = {
  day: string
  value: number
}

export type ActivitySummaryCard = {
  title: string
  value: string
  note: string
  tone?: 'sky' | 'amber' | 'emerald'
}

export type WeeklyActivityCard = {
  day: string
  value: number
  summary: string
}

export type RecentProjectActivity = {
  id: string
  category: string
  title: string
  subject: string
  status: 'Confirmed' | 'Pending' | 'Flagged'
  note: string
  time: string
  reference: string
}
