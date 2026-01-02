import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number;
    title: string;
    price: string;
    image: string;
    variant?: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: number, variant?: string) => void;
    updateQuantity: (id: number, delta: number, variant?: string) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    totalItems: () => number;
    subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (newItem) => set((state) => {
                const existingItemIndex = state.items.findIndex(
                    (i) => i.id === newItem.id && i.variant === newItem.variant
                );

                if (existingItemIndex > -1) {
                    const newItems = [...state.items];
                    newItems[existingItemIndex].quantity += newItem.quantity;
                    return { items: newItems }; // Do not auto-open
                }

                return { items: [...state.items, newItem] }; // Do not auto-open
            }),

            removeItem: (id, variant) => set((state) => ({
                items: state.items.filter((i) => !(i.id === id && i.variant === variant))
            })),

            updateQuantity: (id, delta, variant) => set((state) => {
                const newItems = state.items.map((item) => {
                    if (item.id === id && item.variant === variant) {
                        const newQuantity = Math.max(1, item.quantity + delta);
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                });
                return { items: newItems };
            }),

            clearCart: () => set({ items: [] }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: () => get().items.reduce((sum, item) => {
                const price = parseInt(item.price.replace(/\D/g, ''));
                return sum + (price * item.quantity);
            }, 0),
        }),
        {
            name: 'presentbox-cart',
            skipHydration: true, // We will manually hydrate if needed, or handle hydration mismatch
        }
    )
);
