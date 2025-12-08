'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useProduct } from '@/lib/useProducts'
import AddToCartButton from '@/components/AddToCartButton'

export default function ProductDetailPage() {
    const params = useParams()
    const id = params.id as string
    const { product, isLoading } = useProduct(id)

    if (isLoading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-12 bg-gray-200 rounded animate-pulse" />
                            <div className="h-16 bg-gray-200 rounded animate-pulse w-1/3" />
                            <div className="h-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (!product) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">المنتج غير موجود</p>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-5xl font-black text-gray-800 mb-6 leading-tight">{product.name}</h1>
                        <div className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                            {product.price.toLocaleString('en-IQ')} IQD
                        </div>

                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </main>
    )
}

