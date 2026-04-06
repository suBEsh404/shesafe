import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const Button = ({ children, className = '', ...props }: Props) => {
  return (
    <button className={`btn ${className}`} {...props}>
      {children}
    </button>
  )
}
