"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";

export function CartDrawer() {
    const {
        isOpen,
        closeCart,
    } = useCartStore();
    const router = useRouter();

    const [isHydrated, setIsHydrated] = useState(false);

    // Hydration fix for persist middleware
    useEffect(() => {
        useCartStore.persist.rehydrate();
        setIsHydrated(true);
    }, []);

    // Redirect to /checkout when drawer opens
    useEffect(() => {
        if (isHydrated && isOpen) {
            closeCart();
            router.push('/checkout');
        }
    }, [isHydrated, isOpen, closeCart, router]);

    if (!isHydrated) return null;

    return null;
}
