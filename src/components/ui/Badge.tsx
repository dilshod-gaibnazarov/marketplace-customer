"use client"
import clsx from 'clsx'
export function Badge({ label, className }: { label: string; className?: string }) {
  return <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', className)}>{label}</span>
}