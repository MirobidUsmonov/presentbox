"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Seller } from "@/lib/translations";
import { Store } from "lucide-react";

interface ProductProps {
    id: number;
    title: string;
    price: string;
    image: string;
    category: string;
    inStock?: boolean;
    variants?: { color: string; images: string[] }[];
    seller?: Seller;
    uzumUrl?: string;
    yandexUrl?: string;
    source?: string;
    stockQuantity?: number;
}

export function ProductCard({ product }: { product: ProductProps }) {
    const { t } = useLanguage();

    if (product.inStock === false) return null;

    // Automatic price formatting
    const formattedPrice = product.price.toLowerCase().includes("so'm")
        ? product.price
        : `${product.price} so'm`;

    // Calculate simulated original price (e.g. +30%)
    const rawPrice = parseInt(product.price.replace(/[^0-9]/g, '')) || 0;
    const originalPrice = rawPrice * 1.3;
    const formattedOriginalPrice = originalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";

    // Seller prioritization logic
    let displaySeller = product.seller;

    // If predominantly Yandex (no Uzum URL, has Yandex URL), show Yandex branding
    // Or if source is explicitly Yandex and no Uzum link is present
    if ((!product.uzumUrl || product.uzumUrl === "") && (product.yandexUrl || product.source === 'yandex')) {
        // Only override if we don't have a specific seller already, OR if we want to enforce Yandex branding
        // Use a Yandex Market generic seller object
        displaySeller = {
            name: "Yandex Market",
            logo: "https://avatars.mds.yandex.net/get-market_messenger/4756475/2a0000017a4c49f854972e0436d654203774/240x240",
            url: product.yandexUrl || ""
        } as Seller;
    }

    // Default to Uzum/PresentBox if Direct or Uzum
    // (Existing product.seller usually has Present Box info)

    return (
        <Link
            href={`/product/${product.id}`}
            className="group/card block relative bg-white dark:bg-gray-800 rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 h-full flex flex-col"
        >
            <div className="aspect-[3/4] relative bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <div className="w-full h-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain p-4 hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-100 shadow-sm z-10">
                    {product.category}
                </div>

                {/* Marketplace Badges (top right) */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 z-10 items-end">
                    {/* Tezkor / Direct */}
                    {product.source === 'direct' && (
                        <div className="bg-brand-orange/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm">
                            Tezkor
                        </div>
                    )}

                    {/* Uzum */}
                    {(product.uzumUrl || product.source === 'uzum') && (
                        <div className="bg-[#7000FF]/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm">
                            Uzum
                        </div>
                    )}

                    {/* Yandex */}
                    {(product.yandexUrl || product.source === 'yandex') && (
                        <div className="bg-[#FC3F1D]/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm">
                            Yandex
                        </div>
                    )}

                    {/* China */}
                    {product.source === 'china' && (
                        <div className="bg-gray-800/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm">
                            Xitoy
                        </div>
                    )}
                </div>

                {/* Variant dots */}
                {product.variants && product.variants.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex gap-1 bg-white/40 dark:bg-black/40 backdrop-blur-sm p-1 rounded-full group-hover/card:scale-110 transition-transform">
                        {product.variants.slice(0, 3).map((v, i) => (
                            <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full border border-white/50 shadow-sm"
                                style={{
                                    backgroundColor:
                                        ['qora', 'черный'].includes(v.color.toLowerCase()) ? "#000" :
                                            ['oq', 'белый'].includes(v.color.toLowerCase()) ? "#fff" :
                                                "#ff6b00"
                                }}
                            />
                        ))}
                        {product.variants.length > 3 && <div className="text-[8px] font-black text-white px-1">+{product.variants.length - 3}</div>}
                    </div>
                )}
            </div>

            <div className="p-3 sm:p-5 flex flex-col flex-1">
                <h3 className="font-bold text-brand-dark dark:text-white text-sm sm:text-lg mb-2 line-clamp-2 leading-snug">
                    {product.title}
                </h3>
                <div className="mt-auto space-y-3 sm:space-y-4">
                    {/* Low Stock Warning */}
                    {product.stockQuantity !== undefined && product.stockQuantity < 30 && product.stockQuantity > 0 && (
                        <p className="text-[10px] items-center font-bold text-red-500 flex gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                            {t.products?.low_stock || "Tez orada tugaydi"}
                        </p>
                    )}

                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <p className="text-brand-orange dark:text-brand-orange font-extrabold text-lg sm:text-xl">
                                {formattedPrice}
                            </p>
                            {/* Simulated Original Price (Discount Effect) */}
                            <p className="text-xs text-red-500 dark:text-red-400 line-through decoration-red-500 decoration-2">
                                {formattedOriginalPrice}
                            </p>
                        </div>
                    </div>

                    {/* Seller Badge */}
                    {displaySeller && (
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (displaySeller?.url) window.open(displaySeller.url, '_blank');
                            }}
                            className="flex items-center gap-2 py-1 px-1 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-brand-orange transition-colors cursor-pointer w-fit max-w-full"
                        >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden bg-white border border-gray-100 shrink-0 relative">
                                {displaySeller.name === "Yandex Market" ? (
                                    <div className="absolute inset-0 bg-[#FC3F1D] flex items-center justify-center text-white text-[8px] font-bold">YM</div>
                                ) : (
                                    <img src={displaySeller.logo} alt="" className="w-full h-full object-contain" />
                                )}
                            </div>
                            <span className="text-[10px] sm:text-[10px] font-bold text-gray-600 dark:text-gray-400 truncate pr-2">
                                {displaySeller.name}
                            </span>
                        </div>
                    )}

                    <div
                        className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-700 group-hover/card:bg-brand-orange dark:group-hover/card:bg-brand-orange text-brand-dark dark:text-white group-hover/card:text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 rounded-xl transition-colors text-xs sm:text-base"
                    >
                        <span>{t.products.details}</span>
                        <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
