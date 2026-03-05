"use client"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CustomerUser { id: string; full_name: string; phone_number: string }

interface AuthState {
  token: string | null
  user: CustomerUser | null
  setAuth: (token: string, user: CustomerUser) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null, user: null,
      setAuth: (token, user) => {
        if (typeof window !== 'undefined') localStorage.setItem('customer_token', token)
        set({ token, user })
      },
      logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('customer_token')
        set({ token: null, user: null })
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: 'customer-auth' }
  )
)
