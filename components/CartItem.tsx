'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { CartItem as CartItemType } from '@/context/cart-context'
import { useCart } from '@/context/cart-context'

interface CartItemProps {
    item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeFromCart } = useCart()

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex gap-4"
        >
            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-xl font-bold text-blue-600">{item.price.toLocaleString('en-IQ')} IQD</p>
                <p className="text-sm text-gray-600 mt-1">
                    المجموع: {(item.price * item.quantity).toLocaleString('en-IQ')} IQD
                </p>

                <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                            −
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                        حذف
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
