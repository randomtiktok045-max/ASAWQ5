'use client'

import { useParams } from 'next/navigation'
import { useCategories, useCategoryProducts } from '@/lib/useProducts'
import ProductCard from '@/components/ProductCard'
import { ProductGridSkeleton } from '@/components/LoadingSkeleton'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import { useMemo, useState } from 'react'

export default function CategoryProductsPage() {
    const params = useParams()
    const id = params.id as string

    const { categories } = useCategories()
    const { products, isLoading } = useCategoryProducts(id, 1, 50)
    const [query, setQuery] = useState('')
    const filteredProducts = useMemo(() => {
        if (!query) return products
        const q = query.toLowerCase()
        return products.filter((p) => (p.name || '').toLowerCase().includes(q))
    }, [products, query])

    const category = categories.find((c) => c.id === id)

    if (isLoading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <ProductGridSkeleton count={12} />
            </main>
        )
    }

    if (!category) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">Category not found.</p>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-12">
                <Link href={process.env.NODE_ENV === 'production' ? '/categories.html' : '/categories'} className="text-teal-600 hover:text-teal-700 font-medium mb-4 inline-flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    الرجوع إلى الفئات
                </Link>

                <h1 className="text-5xl font-bold mb-4 text-teal-700">
                    {category.name}
                </h1>
                <p className="text-xl text-slate-600">
                    {products.length} {products.length === 1 ? 'منتج' : 'منتجات'} متاحة
                </p>
                <div className="mt-4">
                    <SearchBar value={query} onChange={setQuery} />
                    {query && (
                        <p className="mt-3 text-sm text-slate-500">
                            نتائج البحث: {filteredProducts.length} منتجًا
                        </p>
                    )}
                </div>
            </div>

            {(query ? filteredProducts.length > 0 : products.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {(query ? filteredProducts : products).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-600 text-lg">{query ? 'لا توجد نتائج مطابقة.' : 'لا توجد منتجات في هذه الفئة.'}</p>
                </div>
            )}
        </main>
    )
}

