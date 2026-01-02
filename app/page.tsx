"use client";

import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { ProductCarousel } from "@/components/product-carousel";
import { useLanguage } from "@/components/language-provider";
import { ShoppingBag, Zap, Store, Plane } from "lucide-react";

export default function Home() {
    const { t, language } = useLanguage();

    // Filter products for each section
    const uzumProducts = t.items.filter((p: any) => p.source === 'uzum' || p.uzumUrl);
    const directProducts = t.items.filter((p: any) => p.source === 'direct');
    const yandexProducts = t.items.filter((p: any) => p.source === 'yandex' || (p.yandexUrl && p.source !== 'uzum' && p.source !== 'direct')); // Avoid too much duplication, but show pure yandex or multi-channel
    const chinaProducts = t.items.filter((p: any) => p.source === 'china');

    // Revised logic: strict source based + URL existence?
    // User requested "Uzum Marketdagi tavarlar". If it has uzumUrl, it is IN Uzum Market.
    // "To'g'ridan to'g'ri" -> source === 'direct'.
    // "Yandex" -> source === 'yandex' or simply has yandexUrl?
    // Let's stick to strict primary source for now to avoid duplication clutter, OR strictly by availability.
    // Let's go with availability for Uzum/Yandex, but Primary Source for Direct/China.

    // Actually, simple fitlering:
    const uzumItems = t.items.filter((p: any) => (p.uzumUrl || p.source === 'uzum') && p.inStock);
    const yandexItems = t.items.filter((p: any) => (p.yandexUrl || p.source === 'yandex') && p.inStock);
    const directItems = t.items.filter((p: any) => p.source === 'direct' && p.inStock);
    const chinaItems = t.items.filter((p: any) => p.source === 'china' && p.inStock);

    return (
        <>
            <Hero />

            {/* Benefits Section - Moved to Top */}
            <section className="py-8 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="text-2xl mb-2">🚀</div>
                        <h3 className="font-bold text-sm text-gray-800 dark:text-white">{t.benefits.delivery}</h3>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="text-2xl mb-2">💯</div>
                        <h3 className="font-bold text-sm text-gray-800 dark:text-white">{t.benefits.quality}</h3>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="text-2xl mb-2">💳</div>
                        <h3 className="font-bold text-sm text-gray-800 dark:text-white">{t.benefits.payment}</h3>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="text-2xl mb-2">🔄</div>
                        <h3 className="font-bold text-sm text-gray-800 dark:text-white">{t.benefits.return}</h3>
                    </div>
                </div>
            </section>

            <div id="products" className="bg-brand-bg dark:bg-gray-950 pb-16 scroll-mt-24">
                {/* Direct Buy Section */}
                <ProductCarousel
                    title={language === 'uz' ? "To'g'ridan-to'g'ri xarid" : "Прямая покупка"}
                    products={directItems}
                    icon={<Zap className="text-brand-orange" />}
                    color="text-brand-orange"
                />

                {/* Uzum Market Section */}
                <ProductCarousel
                    title={language === 'uz' ? "Uzum Marketdagi tovarlar" : "Товары на Uzum Market"}
                    products={uzumItems}
                    icon={<ShoppingBag className="text-[#7000FF]" />}
                    color="text-[#7000FF]"
                />

                {/* Yandex Market Section */}
                <ProductCarousel
                    title={language === 'uz' ? "Yandex Market" : "Yandex Market"}
                    products={yandexItems}
                    icon={<Store className="text-[#FC3F1D]" />}
                    color="text-[#FC3F1D]"
                />

                {/* China Section */}
                <ProductCarousel
                    title={language === 'uz' ? "Xitoydan xarid" : "Товары из Китая"}
                    products={chinaItems}
                    icon={<Plane className="text-gray-900 dark:text-gray-400" />}
                    color="text-gray-900 dark:text-gray-400"
                />
            </div>



            {/* About Section */}
            <section className="py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">
                        {t.about.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t.about.text}
                    </p>
                </div>
            </section>
        </>
    );
}

