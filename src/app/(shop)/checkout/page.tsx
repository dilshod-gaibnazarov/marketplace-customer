"use client"
import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { CreditCard, MapPin, Package, CheckCircle2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useCartStore } from "@/store/cart.store"
import { useAuthStore } from "@/store/auth.store"
import { orderApi, paymentApi, customerApi } from "@/services/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { formatCurrency } from "@/lib/helpers"

const PAYMENT_TYPES = [
  { value: "CARD", label: "Karta orqali", icon: "💳" },
  { value: "CASH", label: "Naqd pul", icon: "💵" },
  { value: "ONLINE", label: "Online to'lov", icon: "📱" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [address, setAddress] = useState("")
  const [paymentType, setPaymentType] = useState("CARD")
  const [done, setDone] = useState(false)

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: customerApi.getProfile, enabled: isAuthenticated() })

  const createOrder = useMutation({
    mutationFn: orderApi.create,
    onSuccess: async (order) => {
      await paymentApi.create({ order_id: Number(order.id), type: paymentType })
      clearCart()
      setDone(true)
    },
    onError: () => toast.error("Buyurtma berishda xato yuz berdi"),
  })

  const handleOrder = () => {
    if (!address.trim()) return toast.error("Manzilni kiriting")
    if (items.length === 0) return toast.error("Savat bosh")
    createOrder.mutate({
      addresss: address,
      items: items.map(i => ({ product_id: i.id, amount: i.quantity })),
    })
  }

  if (!isAuthenticated()) { router.push("/login"); return null }

  if (done) return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in">
      <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center mb-5">
        <CheckCircle2 size={36} className="text-emerald-500" />
      </div>
      <h1 className="text-2xl font-bold text-ink-900 font-display mb-2">Buyurtma muvaffaqiyatli!</h1>
      <p className="text-ink-500 text-sm mb-8">Buyurtmangiz qabul qilindi va yetkazib beriladi</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.push("/orders")}>Buyurtmalarim</Button>
        <Button onClick={() => router.push("/products")}>Xaridni davom ettirish</Button>
      </div>
    </div>
  )

  return (
    <div className="animate-in">
      <h1 className="text-2xl font-bold text-ink-900 font-display mb-6">Buyurtma berish</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Address */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-ink-900 mb-4 flex items-center gap-2">
              <MapPin size={15} className="text-primary-500" /> Yetkazib berish manzili
            </h2>
            <Input
              placeholder="Shahar, tuman, ko'cha, uy raqami"
              icon={<MapPin size={15} />}
              value={address}
              onChange={e => setAddress(e.target.value)}
              defaultValue={profile?.address || ""}
            />
            {profile?.address && (
              <button
                onClick={() => setAddress(profile.address)}
                className="mt-2 text-xs text-primary-500 font-semibold hover:text-primary-600"
              >
                Profildan foydalanish: {profile.address}
              </button>
            )}
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-ink-900 mb-4 flex items-center gap-2">
              <CreditCard size={15} className="text-primary-500" /> To'lov usuli
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_TYPES.map(pt => (
                <button
                  key={pt.value}
                  onClick={() => setPaymentType(pt.value)}
                  className={`p-3 rounded-2xl border-2 text-center transition-all ${paymentType === pt.value ? "border-primary-500 bg-primary-50" : "border-ink-100 hover:border-ink-200"}`}
                >
                  <span className="text-xl block mb-1">{pt.icon}</span>
                  <span className={`text-xs font-semibold ${paymentType === pt.value ? "text-primary-700" : "text-ink-600"}`}>{pt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-ink-900 mb-4 flex items-center gap-2">
              <Package size={15} className="text-primary-500" /> Buyurtma tarkibi
            </h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ink-50 border border-ink-100 overflow-hidden flex-shrink-0">
                    {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : <Package size={14} className="m-auto mt-2 text-ink-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">{item.name}</p>
                    <p className="text-xs text-ink-400">{item.quantity} dona × {formatCurrency(item.price)}</p>
                  </div>
                  <p className="text-sm font-bold text-ink-900 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit sticky top-20">
          <h2 className="text-base font-bold text-ink-900 mb-4">Xulosa</h2>
          <div className="space-y-2 mb-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">Mahsulotlar</span>
              <span className="font-semibold">{items.length} xil</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">To'lov usuli</span>
              <span className="font-semibold">{PAYMENT_TYPES.find(p => p.value === paymentType)?.label}</span>
            </div>
          </div>
          <div className="border-t border-ink-100 py-3 flex justify-between mb-4">
            <span className="font-bold text-ink-900">Jami</span>
            <span className="font-bold text-xl text-ink-900">{formatCurrency(total())}</span>
          </div>
          <Button
            fullWidth size="lg"
            loading={createOrder.isPending}
            icon={createOrder.isPending ? undefined : <CheckCircle2 size={16} />}
            onClick={handleOrder}
          >
            Buyurtmani tasdiqlash
          </Button>
        </div>
      </div>
    </div>
  )
}