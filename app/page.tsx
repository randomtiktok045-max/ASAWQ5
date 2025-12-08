import ProductCard from '@/components/ProductCard'
import { supabaseServer } from '@/lib/supabase-server'
import HomeClient from '@/components/HomeClient'
import type { Product } from '@/lib/products-server'

export default async function Home() {
  const fetchProducts = supabaseServer
    .from('products')
    .select('id, name, price, image, created_at')
    .order('created_at', { ascending: false })

  const products: Product[] = await Promise.race([
    fetchProducts.then((res) => res.data || []),
    new Promise<Product[]>((resolve) => setTimeout(() => resolve([]), 8000)),
  ])

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center bg-teal-700 rounded-3xl p-12 shadow-xl">
          <h1 className="text-5xl font-black mb-4 text-white">
            مرحباً بك في أسواق سجاد
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto font-semibold">
            اكتشف منتجات رائعة بأسعار مميزة
          </p>
        </div>

        <HomeClient initialProducts={products} />
      </div>
    </main>
  )
}

