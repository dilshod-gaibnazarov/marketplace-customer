import { format } from 'date-fns'
import { uz } from 'date-fns/locale'

export const formatDate = (d: string | Date) => format(new Date(d), 'dd MMM yyyy', { locale: uz })
export const formatDateTime = (d: string | Date) => format(new Date(d), 'dd MMM yyyy HH:mm', { locale: uz })
export const formatCurrency = (n: number | string) =>
  new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(Number(n))

export const ORDER_STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  PENDING:    { label: 'Kutilmoqda',    cls: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400' },
  PROCESSING: { label: 'Jarayonda',    cls: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-400' },
  SHIPPED:    { label: 'Yuborildi',    cls: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-400' },
  DELIVERED:  { label: 'Yetkazildi',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  CANCELLED:  { label: 'Bekor qilindi',cls: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-400' },
}
