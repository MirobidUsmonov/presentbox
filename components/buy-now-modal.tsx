
"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

interface BuyNowModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: number;
        title: string;
        price: string;
        image: string;
        variant?: string;
    };
    language: string;
}

const REGIONS_UZ = [
    "Toshkent shahri", "Toshkent viloyati", "Andijon viloyati", "Buxoro viloyati",
    "Farg'ona viloyati", "Jizzax viloyati", "Xorazm viloyati", "Namangan viloyati",
    "Navoiy viloyati", "Qashqadaryo viloyati", "Qoraqalpog'iston Respublikasi",
    "Samarqand viloyati", "Sirdaryo viloyati", "Surxondaryo viloyati"
];

const REGIONS_RU = [
    "г. Ташкент", "Ташкентская область", "Андижанская область", "Бухарская область",
    "Ферганская область", "Джизакская область", "Хорезмская область", "Наманганская область",
    "Навоийская область", "Кашкадарьинская область", "Республика Каракалпакстан",
    "Самаркандская область", "Сырдарьинская область", "Сурхандарьинская область"
];

export function BuyNowModal({ isOpen, onClose, product, language }: BuyNowModalProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "+998",
        telegram: "",
        region: "",
        district: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const regions = language === 'uz' ? REGIONS_UZ : REGIONS_RU;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    productTitle: product.title,
                    productImage: product.image,
                    variant: product.variant,
                    price: product.price,
                    quantity: 1,
                    totalPrice: parseInt(product.price.replace(/\D/g, '')),
                    customer: formData
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setFormData({
                        firstName: "",
                        lastName: "",
                        phone: "+998",
                        telegram: "",
                        region: "",
                        district: ""
                    });
                }, 2000);
            }
        } catch (error) {
            console.error("Order error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {language === 'uz' ? "Tezkor xarid" : "Быстрая покупка"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {language === 'uz' ? "Buyurtma qabul qilindi!" : "Заказ принят!"}
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'uz' ? "Tez orada operatorimiz siz bilan bog'lanadi." : "Наш оператор свяжется с вами в ближайшее время."}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {/* Product Summary */}
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl">
                            <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{product.title}</p>
                                <p className="text-xs text-brand-orange font-bold">{product.price}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    {language === 'uz' ? "Ism" : "Имя"}
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    {language === 'uz' ? "Familiya" : "Фамилия"}
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                {language === 'uz' ? "Telefon raqam" : "Номер телефона"}
                            </label>
                            <input
                                required
                                type="tel"
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                {language === 'uz' ? "Telegram username" : "Имя пользователя Telegram"}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">@</span>
                                <input
                                    type="text"
                                    className="w-full pl-7 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    value={formData.telegram}
                                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    {language === 'uz' ? "Viloyat" : "Область"}
                                </label>
                                <select
                                    required
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all text-sm appearance-none"
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                >
                                    <option value="">{language === 'uz' ? "Tanlang" : "Выберите"}</option>
                                    {regions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    {language === 'uz' ? "Tuman / Shahar" : "Район / Город"}
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder={language === 'uz' ? "Masalan: Yunusobod" : "Например: Юнусабад"}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-orange hover:bg-brand-coral py-3 rounded-xl font-bold text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting
                                ? (language === 'uz' ? "Yuborilmoqda..." : "Отправка...")
                                : (language === 'uz' ? "Buyurtma berish" : "Заказать")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
