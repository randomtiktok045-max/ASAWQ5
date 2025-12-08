'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '@/context/cart-context'
import CartItem from '@/components/CartItem'
import { supabase } from '@/lib/supabase'

export default function CartPage() {
    const { items, totalItems, totalPrice, clearCart } = useCart()
    const [customerName, setCustomerName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleCheckout = async () => {
        if (!customerName.trim()) {
            setError('الرجاء إدخال اسمك')
            return
        }

        if (items.length === 0) {
            setError('السلة فارغة')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: customerName,
                    total_amount: totalPrice,
                    status: 'pending',
                    notes: `طلب يحتوي على ${totalItems} منتج`,
                })
                .select()
                .single()

            if (orderError) throw orderError

            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity,
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            setOrderSuccess(true)
            clearCart()
            setCustomerName('')

            // Store last order id locally for footer status indicator
            try {
                if (order?.id) {
                    localStorage.setItem('last_order_id', String(order.id))
                }
            } catch {}

            setTimeout(() => setOrderSuccess(false), 5000)
        } catch (err: any) {
            console.error('Order submission error:', err)
            setError('حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (orderSuccess) {
        return (
            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto text-center"
                >
                    <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8">
                        <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-3xl font-bold text-green-700 mb-2">تم إرسال الطلب بنجاح!</h2>
                        <p className="text-gray-700">شكراً لك، سنتواصل معك قريباً</p>
                    </div>
                </motion.div>
            </main>
        )
    }

    if (items.length === 0) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto text-center">
                    <div className="mb-8">
                        <svg className="w-32 h-32 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">السلة فارغة</h2>
                    <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
                    <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        تصفح المنتجات
                    </a>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-5xl font-black mb-8 text-gray-900">
                    سلة التسوق
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 sticky top-4 shadow-xl border border-slate-200">
                            <h2 className="text-3xl font-black mb-6 text-gray-900">
                                ملخص الطلب
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-800 text-lg">
                                    <span className="font-bold">عدد المنتجات:</span>
                                    <span className="font-black text-2xl text-blue-600">{totalItems}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-4 flex justify-between text-2xl font-black">
                                    <span className="text-gray-800">المجموع الكلي:</span>
                                    <span className="text-teal-700">
                                        {totalPrice.toLocaleString('en-IQ')} IQD
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="customerName" className="block text-lg font-black text-gray-800 mb-3">
                                    الاسم الكامل *
                                </label>
                                <input
                                    type="text"
                                    id="customerName"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="أدخل اسمك الكامل"
                                    className="w-full px-5 py-4 border-2 border-blue-300 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 text-lg font-bold text-slate-900 placeholder-slate-500"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-xl text-red-800 text-base font-bold">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className="w-full py-5 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-colors font-black text-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                            >
                                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                            </button>

                            <button
                                onClick={clearCart}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-300"
                            >
                                إفراغ السلة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
