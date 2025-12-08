"use client"

import { useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import { useProducts } from '@/lib/useProducts'
import type { Product } from '@/lib/products-server'

export default function HomeClient({ initialProducts }: { initialProducts: Product[] }) {
  const [page] = useState(1)
  const limit = 24

  const { products, isLoading } = useProducts(page, limit, {
    fallbackData: {
      products: initialProducts || [],
      total: (initialProducts || []).length,
      page: 1,
      limit,
      totalPages: 1,
    },
  })

  const [query, setQuery] = useState('')
  const filteredProducts = useMemo(() => {
    if (!query) return products
    const q = query.toLowerCase()
    return products.filter((p) => (p.name || '').toLowerCase().includes(q))
  }, [products, query])

  return (
    <div>
      <div className="mt-6 max-w-xl mx-auto">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {isLoading && products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">جارٍ تحميل المنتجات...</p>
        </div>
      ) : (query ? filteredProducts.length > 0 : products.length > 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {(query ? filteredProducts : products).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">لا توجد منتجات متاحة حالياً.</p>
        </div>
      )}
    </div>
  )
}