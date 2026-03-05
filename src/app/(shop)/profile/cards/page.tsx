"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CreditCard, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import { customerApi } from "@/services/api"
import { useAuthStore } from "@/store/auth.store"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"

export default function CardsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ card_number: "", expire_date: "" })

  if (!isAuthenticated()) { router.push("/login"); return null }

  const { data: cards = [], isLoading } = useQuery({ queryKey: ["my-cards"], queryFn: customerApi.getCards })

  const add = useMutation({
    mutationFn: customerApi.addCard,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-cards"] }); toast.success("Karta qoshildi!"); setModal(false); setForm({ card_number: "", expire_date: "" }) },
  })

  const remove = useMutation({
    mutationFn: customerApi.removeCard,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-cards"] }); toast.success("Karta ochirildi") },
  })

  const formatCardNum = (val: string) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()

  return (
    <div className="max-w-lg animate-in">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="p-2 rounded-xl hover:bg-ink-100 text-ink-500 transition-colors"><ArrowLeft size={16} /></Link>
        <h1 className="text-xl font-bold text-ink-900 font-display">Kartalarim</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-primary-500" /></div>
      ) : (
        <div className="space-y-3 mb-4">
          {cards.map((card: any) => (
            <div key={card.id} className="relative overflow-hidden rounded-3xl p-5 text-white" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-6" />
              <div className="relative">
                <CreditCard size={24} className="mb-4 text-white/60" />
                <p className="text-lg font-bold font-mono tracking-widest mb-3">
                  {card.card_number.match(/.{1,4}/g)?.join(" ") || card.card_number}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Amal qilish muddati</p>
                    <p className="text-sm font-semibold font-mono">{card.expire_date}</p>
                  </div>
                  <button
                    onClick={() => remove.mutate(Number(card.id))}
                    className="p-2 rounded-xl bg-white/10 hover:bg-red-500/30 text-white/60 hover:text-white transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setModal(true)}
            className="w-full p-4 rounded-3xl border-2 border-dashed border-ink-200 hover:border-primary-400 flex items-center justify-center gap-2 text-ink-400 hover:text-primary-500 transition-all"
          >
            <Plus size={18} /> Yangi karta qoshish
          </button>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Karta qoshish">
        <div className="space-y-4">
          <Input
            label="Karta raqami"
            placeholder="0000 0000 0000 0000"
            icon={<CreditCard size={15} />}
            value={form.card_number}
            onChange={e => setForm(p => ({ ...p, card_number: formatCardNum(e.target.value) }))}
            maxLength={19}
          />
          <Input
            label="Amal qilish muddati"
            placeholder="MM/YY"
            value={form.expire_date}
            onChange={e => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 4)
              if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2)
              setForm(p => ({ ...p, expire_date: v }))
            }}
            maxLength={5}
          />
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setModal(false)}>Bekor</Button>
            <Button
              className="flex-1"
              loading={add.isPending}
              disabled={form.card_number.length < 19 || form.expire_date.length < 5}
              onClick={() => add.mutate({ ...form, card_number: form.card_number.replace(/\s/g, "") })}
            >Saqlash</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}