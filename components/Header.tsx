'use client'

import { useCart } from '@/context/cart-context'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Header() {
    const { totalItems } = useCart()

    return (
        <header className="sticky top-0 z-50 bg-slate-800 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <a href="/index.html" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                            <Image src="/logo.svg" alt="شعار أسواق سجاد" width={36} height={36} />
                        </div>
                        <span className="text-3xl font-black text-white drop-shadow-lg">
                            أسواق سجاد
                        </span>
                    </a>

                    <nav className="flex items-center gap-4">
                        <a href="/products.html" className="text-white hover:text-teal-200 transition-colors font-bold text-sm md:text-lg">
                            المنتجات
                        </a>
                        <a href="/categories.html" className="text-white hover:text-teal-200 transition-colors font-bold text-sm md:text-lg">
                            الفئات
                        </a>
                    </nav>

                    <a href="/cart.html" className="relative">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                        >
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>

                            {totalItems > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-teal-400 text-slate-900 text-sm rounded-full flex items-center justify-center font-black shadow-lg"
                                >
                                    {totalItems}
                                </motion.div>
                            )}
                        </motion.div>
                    </a>
                </div>
            </div>
        </header>
    )
}
