"use client"
import { X } from 'lucide-react'
import clsx from 'clsx'
import { useEffect } from 'react'
interface Props { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }
export function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative w-full bg-white rounded-3xl shadow-2xl border border-ink-100 animate-slide-up', { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size])}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100">
          <h3 className="text-base font-bold text-ink-900 font-display">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-ink-100 text-ink-400 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}