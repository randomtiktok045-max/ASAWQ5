import { supabaseServer } from './supabase-server'
import { serverCache, cacheKeys } from './cache'

export interface Product {
    id: string
    name: string
    price: number
    description: string | null
    image: string | null
    category_id: string | null
    created_at: string
}

export interface Category {
    id: string
    name: string
    created_at: string
}

export interface PaginatedProducts {
    products: Product[]
    total: number
    page: number
    limit: number
    totalPages: number
}

/**
 * Get paginated products with caching
 */
export async function getProductsCached(
    page: number = 1,
    limit: number = 12
): Promise<PaginatedProducts> {
    const cacheKey = cacheKeys.products(page, limit)

    // Check cache first
    const cached = serverCache.get<PaginatedProducts>(cacheKey)
    if (cached) {
        return cached
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Fetch from Supabase
    const [productsResult, countResult] = await Promise.all([
        supabaseServer
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1),
        supabaseServer
            .from('products')
            .select('*', { count: 'exact', head: true }),
    ])

    if (productsResult.error) {
        throw new Error(`Failed to fetch products: ${productsResult.error.message}`)
    }

    const total = countResult.count || 0
    const totalPages = Math.ceil(total / limit)

    const result: PaginatedProducts = {
        products: productsResult.data || [],
        total,
        page,
        limit,
        totalPages,
    }

    // Cache the result
    serverCache.set(cacheKey, result)

    return result
}

/**
 * Get single product by ID with caching
 */
export async function getProductByIdCached(id: string): Promise<Product | null> {
    const cacheKey = cacheKeys.product(id)

    // Check cache first
    const cached = serverCache.get<Product>(cacheKey)
    if (cached) {
        return cached
    }

    // Fetch from Supabase
    const { data, error } = await supabaseServer
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            // Not found
            return null
        }
        throw new Error(`Failed to fetch product: ${error.message}`)
    }

    // Cache the result
    if (data) {
        serverCache.set(cacheKey, data)
    }

    return data
}

/**
 * Get all categories with caching
 */
export async function getCategoriesCached(): Promise<Category[]> {
    const cacheKey = cacheKeys.categories()

    // Check cache first
    const cached = serverCache.get<Category[]>(cacheKey)
    if (cached) {
        return cached
    }

    // Fetch from Supabase
    const { data, error } = await supabaseServer
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    const categories = data || []

    // Cache the result
    serverCache.set(cacheKey, categories)

    return categories
}

/**
 * Get products by category with caching
 */
export async function getProductsByCategoryCached(
    categoryId: string,
    page: number = 1,
    limit: number = 12
): Promise<PaginatedProducts> {
    const cacheKey = cacheKeys.categoryProducts(categoryId, page, limit)

    // Check cache first
    const cached = serverCache.get<PaginatedProducts>(cacheKey)
    if (cached) {
        return cached
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Fetch from Supabase
    const [productsResult, countResult] = await Promise.all([
        supabaseServer
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1),
        supabaseServer
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', categoryId),
    ])

    if (productsResult.error) {
        throw new Error(`Failed to fetch products: ${productsResult.error.message}`)
    }

    const total = countResult.count || 0
    const totalPages = Math.ceil(total / limit)

    const result: PaginatedProducts = {
        products: productsResult.data || [],
        total,
        page,
        limit,
        totalPages,
    }

    // Cache the result
    serverCache.set(cacheKey, result)

    return result
}
