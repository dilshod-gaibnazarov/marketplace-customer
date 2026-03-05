"use client"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, SlidersHorizontal, X } from "lucide-react"
import { productApi, categoryApi } from "@/services/api"
import { ProductCard } from "@/components/shop/ProductCard"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [catFilter, setCatFilter] = useState("")
  const [search, setSearch] = useState(searchParams.get("search") || "")

  useEffect(() => { setSearch(searchParams.get("search") || "") }, [searchParams])

  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: () => productApi.getAll() })
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: categoryApi.getAll })

  const filtered = products.filter((p: any) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !catFilter || String(p.category_id) === catFilter
    return matchSearch && matchCat
  })

  return (
    <div>
      <div className="mb-8 text-center py-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-primary-900">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #d946ef33 0%, transparent 60%)" }} />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display mb-2">Eng yaxshi mahsulotlar</h1>
          <p className="text-ink-400 text-sm">Kerakli narsani toping</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setCatFilter("")}
          className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${!catFilter ? "bg-ink-900 text-white shadow-sm" : "bg-white border border-ink-200 text-ink-600 hover:border-ink-300"}`}
        >Barchasi</button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setCatFilter(catFilter === String(cat.id) ? "" : String(cat.id))}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${catFilter === String(cat.id) ? "bg-primary-500 text-white shadow-md shadow-primary-500/25" : "bg-white border border-ink-200 text-ink-600 hover:border-ink-300"}`}
          >
            {cat.name}
            <span className="ml-1.5 text-xs opacity-60">{cat._count?.products}</span>
          </button>
        ))}
      </div>

      {search && (
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm text-ink-500">Qidiruv: <span className="font-semibold text-ink-900">"{search}"</span></p>
          <button onClick={() => setSearch("")} className="p-1 rounded-full hover:bg-ink-100 text-ink-400 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-ink-400">
          <SlidersHorizontal size={40} className="mb-3 opacity-30" />
          <p className="text-sm">Mahsulot topilmadi</p>
          <button onClick={() => { setSearch(""); setCatFilter("") }} className="mt-3 text-sm text-primary-500 font-semibold">Filtrni tozalash</button>
        </div>
      ) : (
        <>
          <p className="text-xs text-ink-400 mb-4">{filtered.length} ta mahsulot</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  )
}