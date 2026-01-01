
"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

export default function NewProductPage() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const source = searchParams.get('source') || 'uzum';
    const [isLoading, setIsLoading] = useState(false);

    const adminT = (t as any).admin;
    const formT = adminT?.form;
    const catT = adminT?.categories_list;

    // Basic state for product fields
    const [formData, setFormData] = useState({
        price: "",
        costPrice: "",
        category: "Gadjetlar",
        image: "",
        uzumUrl: "",
        yandexUrl: "",
        source: source,
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // First check for duplicates
            const checkRes = await fetch('/api/products');
            const products = await checkRes.json();
            const isDuplicate = products.some((p: any) =>
                (formData.uzumUrl && p.uzumUrl === formData.uzumUrl) ||
                (p.uz.title === formData.uz.title && p.source === formData.source)
            );

            if (isDuplicate) {
                alert(formT?.duplicate_error || "Bunday mahsulot allaqachon mavjud!");
                setIsLoading(false);
                return;
            }

            const productPayload = {
                price: formData.price,
                costPrice: formData.costPrice,
                category: formData.category,
                image: formData.image,
                uzumUrl: formData.uzumUrl,
                yandexUrl: formData.yandexUrl,
                gallery: formData.gallery.filter(Boolean),
                inStock: true,
                source: formData.source,
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
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productPayload)
            });

            if (res.ok) {
                if (formData.source === 'uzum' || !formData.source) {
                    router.push('/admin/products');
                } else {
                    router.push(`/admin/categories/${formData.source}`);
                }
            } else {
                alert(adminT?.status?.error || "Xatolik yuz berdi!");
            }
        } catch (error) {
            console.error(error);
            alert(adminT?.status?.error || "Xatolik yuz berdi!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 lg:p-12 animate-in fade-in duration-700 max-w-5xl mx-auto">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-brand-orange transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{formT?.new_product || "Yangi mahsulot"}</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{formT?.new_product_desc || "Yangi tovarni tizimga kiritish"}</p>
                </div>
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
                                    rows={4}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.uz.description}
                                    onChange={e => setFormData({ ...formData, uz: { ...formData.uz, description: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.characteristics || "Xususiyatlar"}</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    placeholder={formT?.characteristics_placeholder || "Masalan:&#10;Suv o'tkazmaydigan&#10;Yengil"}
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
                                    rows={4}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.ru.description}
                                    onChange={e => setFormData({ ...formData, ru: { ...formData.ru, description: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{formT?.characteristics || "Характеристики"}</label>
                                <textarea
                                    rows={4}
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
                                    placeholder={formT?.price_placeholder || "Masalan: 120 000 so'm"}
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
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
                                        placeholder="https://..."
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-orange/20 outline-none text-gray-900 dark:text-white"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                                {formData.image && (
                                    <div className="mt-4 rounded-2xl overflow-hidden h-48 w-full bg-gray-100 border border-gray-200 dark:border-gray-800">
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
                                disabled={isLoading}
                                className="w-full py-4 bg-brand-orange text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                {formT?.save || "Saqlash"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
