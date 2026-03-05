"use client"
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { formatCurrency } from '@/lib/helpers'
import toast from 'react-hot-toast'

interface Props { product: any }

export function ProductCard({ product }: Props) {
  const { addItem, items } = useCartStore()
  const inCart = items.find(i => i.id === Number(product.id))

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: Number(product.id),
      name: product.name,
      price: Number(product.price),
      image_url: product.images?.[0]?.image_url,
      max_quantity: product.quantity,
    })
    toast.success("Savatga qo'shildi!", { icon: '🛒' })
  }

  return (
    <Link href={`/products/${product.id}`} className="group card hover:shadow-lg hover:border-ink-200 transition-all duration-200 overflow-hidden block">
      {/* Image */}
      <div className="aspect-square bg-ink-50 overflow-hidden relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0].image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-200">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        )}
        {product.quantity < 5 && product.quantity > 0 && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
            Kam qoldi
          </span>
        )}
        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-bold text-ink-500">Tugagan</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-primary-500 font-semibold mb-1">{product.category?.name}</p>
        <h3 className="text-sm font-bold text-ink-900 line-clamp-2 mb-2 leading-snug">{product.name}</h3>
        <p className="text-xs text-ink-400 mb-1">{product.saller?.company_name}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-base font-bold text-ink-900">{formatCurrency(product.price)}</p>
          <button
            onClick={handleAdd}
            disabled={product.quantity === 0}
            className={`p-2.5 rounded-xl transition-all ${inCart ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' : 'bg-ink-100 hover:bg-primary-500 hover:text-white text-ink-600'} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </Link>
  )
}