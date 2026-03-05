"use client"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { ShoppingCart, ArrowLeft, Package, Store, Minus, Plus, ImageIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { productApi } from "@/services/api"
import { useCartStore } from "@/store/cart.store"
import { Button } from "@/components/ui/Button"
import { formatCurrency } from "@/lib/helpers"

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addItem, items, updateQty } = useCartStore()
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getOne(Number(id)),
  })

  const cartItem = items.find(i => i.id === Number(id))

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: Number(product.id),
        name: product.name,
        price: Number(product.price),
        image_url: product.images?.[0]?.image_url,
        max_quantity: product.quantity,
      })
    }
    toast.success(`${qty} ta mahsulot savatga qoshildi!`, { icon: "🛒" })
  }

  if (isLoading) return (
    <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-500" /></div>
  )
  if (!product) return <div className="text-center py-20 text-ink-400">Mahsulot topilmadi</div>

  const images = product.images || []

  return (
    <div className="animate-in">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 mb-6 transition-colors">
        <ArrowLeft size={16} /> Orqaga
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-ink-50 rounded-3xl overflow-hidden border border-ink-100">
            {images[activeImg] ? (
              <img src={images[activeImg].image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-200">
                <Package size={60} />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${i === activeImg ? "border-primary-500 shadow-md shadow-primary-500/20" : "border-ink-100 hover:border-ink-200"}`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-primary-500 mb-1">{product.category?.name}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 font-display leading-tight">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-ink-900">{formatCurrency(product.price)}</p>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${product.quantity > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
              {product.quantity > 0 ? `${product.quantity} dona mavjud` : "Tugagan"}
            </span>
          </div>

          {product.description && (
            <div className="bg-ink-50 rounded-2xl p-4">
              <p className="text-sm text-ink-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="flex items-center gap-3 py-4 border-t border-ink-100">
            <div className="w-9 h-9 rounded-xl bg-ink-100 flex items-center justify-center flex-shrink-0">
              <Store size={15} className="text-ink-500" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Sotuvchi</p>
              <p className="text-sm font-semibold text-ink-800">{product.saller?.company_name}</p>
              <p className="text-xs text-ink-400">{product.saller?.address}</p>
            </div>
          </div>

          {product.quantity > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-ink-700">Miqdor:</p>
                <div className="flex items-center gap-2 bg-ink-50 border border-ink-200 rounded-2xl p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-xl hover:bg-ink-200 flex items-center justify-center text-ink-600 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-ink-900">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.quantity, qty + 1))}
                    className="w-8 h-8 rounded-xl hover:bg-ink-200 flex items-center justify-center text-ink-600 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <Button
                fullWidth
                size="xl"
                icon={<ShoppingCart size={18} />}
                onClick={handleAdd}
                className="shadow-lg shadow-primary-500/20"
              >
                Savatga qoshish — {formatCurrency(Number(product.price) * qty)}
              </Button>
              {cartItem && (
                <p className="text-center text-xs text-ink-400">
                  Savatingizda: <span className="font-semibold text-ink-700">{cartItem.quantity} dona</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}