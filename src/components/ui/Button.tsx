"use client"
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}
export function Button({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, fullWidth, ...props }: Props) {
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/20',
    secondary: 'bg-ink-900 hover:bg-ink-700 text-white shadow-sm',
    ghost: 'hover:bg-ink-100 text-ink-600 hover:text-ink-900',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
    outline: 'border border-ink-200 hover:border-ink-400 text-ink-700 bg-white hover:bg-ink-50',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-xl', md: 'px-4 py-2.5 text-sm gap-2 rounded-xl', lg: 'px-6 py-3 text-sm gap-2 rounded-2xl', xl: 'px-8 py-4 text-base gap-2.5 rounded-2xl' }
  return (
    <button
      className={clsx('inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}