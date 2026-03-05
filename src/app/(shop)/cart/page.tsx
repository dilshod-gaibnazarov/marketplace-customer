"use client"
import { useCartStore } from "@/store/cart.store"
import { useAuthStore } from "@/store/auth.store"
import { Button } from "@/components/ui/Button"
import { formatCurrency } from "@/lib/helpers"
import { ShoppingCart, Plus, Minus, Trash2, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, updateQty, removeItem, total, itemCount } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  if (items.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 text-ink-400 animate-in">
      <div className="w-20 h-20 rounded-3xl bg-ink-100 flex items-center justify-center mb-4">
        <ShoppingCart size={32} className="opacity-40" />
      </div>
      <h2 className="text-lg font-bold text-ink-700 mb-1">Savat bosh</h2>
      <p className="text-sm mb-6">Mahsulotlarni qoshishni boshlang</p>
      <Link href="/products">
        <Button size="lg">Mahsulotlarga o'tish</Button>
      </Link>
    </div>
  )

  return (
    <div className="animate-in">
      <h1 className="text-2xl font-bold text-ink-900 font-display mb-6">
        Savat <span className="text-ink-400 font-normal text-lg">({itemCount()} ta mahsulot)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <div className="w-18 h-18 rounded-2xl bg-ink-50 overflow-hidden border border-ink-100 flex-shrink-0" style={{ width: 72, height: 72 }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package size={20} className="text-ink-300" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-ink-900 line-clamp-1">{item.name}</h3>
                <p className="text-sm font-bold text-primary-600 mt-0.5">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-ink-50 border border-ink-100 rounded-xl p-0.5">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg hover:bg-ink-200 flex items-center justify-center transition-colors">
                    <Minus size={12} className="text-ink-600" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.max_quantity}
                    className="w-7 h-7 rounded-lg hover:bg-ink-200 flex items-center justify-center transition-colors disabled:opacity-30"
                  >
                    <Plus size={12} className="text-ink-600" />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl hover:bg-red-50 text-ink-300 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="text-base font-bold text-ink-900 mb-4">Buyurtma xulosasi</h2>
            <div className="space-y-2.5 mb-5">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-ink-500 line-clamp-1 flex-1 mr-2">{item.name} × {item.quantity}</span>
                  <span className="font-semibold text-ink-700 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-ink-100 pt-2.5 flex justify-between">
                <span className="font-bold text-ink-900">Jami</span>
                <span className="font-bold text-lg text-ink-900">{formatCurrency(total())}</span>
              </div>
            </div>
            <Button
              fullWidth size="lg"
              icon={<ArrowRight size={16} />}
              onClick={() => { if (!isAuthenticated()) { router.push("/login"); return } router.push("/checkout") }}
            >
              Buyurtma berish
            </Button>
            <Link href="/products" className="block text-center text-sm text-ink-400 hover:text-ink-600 mt-3 transition-colors">
              Xaridni davom ettirish
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}