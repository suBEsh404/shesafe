import type { ReactNode } from 'react'

export const Table = ({ children }: { children: ReactNode }) => {
  return <div className="table">{children}</div>
}
