'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Product } from '@/lib/products-server'

export interface CartItem extends Product {
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addToCart: (product: Product, quantity?: number) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'shopping-cart'

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isHydrated, setIsHydrated] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
            try {
                setItems(JSON.parse(stored))
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error)
            }
        }
        setIsHydrated(true)
    }, [])

    // Save cart to localStorage whenever it changes (guard against storage errors on mobile)
    useEffect(() => {
        if (!isHydrated) return
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error)
        }
    }, [items, isHydrated])

    const addToCart = (product: Product, quantity: number = 1) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === product.id)

            if (existingItem) {
                // Update quantity if item already exists
                return currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                // Add new item
                return [...currentItems, { ...product, quantity }]
            }
        })
    }

    const removeFromCart = (productId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
