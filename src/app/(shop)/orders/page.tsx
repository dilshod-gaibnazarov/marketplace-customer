"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Package, Loader2, X } from "lucide-react"
import toast from "react-hot-toast"
import { orderApi } from "@/services/api"
import { useAuthStore } from "@/store/auth.store"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { formatDateTime, formatCurrency, ORDER_STATUS } from "@/lib/helpers"

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const qc = useQueryClient()

  if (!isAuthenticated()) { router.push("/login"); return null }

  const { data: orders = [], isLoading } = useQuery({ queryKey: ["my-orders"], queryFn: orderApi.getMyOrders })

  const cancel = useMutation({
    mutationFn: orderApi.cancel,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-orders"] }); toast.success("Buyurtma bekor qilindi") },
  })

  return (
    <div className="animate-in">
      <h1 className="text-2xl font-bold text-ink-900 font-display mb-6">Buyurtmalarim</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-500" /></div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-ink-400">
          <div className="w-16 h-16 rounded-3xl bg-ink-100 flex items-center justify-center mb-4">
            <Package size={28} className="opacity-40" />
          </div>
          <p className="text-sm font-semibold text-ink-600 mb-1">Hali buyurtma yo'q</p>
          <p className="text-xs mb-5">Birinchi buyurtmangizni bering!</p>
          <Button onClick={() => router.push("/products")} size="lg">Xarid qilish</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const st = ORDER_STATUS[order.status] || { label: order.status, cls: "bg-ink-100 text-ink-600 border-ink-200", dot: "bg-ink-400" }
            return (
              <div key={order.id} className="card p-5 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-ink-900 font-mono">#{String(order.id)}</span>
                      <Badge label={st.label} className={st.cls} />
                    </div>
                    <p className="text-xs text-ink-400">{formatDateTime(order.date)}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{order.addresss}</p>
                  </div>
                  <div className="text-right">
                    {order.payment && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${order.payment.status === "PAID" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {order.payment.type} · {order.payment.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.order_items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-ink-50 rounded-2xl p-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-ink-100 overflow-hidden flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0].image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package size={14} className="text-ink-300" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink-900 truncate">{item.product?.name}</p>
                        <p className="text-xs text-ink-400">{item.amount} dona × {formatCurrency(item.product?.price)}</p>
                      </div>
                      <p className="text-sm font-bold text-ink-900 flex-shrink-0">{formatCurrency(Number(item.product?.price) * item.amount)}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                  <p className="text-sm font-bold text-ink-900">
                    Jami: {formatCurrency(order.order_items?.reduce((s: number, i: any) => s + Number(i.product?.price || 0) * i.amount, 0) || 0)}
                  </p>
                  {order.status === "PENDING" && (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<X size={13} />}
                      loading={cancel.isPending}
                      onClick={() => cancel.mutate(Number(order.id))}
                    >
                      Bekor qilish
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}