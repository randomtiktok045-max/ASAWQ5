export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-200" />

            {/* Content skeleton */}
            <div className="p-4">
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 rounded mb-3 w-full" />
                <div className="flex items-center justify-between">
                    <div className="h-8 bg-gray-200 rounded w-20" />
                    <div className="h-10 bg-gray-200 rounded w-24" />
                </div>
            </div>
        </div>
    )
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function CategoryCardSkeleton() {
    return (
        <div className="bg-gray-200 rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-2 w-2/3" />
            <div className="h-4 bg-gray-300 rounded w-1/3" />
        </div>
    )
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
            ))}
        </div>
    )
}
