"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Trash2, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Product } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";

export default function EditProductPage() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);

    const adminT = (t as any).admin;
    const formT = adminT?.form;
    const catT = adminT?.categories_list;

    const [formData, setFormData] = useState({
        price: "",
        costPrice: "",
        category: "Gadjetlar",
        image: "",
        uzumUrl: "",
        yandexUrl: "",
        stockQuantity: 0,
        source: "",
        gallery: [] as string[],
        uz: {
            title: "",
            description: "",
            characteristics: ""
        },
        ru: {
            title: "",
            description: "",
            characteristics: ""
        }
    });

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch('/api/products');
            const products: Product[] = await res.json();
            const product = products.find(p => p.id === parseInt(id));

            if (product) {
                setFetchedProduct(product);
                setFormData({
                    price: product.price,
                    costPrice: product.costPrice || "",
                    category: product.category,
                    image: product.image,
                    uzumUrl: product.uzumUrl,
                    yandexUrl: product.yandexUrl || "",
                    stockQuantity: product.stockQuantity || 0,
                    source: product.source || 'uzum',
                    gallery: product.gallery || [],
                    uz: {
                        ...product.uz,
                        characteristics: Array.isArray(product.uz.characteristics)
                            ? product.uz.characteristics.join('\n')
                            : (product.uz.characteristics || "")
                    },
                    ru: {
                        ...product.ru,
                        characteristics: Array.isArray(product.ru.characteristics)
                            ? product.ru.characteristics.join('\n')
                            : (product.ru.characteristics || "")
                    }
                });
            } else {
                alert(adminT?.status?.no_products || "Mahsulot topilmadi");
                router.push('/admin/products');
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const productPayload = {
                ...fetchedProduct,
                price: formData.price,
                costPrice: formData.costPrice,
                category: formData.category,
                image: formData.image,
                uzumUrl: formData.uzumUrl,
                yandexUrl: formData.yandexUrl,
                stockQuantity: parseInt(String(formData.stockQuantity)),
                source: formData.source,
                gallery: formData.gallery.filter(Boolean),
                uz: {
                    ...formData.uz,
                    characteristics: formData.uz.characteristics.split('\n').filter(Boolean)
                },
                ru: {
                    ...formData.ru,
                    characteristics: formData.ru.characteristics.split('\n').filter(Boolean)
                }
            };

            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productPayload)
            });

            if (res.ok) {
                alert(adminT?.status?.save || "Muvaffaqiyatli saqlandi!");
                router.back();
            } else {
                alert(adminT?.status?.error || "Xatolik yuz berdi!");
            }
        } catch (error) {
            console.error(error);
            alert(adminT?.status?.error || "Xatolik yuz berdi!");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(adminT?.status?.delete_confirm || "Haqiqatan ham o'chirmoqchimisiz?")) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/admin/products');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-brand-orange" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12 animate-in fade-in duration-700 max-w-5xl mx-auto pb-32">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-brand-orange transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{formT?.edit_product || "Mahsulotni tahrirlash"}</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">#{id} - {formData[language]?.title || formData.uz.title}</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="p-3 px-4 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                    <Trash2 size={20} />
                    {adminT?.actions?.delete || "O'chirish"}
                </button>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Uzbek Section */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">UZ</span>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{formT?.uz_section || "O'zbek tilida"}</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.title || "Mahsulot nomi"}</label>
                                <input
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.uz.title}
                                    onChange={e => setFormData({ ...formData, uz: { ...formData.uz, title: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.description || "Tavsif"}</label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.uz.description}
                                    onChange={e => setFormData({ ...formData, uz: { ...formData.uz, description: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.characteristics || "Xususiyatlar"}</label>
                                <textarea
                                    rows={6}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.uz.characteristics}
                                    onChange={e => setFormData({ ...formData, uz: { ...formData.uz, characteristics: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Russian Section */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">RU</span>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{formT?.ru_section || "Rus tilida"}</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.title || "Название товара"}</label>
                                <input
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.ru.title}
                                    onChange={e => setFormData({ ...formData, ru: { ...formData.ru, title: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.description || "Описание"}</label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.ru.description}
                                    onChange={e => setFormData({ ...formData, ru: { ...formData.ru, description: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.characteristics || "Характеристики"}</label>
                                <textarea
                                    rows={6}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.ru.characteristics}
                                    onChange={e => setFormData({ ...formData, ru: { ...formData.ru, characteristics: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm sticky top-8">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">{formT?.main_info || "Asosiy ma'lumotlar"}</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.price || "Narx"}</label>
                                <input
                                    required
                                    disabled={!!formData.uzumUrl}
                                    className={`w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white ${formData.uzumUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                                {formData.uzumUrl && <p className="text-xs text-blue-500 font-medium mt-1 ml-1">{language === 'ru' ? 'Синхронизировано с Uzum (автоматически)' : 'Uzum bilan sinxronlangan (avtomatik)'}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.cost_price || "Tan Narx (Asl narxi)"}</label>
                                <input
                                    placeholder={formT?.price_placeholder || "Masalan: 100 000 so'm"}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.costPrice}
                                    onChange={e => setFormData({ ...formData, costPrice: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{adminT?.table?.stock || "Qoldiq"}</label>
                                <input
                                    type="number"
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.stockQuantity}
                                    onChange={e => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.category || "Kategoriya"}</label>
                                <select
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none appearance-none text-gray-900 dark:text-white"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Gadjetlar">{catT?.gadjets || "Gadjetlar"}</option>
                                    <option value="Go'zallik">{catT?.beauty || "Go'zallik"}</option>
                                    <option value="Avto">{catT?.auto || "Avto"}</option>
                                    <option value="Uy">{catT?.home || "Uy"}</option>
                                    <option value="Kiyim">{catT?.clothing || "Kiyim"}</option>
                                    <option value="Sovg'a">{catT?.gift || "Sovg'a"}</option>
                                    <option value="Hazil">{catT?.joke || "Hazil"}</option>
                                    <option value="Aksessuarlar">{catT?.accessories || "Aksessuarlar"}</option>
                                    <option value="Hobbi">{catT?.hobby || "Hobbi"}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.source || "Manba (Source)"}</label>
                                <select
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none appearance-none text-gray-900 dark:text-white"
                                    value={formData.source}
                                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                                >
                                    <option value="uzum">Uzum Market</option>
                                    <option value="yandex">Yandex</option>
                                    <option value="china">{adminT?.china || "Xitoy"}</option>
                                    <option value="direct">{adminT?.direct || "To'g'ridan-to'g'ri"}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.image_url || "Asosiy Rasm URL"}</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                                {formData.image && (
                                    <div className="mt-4 rounded-2xl overflow-hidden h-48 w-full bg-gray-100">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.gallery || "Galereya"}</label>
                                <div className="space-y-3">
                                    {formData.gallery.map((url, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                placeholder={`Rasm URL #${index + 1}`}
                                                className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white text-sm"
                                                value={url}
                                                onChange={e => {
                                                    const newGallery = [...formData.gallery];
                                                    newGallery[index] = e.target.value;
                                                    setFormData({ ...formData, gallery: newGallery });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newGallery = formData.gallery.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, gallery: newGallery });
                                                }}
                                                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, ""] })}
                                        className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-orange hover:text-brand-orange transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={20} />
                                        {formT?.add_image || "Rasm qo'shish"}
                                    </button>
                                </div>
                                {/* Gallery Preview Grid */}
                                {formData.gallery.some(url => url) && (
                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                        {formData.gallery.map((url, index) => url && (
                                            <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-800 relative group">
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.uzum_url || "Uzum Market URL"}</label>
                                <input
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.uzumUrl}
                                    onChange={e => setFormData({ ...formData, uzumUrl: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.yandex_url || "Yandex Market URL"}</label>
                                <input
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.yandexUrl}
                                    onChange={e => setFormData({ ...formData, yandexUrl: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-4 bg-brand-orange text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                {formT?.save || "Saqlash"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
