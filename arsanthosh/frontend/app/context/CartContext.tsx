"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
    name: string;
    price: string;
    quantity: number;
    image: string;
    category?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, quantity?: number) => void;
    removeFromCart: (name: string) => void;
    updateQuantity: (name: string, delta: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    totalItems: number;
    cartTotal: number;
    notification: { show: boolean; product: string } | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [notification, setNotification] = useState<{ show: boolean; product: string } | null>(null);

    // Initial load
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                setCart(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save only after initialization
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    const addToCart = (product: any, quantity: number = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.name === product.name);
            if (existing) {
                return prev.map(item =>
                    item.name === product.name ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });

        // Trigger notification popup
        setNotification({ show: true, product: product.name });
        setTimeout(() => setNotification(null), 3000);
    };

    const removeFromCart = (name: string) => {
        setCart(prev => prev.filter(item => item.name !== name));
    };

    const updateQuantity = (name: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.name === name) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const cartTotal = cart.reduce((acc, item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ""));
        return acc + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            totalItems,
            cartTotal,
            notification
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
