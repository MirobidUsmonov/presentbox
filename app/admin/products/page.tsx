"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit2, Loader2, Package, ChevronDown, ChevronRight, Layers, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/translations";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

export default function AdminProductsPage() {
    const { t, language } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const router = useRouter();

    const adminT = (t as any).admin;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (p: number) => {
        return p.toLocaleString('ru-RU').replace(',', ' ') + " so'm";
    };

    const syncAllProducts = async () => {
        setIsSyncing(true);
        let updatedCount = 0;
        let checkedCount = 0;
        let errorCount = 0;

        try {
            // Process sequentially to be safe
            for (const product of products) {
                if (product.uzumUrl) {
                    checkedCount++;
                    try {
                        // 1. Fetch live data
                        const encodedUrl = encodeURIComponent(product.uzumUrl);
                        const stockRes = await fetch(`/api/stock?url=${encodedUrl}`);

                        if (!stockRes.ok) {
                            console.error(`Status error for ${product.id}`);
                            errorCount++;
                            continue;
                        }

                        const stockData = await stockRes.json();
                        if (!stockData) {
                            errorCount++;
                            continue;
                        }

                        const newPrice = stockData.price;
                        const newStock = stockData.stock;

                        // 2. Check if update is needed
                        const currentPriceVal = parseInt(product.price.replace(/\D/g, '')) || 0;
                        const priceChanged = newPrice && newPrice !== currentPriceVal;
                        const stockChanged = newStock !== undefined && newStock !== product.stockQuantity;

                        if (priceChanged || stockChanged) {
                            // 3. Update product
                            const updatedProduct = {
                                ...product,
                                price: priceChanged ? formatPrice(newPrice) : product.price,
                                stockQuantity: newStock !== undefined ? newStock : product.stockQuantity
                            };

                            const updateRes = await fetch('/api/products', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updatedProduct)
                            });

                            if (updateRes.ok) {
                                updatedCount++;
                            } else {
                                errorCount++;
                            }
                        }
                    } catch (e) {
                        console.error(`Failed to sync product ${product.id}`, e);
                        errorCount++;
                    }
                }
            }

            await fetchProducts(); // Refresh list regardless

            const message = language === 'uz'
                ? `Tekshirildi: ${checkedCount}\nYangilandi: ${updatedCount}\nXatoliklar: ${errorCount}`
                : `Проверено: ${checkedCount}\nОбновлено: ${updatedCount}\nОшибки: ${errorCount}`;

            alert(message);

        } catch (error) {
            console.error("Sync failed", error);
            alert("Sync Error");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(adminT?.status?.delete_confirm || "Haqiqatan ham o'chirmoqchimisiz?")) return;

        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    const toggleGroup = (title: string) => {
        setExpandedGroups(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    // Grouping Logic
    const groupedProducts = products.reduce((acc, product) => {
        const title = product.uz.title; // Group by Uzbek title as primary key
        if (!acc[title]) {
            acc[title] = [];
        }
        acc[title].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    const filteredGroups = Object.entries(groupedProducts).filter(([title, group]) => {
        const searchLower = searchTerm.toLowerCase();
        return title.toLowerCase().includes(searchLower) ||
            group.some(p => p.ru.title.toLowerCase().includes(searchLower));
    });

    const getSourceLabel = (source?: string) => {
        switch (source) {
            case 'uzum': return { label: 'Uzum Market', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' };
            case 'yandex': return { label: 'Yandex', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
            case 'china': return { label: adminT?.china || 'Xitoy', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
            case 'direct': return { label: adminT?.direct || "To'g'ridan-to'g'ri", color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
            default: return { label: 'Uzum Market', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
        }
    };

    return (
        <div className="p-8 lg:p-12 animate-in fade-in duration-700 pb-32">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{adminT?.products || "Mahsulotlar"}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
                        {(adminT?.total_products_count || "Jami {count} ta mahsulot mavjud").replace('{count}', products.length.toString())}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={syncAllProducts}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-4 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />
                        {language === 'uz' ? "Narxlarni yangilash" : "Обновить цены"}
                    </button>
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 px-6 py-4 bg-brand-orange text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        {adminT?.add_new || "Yangi qo'shish"}
                    </Link>
                </div>
            </header>

            {/* Search and Filters */}
            <div className="mb-8 bg-white dark:bg-gray-900 p-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <Search className="text-gray-400 ml-2" size={24} />
                <input
                    type="text"
                    placeholder={adminT?.search_placeholder || "Mahsulot nomini qidirish..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white font-medium text-lg placeholder:text-gray-400"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-brand-orange" size={40} />
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">{adminT?.table?.image || "Rasm"}</th>
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">{adminT?.table?.name || "Nom"}</th>
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">{adminT?.table?.price || "Sotuv Narxi"}</th>
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">{adminT?.table?.cost || "Tan Narx"}</th>
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-center">{adminT?.table?.source || "Manba"}</th>
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-center">{adminT?.table?.stock || "Qoldiq"}</th>
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-right">{adminT?.table?.actions || "Amallar"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredGroups.map(([title, groupProducts]) => {
                                    const mainProduct = groupProducts[0];
                                    const isExpanded = expandedGroups.includes(title);
                                    const localizedTitle = mainProduct[language]?.title || mainProduct.uz.title;
                                    const fallbackTitle = language === 'ru' ? mainProduct.uz.title : mainProduct.ru.title;
                                    const totalStock = groupProducts.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
                                    const uniqueSources = Array.from(new Set(groupProducts.map(p => p.source || 'uzum')));

                                    // Price range calculation
                                    const prices = groupProducts.map(p => parseInt(p.price.replace(/\D/g, '')) || 0);
                                    const minPrice = Math.min(...prices);
                                    const maxPrice = Math.max(...prices);
                                    const priceDisplay = minPrice === maxPrice
                                        ? mainProduct.price
                                        : `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} so'm`;

                                    // Cost Price range calculation
                                    const costPrices = groupProducts.map(p => parseInt((p.costPrice || "0").replace(/\D/g, '')) || 0);
                                    const minCost = Math.min(...costPrices);
                                    const maxCost = Math.max(...costPrices);
                                    const costDisplay = (minCost === 0 && maxCost === 0)
                                        ? "—"
                                        : (minCost === maxCost
                                            ? `${minCost.toLocaleString()} so'm`
                                            : `${minCost.toLocaleString()} - ${maxCost.toLocaleString()} so'm`);

                                    return (
                                        <>
                                            {/* Group Header Row */}
                                            <tr key={title} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer" onClick={() => toggleGroup(title)}>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <button className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                        </button>
                                                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                                            <img src={mainProduct.image} alt={localizedTitle} className="w-full h-full object-cover" />
                                                            {groupProducts.length > 1 && (
                                                                <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                                                    <Layers size={10} />
                                                                    {groupProducts.length}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{localizedTitle}</p>
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{fallbackTitle}</p>
                                                </td>
                                                <td className="p-6 font-bold text-gray-900 dark:text-white">
                                                    {priceDisplay}
                                                </td>
                                                <td className="p-6 font-bold text-gray-900 dark:text-white">
                                                    {costDisplay}
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="flex flex-wrap items-center justify-center gap-1">
                                                        {uniqueSources.map(source => {
                                                            const { label, color } = getSourceLabel(source);
                                                            return (
                                                                <span key={source} className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${color}`}>
                                                                    {label}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${totalStock > 0
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                        {totalStock}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    {/* Actions for single product group */}
                                                    {groupProducts.length === 1 && (
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link
                                                                href={`/admin/products/${mainProduct.id}`}
                                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Edit2 size={18} />
                                                            </Link>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(mainProduct.id); }}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* Expanded Variant Rows */}
                                            {isExpanded && groupProducts.length > 1 && groupProducts.map((product) => {
                                                const { label, color } = getSourceLabel(product.source);
                                                return (
                                                    <tr key={product.id} className="bg-gray-50/50 dark:bg-gray-800/30 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <td className="p-6 pl-16 opacity-50 text-right font-black text-gray-300 text-sm">
                                                            <div className="flex items-center gap-2 justify-end">
                                                                <span className="w-2 h-2 rounded-full bg-gray-300" />
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">#{product.id}</span>
                                                        </td>
                                                        <td className="p-6 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                                            {product.price}
                                                        </td>
                                                        <td className="p-6 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                                            {product.costPrice || "—"}
                                                        </td>
                                                        <td className="p-6 text-center">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider scale-90 ${color}`}>
                                                                {label}
                                                            </span>
                                                        </td>
                                                        <td className="p-6 text-center text-sm font-bold text-gray-600">
                                                            {product.stockQuantity || 0}
                                                        </td>
                                                        <td className="p-6 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Link href={`/admin/products/${product.id}`} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors">
                                                                    <Edit2 size={16} />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(product.id)}
                                                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    );
                                })}

                                {filteredGroups.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Package size={64} className="mb-4 opacity-20" />
                                                <p className="font-medium">{adminT?.status?.no_products || "Mahsulotlar topilmadi"}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
