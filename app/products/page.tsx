'use client'

import { useEffect, useMemo, useState } from 'react'
import { useProducts } from '@/lib/useProducts'
import ProductCard from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/LoadingSkeleton'
import SearchBar from '@/components/SearchBar'

export default function ProductsPage() {
    const [page, setPage] = useState(1)
    const limit = 24

    const { products, total, totalPages, isLoading } = useProducts(page, limit)

    // Accumulate products across pages
    const [allProducts, setAllProducts] = useState<typeof products>([])
    useEffect(() => {
        // Avoid state updates during loading to prevent re-render loops
        if (isLoading) return

        if (page === 1) {
            setAllProducts(products)
        } else if (products && products.length) {
            setAllProducts((prev) => {
                // avoid duplicates when SWR revalidates
                const existing = new Set(prev.map((p) => p.id))
                const merged = [...prev]
                products.forEach((p) => {
                    if (!existing.has(p.id)) merged.push(p)
                })
                return merged
            })
        }
    }, [products, page, isLoading])

    const canLoadMore = useMemo(() => page < (totalPages || 0), [page, totalPages])

    // Search state and client-side filtering
    const [query, setQuery] = useState('')
    const filteredProducts = useMemo(() => {
        if (!query) return allProducts
        const q = query.toLowerCase()
        return allProducts.filter((p) =>
            (p.name || '').toLowerCase().includes(q)
        )
    }, [allProducts, query])

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-5xl font-bold mb-3 text-teal-700">
                    كل المنتجات
                </h1>
                <p className="text-xl text-slate-600 mb-4">
                    الإجمالي: {total} منتجًا
                </p>
                <SearchBar value={query} onChange={setQuery} />
                {query && (
                    <p className="mt-3 text-sm text-slate-500">
                        نتائج البحث: {filteredProducts.length} منتجًا
                    </p>
                )}
            </div>

            {isLoading && page === 1 ? (
                <ProductGridSkeleton count={12} />
            ) : (query ? filteredProducts.length > 0 : allProducts.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {(query ? filteredProducts : allProducts).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-600 text-lg">
                        {query ? 'لا توجد نتائج مطابقة.' : 'لا توجد منتجات متاحة.'}
                    </p>
                </div>
            )}

            <div className="flex justify-center">
                {canLoadMore && (
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all font-bold text-lg shadow-md disabled:opacity-60"
                        disabled={isLoading}
                    >
                        {isLoading ? 'جارِ التحميل…' : 'تحميل المزيد'}
                    </button>
                )}
            </div>
        </main>
    )
}