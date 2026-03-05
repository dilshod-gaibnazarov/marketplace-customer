"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { User, Phone, MapPin, Lock, Save, CreditCard, ArrowRight, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import { customerApi } from "@/services/api"
import { useAuthStore } from "@/store/auth.store"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const qc = useQueryClient()

  if (!isAuthenticated()) { router.push("/login"); return null }

  const { data: profile, isLoading } = useQuery({ queryKey: ["my-profile"], queryFn: customerApi.getProfile })
  const [form, setForm] = useState<any>({})
  const [pw, setPw] = useState({ password: "", confirm: "" })

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name, phone_number: profile.phone_number, address: profile.address || "" })
  }, [profile])

  const update = useMutation({
    mutationFn: customerApi.updateProfile,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-profile"] }); toast.success("Profil yangilandi!") },
  })

  const changePw = useMutation({
    mutationFn: () => customerApi.updateProfile({ password: pw.password }),
    onSuccess: () => { toast.success("Parol yangilandi!"); setPw({ password: "", confirm: "" }) },
  })

  const f = (k: string) => (e: any) => setForm((p: any) => ({ ...p, [k]: e.target.value }))

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-500" /></div>

  return (
    <div className="max-w-lg animate-in">
      <h1 className="text-2xl font-bold text-ink-900 font-display mb-6">Profilim</h1>

      {/* Avatar */}
      <div className="card p-5 mb-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25 flex-shrink-0">
          <span className="text-xl font-bold text-white">{profile?.full_name?.[0]?.toUpperCase()}</span>
        </div>
        <div>
          <p className="font-bold text-ink-900">{profile?.full_name}</p>
          <p className="text-sm text-ink-400 font-mono">{profile?.phone_number}</p>
        </div>
      </div>

      {/* Info form */}
      <div className="card p-5 mb-4 space-y-4">
        <h2 className="text-sm font-bold text-ink-900 flex items-center gap-2"><User size={14} className="text-primary-500" /> Ma'lumotlar</h2>
        <Input label="To'liq ism" icon={<User size={15} />} value={form.full_name || ""} onChange={f("full_name")} />
        <Input label="Telefon" icon={<Phone size={15} />} value={form.phone_number || ""} onChange={f("phone_number")} />
        <Input label="Manzil" icon={<MapPin size={15} />} value={form.address || ""} onChange={f("address")} placeholder="Toshkent, Chilonzor..." />
        <Button icon={<Save size={14} />} loading={update.isPending} onClick={() => update.mutate(form)}>
          Saqlash
        </Button>
      </div>

      {/* Password */}
      <div className="card p-5 mb-4 space-y-4">
        <h2 className="text-sm font-bold text-ink-900 flex items-center gap-2"><Lock size={14} className="text-primary-500" /> Parolni o'zgartirish</h2>
        <Input label="Yangi parol" type="password" placeholder="Min. 6 ta belgi" icon={<Lock size={15} />} value={pw.password} onChange={e => setPw(p => ({ ...p, password: e.target.value }))} />
        <Input
          label="Tasdiqlash"
          type="password"
          placeholder="Qayta kiriting"
          icon={<Lock size={15} />}
          value={pw.confirm}
          onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
          error={pw.confirm && pw.confirm !== pw.password ? "Parollar mos kelmaydi" : undefined}
        />
        <Button variant="outline" icon={<Lock size={14} />} loading={changePw.isPending} disabled={!pw.password || pw.password !== pw.confirm} onClick={() => changePw.mutate()}>
          Parolni yangilash
        </Button>
      </div>

      {/* Cards link */}
      <Link href="/profile/cards" className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center"><CreditCard size={16} className="text-primary-500" /></div>
          <div>
            <p className="text-sm font-bold text-ink-900">Kartalarim</p>
            <p className="text-xs text-ink-400">To'lov kartalarini boshqarish</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-ink-400" />
      </Link>
    </div>
  )
}