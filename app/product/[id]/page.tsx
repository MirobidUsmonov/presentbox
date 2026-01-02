"use client";

import { useLanguage } from "@/components/language-provider";
import { ArrowLeft, ChevronRight, ChevronLeft, Heart, Share2, ShieldCheck, Truck, RotateCcw, Star, ShoppingCart, Flame, X, Zap, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { SellerInfoCard } from "@/components/seller-info-card";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { useCartStore } from "@/lib/store";

export default function ProductPage() {
    const params = useParams();
    const { language, t } = useLanguage();
    const [id, setId] = useState<number | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
    const [stock, setStock] = useState<number | null>(null);
    const [fetchedPrice, setFetchedPrice] = useState<number | null>(null);
    const [fetchedFullPrice, setFetchedFullPrice] = useState<number | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'specs' | 'desc'>('specs');

    const { addItem, openCart, items, updateQuantity, removeItem } = useCartStore();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (params?.id) {
            setId(Number(params.id));
        }
    }, [params]);

    // Find product in the current language
    const product = id ? t.items.find((item) => item.id === id) : null;

    useEffect(() => {
        if (product) {
            setActiveImage(null);
            setSelectedVariant(null);
            setStock(null);
            setFetchedPrice(null);
            setFetchedFullPrice(null);

            if ('uzumUrl' in product && product.uzumUrl) {
                const url = product.uzumUrl as string;
                fetch(`/api/stock?url=${encodeURIComponent(url)}`)
                    .then(res => res.ok ? res.json() : null)
                    .then(data => {
                        if (data) {
                            if (typeof data.stock === 'number') {
                                setStock(data.stock);
                            }
                            if (typeof data.price === 'number') {
                                setFetchedPrice(data.price);
                            }
                            if (typeof data.fullPrice === 'number') {
                                setFetchedFullPrice(data.fullPrice);
                            }
                        }
                    })
                    .catch(err => console.error("Stock fetch error:", err));
            }
        }
    }, [product]);

    // Format price with " so'm"
    const formatPrice = (p: string) => {
        if (!p) return "";
        return p.toLowerCase().includes("so'm") ? p : `${p} so'm`;
    };

    const variants = (product as any)?.variants || [];

    // Gallery logic: If variant selected, use its images. Otherwise use product gallery.
    const currentVariant = selectedVariant !== null ? variants[selectedVariant] : null;
    const variantImages = currentVariant
        ? (currentVariant.images && currentVariant.images.length > 0
            ? currentVariant.images
            : (currentVariant.image ? [currentVariant.image] : []))
        : [];

    const images = variantImages.length > 0
        ? variantImages
        : (product ? (product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]) : []);

    // Main display image logic: selected preview > first image
    const displayImage = activeImage || (images.length > 0 ? images[0] : '');

    const nextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (images.length === 0) return;
        const currentList = images;
        const currentIndex = currentList.indexOf(displayImage);
        if (currentIndex < currentList.length - 1) {
            setActiveImage(currentList[currentIndex + 1]);
            setSelectedVariant(null);
        }
    }, [displayImage, images]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (images.length === 0) return;
        const currentList = images;
        const currentIndex = currentList.indexOf(displayImage);
        if (currentIndex > 0) {
            setActiveImage(currentList[currentIndex - 1]);
            setSelectedVariant(null);
        }
    }, [displayImage, images]);

    const handleAddToCart = () => {
        if (!product) return;

        const priceToUse = fetchedPrice
            ? formatPrice(fetchedPrice.toLocaleString('ru-RU'))
            : formatPrice(product.price);

        addItem({
            id: product.id,
            title: product.title,
            price: priceToUse,
            image: displayImage,
            variant: variants[selectedVariant || 0]?.color,
            quantity: 1
        });
        // openCart(); // Removed to prevent auto-redirect
    };

    if (!id) return null;

    if (!product || product.inStock === false) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {language === 'uz' ? "Mahsulot sotuvda yo'q" : "Товар закончился"}
                </h1>
                <p className="text-gray-500 mb-6">
                    {language === 'uz'
                        ? "Kechirasiz, ushbu mahsulot vaqtincha tugagan yoki sotuvdan olib tashlangan."
                        : "К сожалению, этот товар временно закончился или был снят с продажи."}
                </p>
                <Link href="/" className="bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-coral transition-colors">
                    {language === 'uz' ? "Bosh sahifaga qaytish" : "Вернуться на главную"}
                </Link>
            </div>
        );
    }

    const numericPrice = parseInt(product.price.replace(/\D/g, '')) || 0;
    const monthlyPrice = Math.floor(numericPrice / 12).toLocaleString('ru-RU').replace(',', ' ');

    return (
        <main className="bg-brand-bg dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-6 lg:py-10">
                {/* Back button */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-orange mb-8 font-bold transition-all hover:-translate-x-1 group">
                    <ArrowLeft size={20} className="group-hover:scale-110" />
                    {language === 'uz' ? "Bosh sahifaga qaytish" : "Назад в магазин"}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">
                    {/* Left Column - Gallery */}
                    <div className="lg:col-span-5 flex flex-col md:flex-row gap-4 h-fit lg:sticky lg:top-24">
                        {/* Thumbnails */}
                        <div className="flex flex-row md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 order-2 md:order-1 scrollbar-hide">
                            {images.map((img: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 shadow-sm bg-white dark:bg-gray-800 p-1 ${displayImage === img ? 'border-brand-orange scale-105 shadow-brand-orange/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`${product.title} ${i}`} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="w-full aspect-[4/3] lg:aspect-auto lg:flex-1 flex flex-col relative group order-1 md:order-2">
                            <div
                                className="relative w-full h-fit flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl"
                                onClick={() => setIsLightboxOpen(true)}
                            >
                                <img
                                    src={displayImage}
                                    alt={product.title}
                                    className="w-full h-auto max-h-[400px] lg:max-h-[600px] object-contain rounded-2xl transition-transform duration-300 shadow-sm"
                                />
                            </div>

                            {/* Navigation Arrows (Desktop) */}
                            {images.length > 1 && (
                                <>
                                    {images.indexOf(displayImage) > 0 && (
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
                                        >
                                            <ChevronLeft size={40} strokeWidth={1.5} />
                                        </button>
                                    )}
                                    {images.indexOf(displayImage) < images.length - 1 && (
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
                                        >
                                            <ChevronRight size={40} strokeWidth={1.5} />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Info */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-2xl lg:border lg:border-gray-100 dark:lg:border-gray-700">

                            {/* Title & Rating */}
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                {product.title}
                            </h1>

                            {/* Price Block */}
                            <div className="mb-6">
                                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {fetchedPrice
                                            ? formatPrice(fetchedPrice.toLocaleString('ru-RU'))
                                            : formatPrice(product.price)}
                                    </div>
                                    <span className="text-xl text-gray-400 line-through decoration-red-500/80 font-medium">
                                        {fetchedFullPrice
                                            ? `${fetchedFullPrice.toLocaleString('ru-RU')} so'm`
                                            : `${(numericPrice * 1.5).toLocaleString('ru-RU').replace(',', ' ')} so'm`}
                                    </span>
                                    <span className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-xl text-sm font-black shadow-lg shadow-red-500/50 animate-pulse">
                                        {fetchedPrice && fetchedFullPrice
                                            ? `-${Math.round((1 - fetchedPrice / fetchedFullPrice) * 100)}%`
                                            : "-35%"}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold inline-block leading-tight">
                                        {language === 'uz'
                                            ? `${Math.floor(numericPrice * 0.5).toLocaleString('ru-RU').replace(',', ' ')} so'm foyda bilan xarid qiling`
                                            : `Купите с выгодой ${Math.floor(numericPrice * 0.5).toLocaleString('ru-RU').replace(',', ' ')} сум`}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    {(() => {
                                        const uzumStock = stock || 0;
                                        const directStock = (product as any).stockQuantity || 0;
                                        const totalStock = uzumStock + directStock;

                                        if (totalStock > 0) {
                                            return (
                                                <>
                                                    <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                                                        {language === 'uz' ? `Omborda: ${totalStock} ta qoldi` : `На складе: осталось ${totalStock} шт`}
                                                    </div>
                                                    {(totalStock <= 30) && (
                                                        <div className="text-red-500 dark:text-red-400 font-bold text-sm flex items-center gap-1 animate-pulse">
                                                            <Flame size={16} fill="currentColor" />
                                                            {language === 'uz' ? "Tez orada tugaydi" : "Скоро закончится"}
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>

                            {/* Delivery Info - Moved Up */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                <FeatureCard icon={<Truck size={24} />} title={language === 'uz' ? "Tezkor yetkazish" : "Быстрая доставка"} desc={language === 'uz' ? "1-2 kun ichida yetkazib beramiz" : "Доставим в течение 1-2 дней"} />
                                <FeatureCard icon={<RotateCcw size={24} />} title={language === 'uz' ? "10 kunlik qaytarish" : "10 дней на возврат"} desc={language === 'uz' ? "Sifatsiz bo'lsa, pulingiz qaytariladi" : "Если качество плохое, вернем деньги"} />
                            </div>

                            {/* Color Selector (Integrated in old design style) */}
                            {variants.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                                        {language === 'uz' ? "Rang tanlang:" : "Выберите цвет:"}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {variants.map((v: any, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setSelectedVariant(i);
                                                    setActiveImage(null); // Reset preview to show first image of new variant
                                                }}
                                                className={`p-1 rounded-lg border-2 transition-all ${selectedVariant === i ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 dark:border-gray-700'}`}
                                            >
                                                <img src={v.images?.[0] || v.image} alt={v.color} className="w-12 h-12 rounded-md object-cover" title={v.color} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Installment (Uzum only) */}
                            {(product.uzumUrl || product.source === 'uzum') && (
                                <a
                                    href={(product as any).uzumUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group decoration-transparent"
                                >
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between mb-8 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-transparent group-hover:border-gray-300 dark:group-hover:border-gray-500">
                                        <div>
                                            <span className="bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded mr-2">
                                                {language === 'uz' ? "NASIYA" : "РАССРОЧКА"}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:underline decoration-gray-900 dark:decoration-white underline-offset-2">
                                                {monthlyPrice} so'm / oyiga
                                            </span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </a>
                            )}

                            {/* Actions */}
                            {/* Buttons Grid Layout Logic */}
                            {(() => {
                                const hasDirect = product.source === 'direct' || (stock !== null ? stock > 0 : (product.stockQuantity || 0) > 0);
                                const hasUzum = product.uzumUrl || product.source === 'uzum';
                                const hasYandex = product.yandexUrl || product.source === 'yandex';
                                const hasChina = product.source === 'china';
                                const btnCount = [hasDirect, hasUzum, hasYandex, hasChina].filter(Boolean).length;
                                const gridClass = btnCount === 1 ? 'grid-cols-1' : (btnCount === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2');

                                return (
                                    <div className={`grid ${gridClass} gap-3 mb-8`}>
                                        {/* Direct Source - Add to Cart */}
                                        {/* Direct Source - Add to Cart */}
                                        {hasDirect && (
                                            <div className="w-full">
                                                {(() => {
                                                    const currentVariantColor = variants[selectedVariant || 0]?.color;
                                                    const cartItem = items.find(
                                                        i => i.id === product.id && i.variant === currentVariantColor
                                                    );

                                                    if (cartItem) {
                                                        // State 2: Quantity + Go to Cart (Image 2)
                                                        return (
                                                            <div className="w-full grid grid-cols-2 sm:grid-cols-[1fr_auto] gap-3">
                                                                {/* Quantity Controls */}
                                                                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl px-2 sm:px-4 flex items-center justify-between text-lg font-medium h-12 sm:h-auto">
                                                                    <button
                                                                        onClick={() => {
                                                                            if (cartItem.quantity > 1) {
                                                                                updateQuantity(cartItem.id, -1, cartItem.variant);
                                                                            } else {
                                                                                items.length === 1 ? useCartStore.getState().clearCart() : removeItem(cartItem.id, cartItem.variant);
                                                                            }
                                                                        }}
                                                                        className="w-8 sm:w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xl sm:text-2xl"
                                                                    >
                                                                        −
                                                                    </button>
                                                                    <span className="text-gray-900 dark:text-white font-bold text-base sm:text-lg">{cartItem.quantity}</span>
                                                                    <button
                                                                        onClick={() => updateQuantity(cartItem.id, 1, cartItem.variant)}
                                                                        className="w-8 sm:w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xl sm:text-2xl"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>

                                                                {/* Go to Cart Button */}
                                                                <button
                                                                    onClick={openCart}
                                                                    className="bg-[#E5E5FF] hover:bg-[#d6d6ff] text-brand-orange font-medium px-3 sm:px-6 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98] h-12 sm:h-auto"
                                                                >
                                                                    <ShoppingBag size={18} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
                                                                    <span className="text-sm sm:text-lg leading-tight text-center">{language === 'uz' ? "Savatga" : "Корзина"}</span>
                                                                </button>
                                                            </div>
                                                        );
                                                    }

                                                    // State 1: Add to Cart (Image 1)
                                                    return (
                                                        <button
                                                            onClick={handleAddToCart}
                                                            className="w-full bg-brand-orange hover:bg-brand-coral text-white py-3 px-6 rounded-xl transition-all active:scale-[0.98] flex flex-col items-center justify-center shadow-lg shadow-brand-orange/30"
                                                        >
                                                            <span className="text-lg font-bold">
                                                                {language === 'uz' ? "Savatga qo'shish" : "Добавить в корзину"}
                                                            </span>
                                                            <span className="text-xs opacity-90 font-medium mt-0.5">
                                                                {language === 'uz' ? "1-2 kun ichida yetkazib beramiz" : "Доставим в течение 1-2 дней"}
                                                            </span>
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        {/* Marketplaces Buttons */}
                                        {/* Uzum Source */}
                                        {hasUzum && (
                                            <>
                                                {(stock !== null ? stock : (product.stockQuantity || 0)) > 0 ? (
                                                    <a
                                                        href={product.uzumUrl || "https://uzum.uz/ru/shop/resentboxuz"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full bg-[#7000FF] hover:bg-[#5f00d9] text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl shadow-purple-500/30"
                                                    >
                                                        <ShoppingCart className="mr-2" size={24} />
                                                        <div className="flex flex-col items-start leading-tight">
                                                            <span className="font-bold">Uzum Market</span>
                                                            <span className="text-[10px] font-medium opacity-90">
                                                                {language === 'uz' ? "orqali xarid qilish" : "купить через"}
                                                            </span>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="w-full bg-gray-100 dark:bg-gray-800 text-gray-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg cursor-not-allowed">
                                                        {language === 'uz' ? "Uzumda tugadi" : "Нет в наличии (Uzum)"}
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* Yandex Source */}
                                        {hasYandex && (
                                            <a
                                                href={product.yandexUrl || product.uzumUrl || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-[#FC3F1D] hover:bg-[#d63316] text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl shadow-red-500/30"
                                            >
                                                <ShoppingCart className="mr-2" size={22} />
                                                {language === 'uz' ? "Yandex Market" : "Yandex Market"}
                                            </a>
                                        )}

                                        {/* China Source */}
                                        {hasChina && (
                                            <a
                                                href={product.uzumUrl || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
                                            >
                                                <ShoppingCart className="mr-2" size={22} />
                                                {language === 'uz' ? "Xitoydan xarid qilish" : "Купить из Китая"}
                                            </a>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Delivery Info */}


                        {/* Seller Info Card */}
                        <div className="mt-8">
                            <SellerInfoCard language={language} seller={product.seller} />
                        </div>
                    </div>
                </div>

                {/* Product details tabs... */}
                <div className="mt-16 lg:mt-24 max-w-4xl mx-auto">
                    <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                        <button
                            className={`px-6 py-3 border-b-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'specs' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                            onClick={() => setActiveTab('specs')}
                        >
                            {language === 'uz' ? "Xarakteristikasi" : "Характеристики"}
                        </button>
                        <button
                            className={`px-6 py-3 border-b-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'desc' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                            onClick={() => setActiveTab('desc')}
                        >
                            {language === 'uz' ? "To'liq tavsif" : "Описание"}
                        </button>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        {activeTab === 'specs' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-8">
                                {product.characteristics && product.characteristics.length > 0 ? (
                                    product.characteristics.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 py-3 border-b border-gray-50 dark:border-gray-700/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{item}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">
                                        {language === 'uz' ? "Xarakteristikalar qo'shilmagan" : "Характеристики не добавлены"}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="mt-8">
                                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                    {product.fullDescription || (language === 'uz'
                                        ? `${product.title} - bu siz uchun ajoyib tanlov. Yuqori sifatli materiallardan tayyorlangan, zamonaviy dizayn va qulaylik uyg'unligi.`
                                        : `${product.title} — это отличный выбор для вас. Изготовлен из высококачественных материалов.`)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div >

            {/* Lightbox */}
            {
                isLightboxOpen && (
                    <div
                        className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLightboxOpen(false);
                            }}
                            className="absolute top-4 right-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-[1010]"
                        >
                            <X size={32} />
                        </button>

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage(e);
                                    }}
                                    disabled={images.indexOf(displayImage) === 0}
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full transition-all z-[1010] ${images.indexOf(displayImage) === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-110 cursor-pointer'}`}
                                >
                                    <ChevronLeft size={48} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage(e);
                                    }}
                                    disabled={images.indexOf(displayImage) === images.length - 1}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full transition-all z-[1010] ${images.indexOf(displayImage) === images.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-110 cursor-pointer'}`}
                                >
                                    <ChevronRight size={48} />
                                </button>
                            </>
                        )}

                        {/* Image Container */}
                        <div
                            className="relative w-full h-full flex items-center justify-center pointer-events-none"
                        >
                            <img
                                src={displayImage}
                                alt={product.title}
                                className="max-w-full max-h-full object-contain pointer-events-auto cursor-default shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                                {images.indexOf(displayImage) + 1} / {images.length}
                            </div>
                        </div>
                    </div>
                )
            }
        </main >
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-orange-50 dark:hover:bg-gray-700 border border-transparent hover:border-orange-100 dark:hover:border-gray-600 group cursor-default">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-brand-orange">
                {icon}
            </div>
            <div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">
                    {title}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                    {desc}
                </p>
            </div>
        </div>
    );
}
