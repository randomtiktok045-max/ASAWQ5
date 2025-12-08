'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Category } from '@/lib/products-server'

interface CategoryCardProps {
    category: Category
    productCount?: number
}

export default function CategoryCard({ category, productCount }: CategoryCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Link href={`/category/${category.id}`}>
                <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-white relative overflow-hidden group">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-white transform rotate-45 scale-150 group-hover:scale-200 transition-transform duration-500" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                        {productCount !== undefined && (
                            <p className="text-emerald-100">
                                {productCount} {productCount === 1 ? 'product' : 'products'}
                            </p>
                        )}
                    </div>

                    {/* Arrow icon */}
                    <div className="absolute bottom-4 right-4 transform group-hover:translate-x-1 transition-transform">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
