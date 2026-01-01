"use client";

import { Star, ChevronRight, Store } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Seller } from '@/lib/translations';

interface SellerInfoCardProps {
    language: string;
    seller?: Seller;
}

export const SellerInfoCard = ({ language, seller }: SellerInfoCardProps) => {
    // Fallback default seller (Presentbox_uz)
    const defaultSeller: Seller = {
        name: "Presentbox_uz",
        logo: "/images/seller-logo.png",
        rating: 4.5,
        reviewsCount: 567,
        ordersCount: "4 152",
        registrationDate: language === 'uz' ? "23 avgust 2023 г." : "23 августа 2023 г.",
        url: "https://uzum.uz/ru/shop/resentboxuz"
    };

    const s = seller || defaultSeller;

    return (
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mt-4 transition-all hover:shadow-md group overflow-visible">
            <div className="flex items-center gap-4 pr-6 sm:pr-28">
                <div className="w-14 h-14 relative rounded-full overflow-hidden border border-gray-100 dark:border-gray-600 shrink-0 bg-gray-50 p-1">
                    <img
                        src={s.logo}
                        alt={s.name}
                        className="w-full h-full object-contain rounded-full"
                    />
                </div>

                <div className="flex-1 min-w-0 py-1">
                    <div className="flex flex-wrap items-center gap-x-3 text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>
                            {s.ordersCount} {language === 'uz' ? "buyurtma" : "заказа"}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="fill-brand-orange text-brand-orange" size={14} />
                            <span className="font-bold text-gray-900 dark:text-white">{s.rating}</span>
                            <span>({s.reviewsCount})</span>
                        </div>
                    </div>

                    <Link href={s.url} target="_blank" className="block w-fit">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none mb-1.5 hover:text-brand-orange transition-colors line-clamp-1">
                            {s.name}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 leading-tight">
                        <span>
                            {language === 'uz'
                                ? `Uzumda ${s.registrationDate}dan beri sotuvchi`
                                : `Продавец на Uzum с ${s.registrationDate}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <Link
                href={s.url}
                target='_blank'
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600 text-gray-900 dark:text-white font-medium py-3.5 px-6 rounded-2xl transition-all flex items-center gap-2 group/btn shadow-sm"
            >
                <Store size={22} className="text-gray-700 dark:text-gray-300" />
                <span className="text-lg font-bold hidden sm:inline">{language === 'uz' ? "Do'konga o'tish" : "Перейти в магазин"}</span>
                <ChevronRight size={20} className="text-gray-400 group-hover/btn:translate-x-0.5 transition-transform hidden sm:block" />
            </Link>
        </div>
    );
};
