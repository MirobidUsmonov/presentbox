"use client";

import { ShoppingBag, Menu, Globe, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

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
                    <div className="relative px-6 py-2 bg-brand-orange -rotate-2 group-hover:rotate-0 transition-all duration-300 shadow-md">
                        {/* Rough edges */}
                        <div className="absolute inset-0 bg-brand-orange skew-x-6 rounded-sm transition-colors"></div>
                        <span className="relative z-10 font-black text-2xl tracking-tighter text-white lowercase">
                            presentbox
                        </span>
                    </div>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-6">

                    {/* Custom Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            className={`relative w-16 h-8 rounded-full transition-colors duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] focus:outline-none shadow-inner ${resolvedTheme === "dark" ? "bg-[#0f172a]" : "bg-sky-200"
                                }`}
                            aria-label="Toggle Theme"
                        >
                            {/* Track Background Elements */}
                            <div className="absolute inset-0 overflow-hidden rounded-full">
                                {/* Clouds (Light Mode) */}
                                <div className={`absolute top-1 right-2 w-4 h-2 bg-white rounded-full opacity-80 transition-all duration-500 ${resolvedTheme === 'dark' ? 'translate-y-10' : 'translate-y-0'}`}></div>
                                <div className={`absolute bottom-1 right-5 w-5 h-2 bg-white rounded-full opacity-60 transition-all duration-500 delay-75 ${resolvedTheme === 'dark' ? 'translate-y-10' : 'translate-y-0'}`}></div>

                                {/* Stars (Dark Mode) */}
                                <div className={`absolute top-2 left-3 w-0.5 h-0.5 bg-white rounded-full transition-all duration-500 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}></div>
                                <div className={`absolute bottom-2 left-6 w-1 h-1 bg-white rounded-full transition-all duration-500 delay-75 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}></div>
                                <div className={`absolute top-3 left-8 w-0.5 h-0.5 bg-white rounded-full transition-all duration-500 delay-150 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}></div>
                            </div>

                            {/* Sliding Circle */}
                            <div
                                className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center ${resolvedTheme === "dark"
                                    ? "translate-x-8 bg-gray-100" // Moon
                                    : "translate-x-0 bg-yellow-400" // Sun
                                    }`}
                            >
                                {resolvedTheme === 'dark' && (
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full opacity-50 -translate-x-0.5 -translate-y-0.5"></div>
                                )}
                            </div>
                        </button>
                    )}

                    {/* Language Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-brand-orange dark:hover:border-brand-orange bg-white dark:bg-gray-800 transition-colors group"
                        >
                            <Globe size={18} className="text-gray-600 dark:text-gray-300 group-hover:text-brand-orange transition-colors" strokeWidth={1.5} />
                            <span className="text-sm font-medium text-brand-dark dark:text-white group-hover:text-brand-orange">{currentLangLabel}</span>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
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

                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group">
                        <Menu size={24} className="text-brand-dark dark:text-white group-hover:text-brand-orange transition-colors" />
                    </button>
                </div>
            </div>
        </header>
    );
}
