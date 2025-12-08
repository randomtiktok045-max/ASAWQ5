'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type OrderStatus = 'pending' | 'processing' | 'prepared' | 'ready' | 'completed' | 'canceled' | 'unknown'

export default function FooterNav() {
  const [status, setStatus] = useState<OrderStatus>('unknown')

  useEffect(() => {
    let lastOrderId: string | null = null
    try {
      lastOrderId = localStorage.getItem('last_order_id')
    } catch {}

    const load = async () => {
      if (!lastOrderId) {
        setStatus('unknown')
        return
      }
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('id', lastOrderId)
        .single()
      if (error || !data) {
        setStatus('unknown')
        return
      }
      const s = (data.status as OrderStatus) || 'unknown'
      setStatus(s)
    }
    load()
  }, [])

  const statusColor = (() => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'text-yellow-500'
      case 'prepared':
      case 'ready':
      case 'completed':
        return 'text-green-600'
      default:
        return 'text-slate-400'
    }
  })()

  const statusText = (() => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'في الانتظار'
      case 'prepared':
      case 'ready':
      case 'completed':
        return 'جاهز'
      case 'canceled':
        return 'ملغى'
      default:
        return 'غير معروف'
    }
  })()

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center h-16">
          <a href="/index.html" className="justify-self-center flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-teal-700" aria-label="الصفحة الرئيسية">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6m6 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6" />
            </svg>
            <span className="text-xs font-medium">الصفحة الرئيسية</span>
          </a>

          <a href="/categories.html" className="justify-self-center flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-teal-700" aria-label="الفئات">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 8v-8h8v8h-8z" />
            </svg>
            <span className="text-xs font-medium">الفئات</span>
          </a>

          <div className="justify-self-center flex flex-col items-center justify-center gap-1 text-slate-700">
            <svg className={`w-6 h-6 ${statusColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs font-medium">{statusText}</span>
          </div>
        </div>
      </div>
    </nav>
  )
}