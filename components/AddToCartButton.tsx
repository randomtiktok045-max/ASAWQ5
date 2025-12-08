'use client'

import { useState } from 'react'
import type { Product } from '@/lib/products-server'
import { useCart } from '@/context/cart-context'

interface AddToCartButtonProps {
    product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        addToCart(product, quantity)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <label className="text-slate-800 font-bold text-lg">الكمية:</label>
                <div className="flex items-center border-2 border-teal-300 rounded-xl">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-5 py-3 hover:bg-teal-50 transition-colors font-bold text-xl"
                    >
                        −
                    </button>
                    <span className="px-8 py-3 border-x-2 border-teal-300 min-w-[5rem] text-center font-black text-2xl text-teal-700">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-5 py-3 hover:bg-teal-50 transition-colors font-bold text-xl"
                    >
                        +
                    </button>
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                className="w-full py-5 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-colors font-black text-xl shadow-xl"
            >
                إضافة إلى السلة
            </button>
        </div>
    )
}
