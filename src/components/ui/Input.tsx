"use client"
import clsx from 'clsx'
import { forwardRef, InputHTMLAttributes } from 'react'
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; hint?: string; icon?: React.ReactNode
}
export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, hint, icon, className, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-ink-700">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
      <input ref={ref} className={clsx('w-full bg-white border rounded-2xl text-ink-900 placeholder-ink-300 text-sm py-3 transition-all focus:outline-none focus:ring-2', icon ? 'pl-11 pr-4' : 'px-4', error ? 'border-red-300 focus:ring-red-100 focus:border-red-400' : 'border-ink-200 focus:ring-primary-100 focus:border-primary-400', className)} {...props} />
    </div>
    {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
))
Input.displayName = 'Input'