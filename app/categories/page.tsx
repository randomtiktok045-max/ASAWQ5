"use client"

import { useCategories } from '@/lib/useProducts'
import CategoryCard from '@/components/CategoryCard'
import { CategoryGridSkeleton } from '@/components/LoadingSkeleton'

export default function CategoriesPage() {
    const { categories, isLoading } = useCategories()

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-bold mb-4 text-teal-700">
                    تسوّق حسب الفئة
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    تصفّح مجموعتنا الواسعة من المنتجات المُنظّمة حسب الفئات
                </p>
            </div>

            {isLoading ? (
                <CategoryGridSkeleton count={6} />
            ) : categories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-600 text-lg">لا توجد فئات.</p>
                </div>
            )}
        </main>
    )
}
