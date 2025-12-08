'use client'

import Image from 'next/image'
// Use anchor to support static export inside Capacitor (file assets) by targeting explicit index.html
import { motion } from 'framer-motion'
import type { Product } from '@/lib/products-server'
import { useCart } from '@/context/cart-context'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart()

    const handleAddToCart = () => {
        // Avoid placing interactive button inside a Link to ensure reliable taps on mobile
        addToCart(product, 1)
    }

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group"
        >
            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="block">
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                            {product.name}
                        </h3>
                        <p className="text-3xl font-extrabold text-teal-700 mb-2">
                            {product.price.toLocaleString('en-IQ')} IQD
                        </p>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <motion.button
                        onClick={handleAddToCart}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-bold text-lg shadow-lg"
                    >
                        إضافة إلى السلة
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}
