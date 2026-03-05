"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { Package, Phone, Lock, LogIn, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/store/auth.store'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ phone_number: '', password: '' })

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.access_token, data.user)
      toast.success('Xush kelibsiz! 👋')
      router.push('/products')
    },
  })

  return (
    <div className="w-full max-w-sm animate-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-2xl shadow-primary-500/30 mb-4">
          <Package size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 font-display">Xush kelibsiz!</h1>
        <p className="text-sm text-ink-500 mt-1">Hisobingizga kiring</p>
      </div>

      <div className="card p-7 shadow-xl shadow-ink-900/5 space-y-4">
        <Input
          label="Telefon raqam"
          placeholder="+998901234567"
          icon={<Phone size={16} />}
          value={form.phone_number}
          onChange={e => setForm(p => ({ ...p, phone_number: e.target.value }))}
        />
        <Input
          label="Parol"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={16} />}
          value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && mutate(form)}
        />
        <Button fullWidth size="lg" loading={isPending} icon={<LogIn size={15} />} onClick={() => mutate(form)}>
          Kirish
        </Button>
      </div>

      <p className="text-center text-sm text-ink-500 mt-5">
        Hisobingiz yo'qmi?{' '}
        <Link href="/register" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
          Ro'yxatdan o'ting <ArrowRight size={13} />
        </Link>
      </p>
    </div>
  )
}