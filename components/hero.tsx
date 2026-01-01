"use client";

import Link from "next/link";
import { ArrowRight, Send, Instagram } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { CouponCard } from "./coupon-card";

export function Hero() {
    const { t } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-brand-bg dark:bg-gray-950 pt-8 pb-12 lg:pt-16 lg:pb-24 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left z-10">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-brand-dark dark:text-white leading-tight mb-6 text-balance">
                            {t.hero.title_start}<span className="text-brand-orange dark:text-brand-orange">{t.hero.title_highlight}</span>{t.hero.title_end}
                        </h1>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-brand-orange/10 dark:border-brand-orange/20">
                                🛡️ {t.hero.guarantee}
                            </span>
                            <span className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-brand-orange/10 dark:border-brand-orange/20">
                                💎 {t.hero.quality}
                            </span>
                            <span className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-brand-orange/10 dark:border-brand-orange/20">
                                🎧 {t.hero.support}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="#products"
                                className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-coral text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-brand-orange/20 dark:shadow-brand-orange/10 transition-all hover:-translate-y-1"
                            >
                                {t.hero.all_products}
                                <ArrowRight size={20} />
                            </Link>

                            <div className="flex gap-4 justify-center">
                                <Link
                                    href="https://t.me/presentboxuz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 text-brand-orange dark:text-brand-orange rounded-xl shadow-md border border-brand-orange/10 dark:border-gray-700 hover:scale-110 transition-transform"
                                >
                                    <Send size={24} />
                                </Link>
                                <Link
                                    href="https://www.instagram.com/presentbox_uz/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 text-brand-orange dark:text-brand-orange rounded-xl shadow-md border border-brand-orange/10 dark:border-gray-700 hover:scale-110 transition-transform"
                                >
                                    <Instagram size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>



                    {/* Visual Element (Interactive Coupon) */}
                    <div className="flex-1 relative w-full max-w-lg flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/20 to-transparent rounded-full blur-3xl animate-pulse" />
                        <div className="relative z-10 w-full flex justify-center transform hover:scale-105 transition-transform duration-500">
                            <CouponCard />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
