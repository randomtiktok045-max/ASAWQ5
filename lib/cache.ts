import { LRUCache } from 'lru-cache'

// Default cache configuration
const DEFAULT_MAX = 500 // Maximum number of items in cache
const DEFAULT_TTL = 1000 * 60 // Time to live: 60 seconds

// Create LRU cache instance
const cache = new LRUCache<string, any>({
    max: DEFAULT_MAX,
    ttl: DEFAULT_TTL,
    allowStale: false,
    updateAgeOnGet: false,
    ttlAutopurge: true,
})

export const serverCache = {
    get: <T>(key: string): T | undefined => {
        return cache.get(key) as T | undefined
    },

    set: <T>(key: string, value: T, ttl?: number): void => {
        cache.set(key, value, { ttl: ttl || DEFAULT_TTL })
    },

    delete: (key: string): void => {
        cache.delete(key)
    },

    clear: (): void => {
        cache.clear()
    },

    has: (key: string): boolean => {
        return cache.has(key)
    },

    size: (): number => {
        return cache.size
    },
}

export const cacheKeys = {
    products: (page: number = 1, limit: number = 12) => `products:${page}:${limit}`,
    product: (id: string) => `product:${id}`,
    categories: () => 'categories:all',
    categoryProducts: (categoryId: string, page: number = 1, limit: number = 12) =>
        `category:${categoryId}:products:${page}:${limit}`,
}

export const invalidateProductCaches = () => {
    const keys = Array.from(cache.keys())
    keys.forEach((key) => {
        if (key.startsWith('products:') || key.startsWith('product:') || key.includes(':products:')) {
            cache.delete(key)
        }
    })
}

export const invalidateCategoryCaches = () => {
    const keys = Array.from(cache.keys())
    keys.forEach((key) => {
        if (key.startsWith('categories:') || key.startsWith('category:')) {
            cache.delete(key)
        }
    })
}
