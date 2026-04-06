import type { ReactNode } from 'react'

export const Card = ({ children }: { children: ReactNode }) => {
  return <div className="panel">{children}</div>
}
