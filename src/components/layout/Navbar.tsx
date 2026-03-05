"use client"
import Link from 'next/link'
import { ShoppingCart, User, Search, Package, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart.store'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { itemCount } = useCartStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const count = itemCount()

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-ink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/products" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/30">
            <Package size={15} className="text-white" />
          </div>
          <span className="text-base font-bold text-ink-900 font-display hidden sm:block">Marketplace</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              placeholder="Mahsulot qidirish..."
              className="w-full bg-ink-50 border border-ink-100 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder-ink-300"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value
                  router.push(`/products?search=${encodeURIComponent(val)}`)
                }
              }}
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link href="/cart" className="relative p-2.5 rounded-2xl hover:bg-ink-100 text-ink-600 hover:text-ink-900 transition-colors">
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md shadow-primary-500/40">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {/* User */}
          {isAuthenticated() ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-ink-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-600">{user?.full_name?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-ink-700 hidden sm:block max-w-20 truncate">{user?.full_name?.split(' ')[0]}</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-ink-100 rounded-2xl shadow-xl shadow-ink-900/10 py-1 animate-fade-in">
                  <Link href="/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                    <Package size={15} className="text-ink-400" /> Buyurtmalarim
                  </Link>
                  <Link href="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                    <User size={15} className="text-ink-400" /> Profil
                  </Link>
                  <div className="border-t border-ink-100 my-1" />
                  <button
                    onClick={() => { logout(); setUserOpen(false); router.push('/login') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 bg-ink-900 hover:bg-ink-700 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm">
              <User size={14} /> Kirish
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}