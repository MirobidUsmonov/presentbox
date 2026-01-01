
"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit2, Loader2, Package, Copy, Save, RefreshCw, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/lib/translations";
import { ImportProductModal } from "@/components/admin-modals";
import { useLanguage } from "@/components/language-provider";

export default function CategoryProductsPage() {
    const { t, language } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});
    const [priceUpdates, setPriceUpdates] = useState<Record<number, string>>({});
    const [costPriceUpdates, setCostPriceUpdates] = useState<Record<number, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const adminT = (t as any).admin;
    const CATEGORY_LABELS: Record<string, string> = {
        uzum: "Uzum Market",
        china: adminT?.china || "Xitoy",
        yandex: "Yandex",
        direct: adminT?.direct || "To'g'ridan-to'g'ri",
    };

    useEffect(() => {
        if (slug) {
            fetchProducts();
            if (slug === 'uzum') {
                handleSync();
            }
        }
    }, [slug]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            const filtered = data.filter((p: Product) => {
                if (slug === 'uzum') return p.source === 'uzum' || !p.source;
                return p.source === slug;
            });
            setProducts(filtered);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/api/products/sync', { method: 'POST' });
            if (res.ok) {
                await fetchProducts();
            }
        } catch (error) {
            console.error("Sync failed", error);
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

    const handleImport = async (sourceProduct: Product) => {
        try {
            const { id, ...rest } = sourceProduct;
            const newProduct = {
                ...rest,
                source: slug as any,
                stockQuantity: 0 // Reset stock for imported item
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });

            if (res.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error("Import failed", error);
        }
    };

    const handleStockChange = (productId: number, newStock: string) => {
        const stock = parseInt(newStock) || 0;
        setStockUpdates(prev => ({ ...prev, [productId]: stock }));
    };

    const handlePriceChange = (productId: number, type: 'price' | 'costPrice', val: string) => {
        if (type === 'price') {
            setPriceUpdates(prev => ({ ...prev, [productId]: val }));
        } else {
            setCostPriceUpdates(prev => ({ ...prev, [productId]: val }));
        }
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            const allIds = new Set([
                ...Object.keys(stockUpdates).map(Number),
                ...Object.keys(priceUpdates).map(Number),
                ...Object.keys(costPriceUpdates).map(Number)
            ]);

            const promises = Array.from(allIds).map(async (id) => {
                const product = products.find(p => p.id === id);
                if (product) {
                    const updatedProduct = {
                        ...product,
                        stockQuantity: stockUpdates[id] !== undefined ? stockUpdates[id] : product.stockQuantity,
                        price: priceUpdates[id] !== undefined ? priceUpdates[id] : product.price,
                        costPrice: costPriceUpdates[id] !== undefined ? costPriceUpdates[id] : product.costPrice,
                    };

                    await fetch('/api/products', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedProduct)
                    });
                }
            });

            await Promise.all(promises);
            await fetchProducts();
            setStockUpdates({});
            setPriceUpdates({});
            setCostPriceUpdates({});
        } catch (error) {
            console.error("Failed to save updates", error);
            alert(adminT?.status?.error || "Xatolik yuz berdi");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.uz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ru.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 lg:p-12 animate-in fade-in duration-700 pb-32">
            <ImportProductModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
                existingProducts={products}
            />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/admin/products" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            {adminT?.products || "Mahsulotlar"}
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-black uppercase tracking-widest rounded-lg">
                            {CATEGORY_LABELS[slug] || slug}
                        </span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        {CATEGORY_LABELS[slug] || slug} {language === 'ru' ? 'продукты' : 'mahsulotlari'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
                        {(adminT?.total_products_count || "Jami {count} ta mahsulot").replace('{count}', products.length.toString())}
                    </p>
                </div>
                <div className="flex gap-3">
                    {slug === 'uzum' && (
                        <>
                            <Link
                                href="/admin/categories/uzum/unit-economics"
                                className="flex items-center gap-2 px-6 py-4 bg-orange-50 text-orange-600 font-bold rounded-2xl shadow-sm border border-orange-100 hover:bg-orange-100 transition-all active:scale-95"
                            >
                                <BarChart3 size={20} />
                                {adminT?.unit_economics || "Unit Iqtisodiyot"}
                            </Link>
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="flex items-center gap-2 px-6 py-4 bg-blue-50 text-blue-600 font-bold rounded-2xl shadow-sm border border-blue-100 hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />
                                {isSyncing ? (adminT?.status?.syncing || "Yangilanmoqda...") : (adminT?.status?.refresh || "Yangilash")}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95"
                    >
                        <Copy size={20} />
                        {adminT?.status?.import || "Import qilish"}
                    </button>
                    <Link
                        href={`/admin/products/new?source=${slug}`}
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
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">{adminT?.table?.category || "Kategoriya"}</th>
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-center">{adminT?.table?.stock || "Qoldiq"}</th>
                                    <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-right">{adminT?.table?.actions || "Amallar"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredProducts.map((product) => {
                                    const localizedTitle = product[language]?.title || product.uz.title;
                                    const fallbackTitle = language === 'ru' ? product.uz.title : product.ru.title;

                                    return (
                                        <tr key={product.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                            <td className="p-6">
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                                    <img src={product.image} alt={localizedTitle} className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{localizedTitle}</p>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{fallbackTitle}</p>
                                            </td>
                                            <td className="p-6">
                                                <InlinePriceEdit
                                                    value={priceUpdates[product.id] !== undefined ? priceUpdates[product.id] : product.price}
                                                    onChange={(val) => handlePriceChange(product.id, 'price', val)}
                                                    isModified={priceUpdates[product.id] !== undefined}
                                                    currency={adminT?.currency}
                                                />
                                            </td>
                                            <td className="p-6">
                                                <InlinePriceEdit
                                                    value={costPriceUpdates[product.id] !== undefined ? costPriceUpdates[product.id] : product.costPrice}
                                                    onChange={(val) => handlePriceChange(product.id, 'costPrice', val)}
                                                    isModified={costPriceUpdates[product.id] !== undefined}
                                                    placeholder="0"
                                                    currency={adminT?.currency}
                                                />
                                            </td>
                                            <td className="p-6">
                                                <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-xs font-black uppercase tracking-wider">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex justify-center">
                                                    <div className="relative w-24">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl font-bold text-center outline-none transition-colors text-gray-900 dark:text-white ${stockUpdates[product.id] !== undefined
                                                                ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/10'
                                                                : 'border-transparent focus:border-brand-orange/50'
                                                                }`}
                                                            value={stockUpdates[product.id] !== undefined ? stockUpdates[product.id] : (product.stockQuantity || 0)}
                                                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/products/${product.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors">
                                                        <Edit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Package size={64} className="mb-4 opacity-20" />
                                                <p className="font-medium">{adminT?.status?.no_products || "Ushbu bo'limda mahsulotlar yo'q"}</p>
                                                <button onClick={() => setIsImportModalOpen(true)} className="mt-4 text-brand-orange font-bold hover:underline">
                                                    {adminT?.status?.import || "Import qilish"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Floating Save Bar */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${Object.keys(stockUpdates).length > 0 || Object.keys(priceUpdates).length > 0 || Object.keys(costPriceUpdates).length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
                <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-gray-900/20 flex items-center justify-center font-bold text-sm">
                            {Object.keys(stockUpdates).length + Object.keys(priceUpdates).length + Object.keys(costPriceUpdates).length}
                        </div>
                        <span className="font-bold">{(adminT?.status?.changes_count || "{count} ta o'zgarish").replace('{count}', '')}</span>
                    </div>
                    <button
                        onClick={saveChanges}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {adminT?.status?.save || "Saqlash"}
                    </button>
                    <button
                        onClick={() => { setStockUpdates({}); setPriceUpdates({}); setCostPriceUpdates({}); }}
                        className="text-gray-400 hover:text-white dark:hover:text-gray-900 text-sm font-bold"
                    >
                        {adminT?.status?.cancel || "Bekor qilish"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function InlinePriceEdit({ value, onChange, isModified, placeholder, currency }: { value?: string, onChange: (val: string) => void, isModified: boolean, placeholder?: string, currency?: string }) {
    const numericPart = (value || "").replace(/\D/g, '');

    const formatDisplay = (val: string) => {
        if (!val) return "";
        return val.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    return (
        <div className="flex items-center gap-1 group/edit min-w-[120px]">
            <div className="relative flex-1">
                <input
                    className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl font-bold text-right outline-none transition-colors text-gray-900 dark:text-white ${isModified
                        ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/10'
                        : 'border-transparent focus:border-brand-orange/50'
                        }`}
                    value={formatDisplay(numericPart)}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\s/g, '');
                        if (/^\d*$/.test(val)) {
                            onChange(val ? `${formatDisplay(val)} ${currency || "so'm"}` : "");
                        }
                    }}
                    placeholder={placeholder || "0"}
                />
            </div>
            <span className="text-xs font-bold text-gray-400 select-none">{currency || "so'm"}</span>
        </div>
    );
}
