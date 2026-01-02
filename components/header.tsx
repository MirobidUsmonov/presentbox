"use client";

import { ShoppingBag, Menu, Globe, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useCartStore } from "@/lib/store";
import { CartDrawer } from "./cart-drawer";

export function Header() {
    const { language, setLanguage, t } = useLanguage();
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLangLabel = language === 'uz' ? "O'zbekcha" : "Русский";

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-brand-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo - Petrol Brush Style */}
                <Link href="/" className="group relative">
                    <div className="relative px-4 py-1.5 sm:px-6 sm:py-2 bg-brand-orange -rotate-2 group-hover:rotate-0 transition-all duration-300 shadow-md">
                        {/* Rough edges */}
                        <div className="absolute inset-0 bg-brand-orange skew-x-6 rounded-sm transition-colors"></div>
                        <span className="relative z-10 font-black text-xl sm:text-2xl tracking-tighter text-white lowercase">
                            presentbox
                        </span>
                    </div>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-6">

                    {/* Custom Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            className={`relative w-12 h-6 sm:w-16 sm:h-8 rounded-full transition-colors duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] focus:outline-none shadow-inner ${resolvedTheme === "dark" ? "bg-[#0f172a]" : "bg-sky-200"
                                }`}
                            aria-label="Toggle Theme"
                        >
                            {/* Track Background Elements */}
                            <div className="absolute inset-0 overflow-hidden rounded-full">
                                {/* Clouds (Light Mode) */}
                                <div className={`absolute top-0.5 right-1 w-3 h-1.5 sm:w-4 sm:h-2 bg-white rounded-full opacity-80 transition-all duration-500 ${resolvedTheme === 'dark' ? 'translate-y-10' : 'translate-y-0'}`}></div>
                                <div className={`absolute bottom-0.5 right-3 w-4 h-1.5 sm:w-5 sm:h-2 bg-white rounded-full opacity-60 transition-all duration-500 delay-75 ${resolvedTheme === 'dark' ? 'translate-y-10' : 'translate-y-0'}`}></div>

                                {/* Stars (Dark Mode) */}
                                <div className={`absolute top-1.5 left-2 w-0.5 h-0.5 bg-white rounded-full transition-all duration-500 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}></div>
                                <div className={`absolute bottom-1.5 left-4 w-1 h-1 bg-white rounded-full transition-all duration-500 delay-75 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}></div>
                                <div className={`absolute top-2 left-6 w-0.5 h-0.5 bg-white rounded-full transition-all duration-500 delay-150 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}></div>
                            </div>

                            {/* Sliding Circle */}
                            <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 sm:top-1 sm:left-1 sm:w-6 sm:h-6 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center ${resolvedTheme === "dark"
                                    ? "translate-x-6 sm:translate-x-8 bg-gray-100" // Moon
                                    : "translate-x-0 bg-yellow-400" // Sun
                                    }`}
                            >
                                {resolvedTheme === 'dark' && (
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-300 rounded-full opacity-50 -translate-x-0.5 -translate-y-0.5"></div>
                                )}
                            </div>
                        </button>
                    )}

                    {/* Cart Button */}
                    <button
                        onClick={() => {
                            const { openCart } = useCartStore.getState();
                            openCart();
                        }}
                        className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                        <ShoppingBag size={20} className="sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 group-hover:text-brand-orange transition-colors" />
                        <CartBadge />
                    </button>

                    {/* Language Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-1.5 px-2 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-brand-orange dark:hover:border-brand-orange bg-white dark:bg-gray-800 transition-colors group"
                        >
                            <Globe size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600 dark:text-gray-300 group-hover:text-brand-orange transition-colors" strokeWidth={1.5} />
                            <span className="text-sm font-medium text-brand-dark dark:text-white group-hover:text-brand-orange hidden sm:inline">{currentLangLabel}</span>
                            <ChevronDown size={14} className={`sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {langOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2">
                                <button
                                    onClick={() => { setLanguage('uz'); setLangOpen(false); }}
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-brand-orange transition-colors"
                                >
                                    <span>O'zbekcha</span>
                                    {language === 'uz' && <Check size={16} className="text-brand-orange" />}
                                </button>
                                <button
                                    onClick={() => { setLanguage('ru'); setLangOpen(false); }}
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-brand-orange transition-colors"
                                >
                                    <span>Русский</span>
                                    {language === 'ru' && <Check size={16} className="text-brand-orange" />}
                                </button>
                            </div>
                        )}
                    </div>


                </div>
            </div>
            <CartDrawer />
        </header>
    );
}

function CartBadge() {
    const totalItems = useCartStore(s => s.totalItems());
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || totalItems === 0) return null;

    return (
        <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white dark:border-brand-dark">
            {totalItems}
        </span>
    );
}
