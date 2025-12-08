import { supabaseServer } from '@/lib/supabase-server'
import React from 'react'

// Pre-render dynamic product pages for static export
export async function generateStaticParams() {
  const { data, error } = await supabaseServer
    .from('products')
    .select('id')

  if (error) {
    console.error('Failed to fetch product ids for static export:', error.message)
    return []
  }

  return (data || []).map((p: { id: string }) => ({ id: p.id }))
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}