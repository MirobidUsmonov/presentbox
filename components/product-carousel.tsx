"use client";

import { Product } from "@/lib/translations";
import { ProductCard } from "@/components/product-card";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef } from "react";

interface ProductCarouselProps {
    title: string;
    products: any[]; // Using any[] to avoid strict type issues with mapped props, but ideally Product[]
    color?: string;
    icon?: React.ReactNode;
}

export function ProductCarousel({ title, products, color = "text-brand-dark", icon }: ProductCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth / (window.innerWidth < 768 ? 2 : 4);
            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) return null;

    return (
        <section className="py-8 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold flex items-center gap-2 ${color} dark:text-white`}>
                        {icon}
                        {title}
                    </h2>
                </div>

                <div className="relative group">
                    {/* Left Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-[35%] -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 disabled:opacity-0"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex-none w-[calc(50%-8px)] md:w-[calc(25%-12px)] snap-start"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}


                    </div>

                    {/* Right Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-[35%] -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}
