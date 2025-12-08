"use client"

import useSWR, { SWRConfiguration } from 'swr'
import { useEffect } from 'react'
import { supabase } from './supabase'
import type { Product, Category, PaginatedProducts } from './products-server'

// Use stable empty arrays to prevent infinite re-render loops caused by changing [] identities
const EMPTY_PRODUCTS: Product[] = []
const EMPTY_CATEGORIES: Category[] = []

// SWR configuration
const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
    dedupingInterval: 120000,
}

// Simple local cache using localStorage with TTL
const CACHE_PREFIX = 'aswaq-cache-v1'
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

type CacheEntry<T> = { ts: number; value: T }

function readCache<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = window.localStorage.getItem(key)
        if (!raw) return null
        const entry = JSON.parse(raw) as CacheEntry<T>
        if (!entry || typeof entry.ts !== 'number') return null
        const isFresh = Date.now() - entry.ts < CACHE_TTL_MS
        return isFresh ? entry.value : null
    } catch {
        return null
    }
}

function writeCache<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    try {
        const entry: CacheEntry<T> = { ts: Date.now(), value }
        window.localStorage.setItem(key, JSON.stringify(entry))
    } catch {
        // ignore write errors
    }
}

/**
 * Hook to fetch paginated products directly from Supabase
 */
export function useProducts(page: number = 1, limit: number = 12, options?: SWRConfiguration<PaginatedProducts>) {
    const swrKey = `products-${page}-${limit}`
    const cacheKey = `${CACHE_PREFIX}:${swrKey}`

    const { data, error, isLoading, mutate } = useSWR<PaginatedProducts>(
        swrKey,
        async () => {
            // Try local cache first
            const cached = readCache<PaginatedProducts>(cacheKey)
            if (cached) {
                return cached
            }

            const offset = (page - 1) * limit

            const [productsResult, countResult] = await Promise.all([
                supabase
                    .from('products')
                    .select('id, name, price, image, created_at')
                    .order('created_at', { ascending: false })
                    .range(offset, offset + limit - 1),
                supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true }),
            ])

            if (productsResult.error) throw productsResult.error

            const total = countResult.count || 0
            const totalPages = Math.ceil(total / limit)

            const payload: PaginatedProducts = {
                products: productsResult.data || [],
                total,
                page,
                limit,
                totalPages,
            }

            // Save to local cache
            writeCache(cacheKey, payload)
            return payload
        },
        { ...swrConfig, ...(options || {}) }
    )

    // تم إيقاف الاشتراك في التحديثات التلقائية (Realtime)

    return {
        products: data?.products || EMPTY_PRODUCTS,
        total: data?.total || 0,
        page: data?.page || page,
        limit: data?.limit || limit,
        totalPages: data?.totalPages || 0,
        isLoading,
        error,
        mutate,
    }
}

/**
 * Hook to fetch single product by ID directly from Supabase
 */
export function useProduct(id: string | null) {
    const { data, error, isLoading, mutate } = useSWR<Product | null>(
        id ? `product-${id}` : null,
        async () => {
            if (!id) return null

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                if (error.code === 'PGRST116') return null
                throw error
            }

            return data
        },
        swrConfig
    )

    // تم إيقاف الاشتراك في التحديثات التلقائية (Realtime) لصفحة المنتج

    return {
        product: data || null,
        isLoading,
        error,
        mutate,
    }
}

/**
 * Hook to fetch all categories directly from Supabase
 */
export function useCategories() {
    const swrKey = 'categories'
    const cacheKey = `${CACHE_PREFIX}:${swrKey}`
    const { data, error, isLoading, mutate } = useSWR<Category[]>(
        swrKey,
        async () => {
            const cached = readCache<Category[]>(cacheKey)
            if (cached) return cached

            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error

            const value = data || EMPTY_CATEGORIES
            writeCache(cacheKey, value)
            return value
        },
        swrConfig
    )

    return {
        categories: data || EMPTY_CATEGORIES,
        isLoading,
        error,
        mutate,
    }
}

/**
 * Hook to fetch products by category directly from Supabase
 */
export function useCategoryProducts(
    categoryId: string | null,
    page: number = 1,
    limit: number = 12
) {
    const swrKey = categoryId ? `category-${categoryId}-${page}-${limit}` : null
    const cacheKey = swrKey ? `${CACHE_PREFIX}:${swrKey}` : ''
    const { data, error, isLoading, mutate } = useSWR<PaginatedProducts>(
        swrKey,
        async () => {
            if (!categoryId) return { products: [], total: 0, page, limit, totalPages: 0 }

            const cached = cacheKey ? readCache<PaginatedProducts>(cacheKey) : null
            if (cached) return cached

            const offset = (page - 1) * limit

            const [productsResult, countResult] = await Promise.all([
                supabase
                    .from('products')
                    .select('id, name, price, image, created_at, category_id')
                    .eq('category_id', categoryId)
                    .order('created_at', { ascending: false })
                    .range(offset, offset + limit - 1),
                supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('category_id', categoryId),
            ])

            if (productsResult.error) throw productsResult.error

            const total = countResult.count || 0
            const totalPages = Math.ceil(total / limit)

            const payload: PaginatedProducts = {
                products: productsResult.data || [],
                total,
                page,
                limit,
                totalPages,
            }

            if (cacheKey) writeCache(cacheKey, payload)
            return payload
        },
        swrConfig
    )

    // تم إيقاف الاشتراك في التحديثات التلقائية (Realtime) لمنتجات الفئة

    return {
        products: data?.products || EMPTY_PRODUCTS,
        total: data?.total || 0,
        page: data?.page || page,
        limit: data?.limit || limit,
        totalPages: data?.totalPages || 0,
        isLoading,
        error,
        mutate,
    }
}
