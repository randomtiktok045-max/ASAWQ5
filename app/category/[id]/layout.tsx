import { supabaseServer } from '@/lib/supabase-server'
import React from 'react'

// Pre-render dynamic category pages for static export
export async function generateStaticParams() {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('id')

  if (error) {
    console.error('Failed to fetch category ids for static export:', error.message)
    return []
  }

  return (data || []).map((c: { id: string }) => ({ id: c.id }))
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children
}