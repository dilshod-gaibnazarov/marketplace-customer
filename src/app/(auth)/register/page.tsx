"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { Package, User, Phone, Lock, MapPin, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/store/auth.store'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ full_name: '', phone_number: '', password: '', address: '' })
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }))

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.access_token, data.user)
      toast.success("Ro'yxatdan o'tdingiz! 🎉")
      router.push('/products')
    },
  })

  return (
    <div className="w-full max-w-sm animate-in">
      <div className="text-center mb-7">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-xl shadow-primary-500/25 mb-4">
          <Package size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 font-display">Hisob yaratish</h1>
        <p className="text-sm text-ink-400 mt-1">Xarid qilishni boshlang</p>
      </div>

      <div className="card p-7 shadow-xl shadow-ink-900/5 space-y-4">
        <Input label="To'liq ism" placeholder="Sardor Aliyev" icon={<User size={16} />} value={form.full_name} onChange={f('full_name')} />
        <Input label="Telefon" placeholder="+998901234567" icon={<Phone size={16} />} value={form.phone_number} onChange={f('phone_number')} />
        <Input label="Parol" type="password" placeholder="Min. 6 ta belgi" icon={<Lock size={16} />} value={form.password} onChange={f('password')} />
        <Input label="Manzil (ixtiyoriy)" placeholder="Toshkent, Chilonzor" icon={<MapPin size={16} />} value={form.address} onChange={f('address')} hint="Buyurtmalar yetkazilishi uchun" />
        <Button fullWidth size="lg" loading={isPending} onClick={() => mutate(form)}>
          Ro'yxatdan o'tish
        </Button>
      </div>

      <p className="text-center text-sm text-ink-400 mt-5">
        <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
          <ArrowLeft size={13} /> Kirish sahifasiga qaytish
        </Link>
      </p>
    </div>
  )
}