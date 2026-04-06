import type { InputHTMLAttributes } from 'react'

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={`input ${className}`} {...props} />
}
