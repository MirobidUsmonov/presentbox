
"use client";

import { useState } from "react";
import { X, Check, Minus, Plus } from "lucide-react";

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

const DELIVERY_METHODS = [
    { id: "bts", name_uz: "BTS Pochta", name_ru: "BTS Почта" },
    { id: "emu", name_uz: "EMU Express Pochta", name_ru: "EMU Express Почта" },
    { id: "yandex_punkt", name_uz: "Yandex Punkt (PVZ)", name_ru: "Yandex Пункт выдачи" },
    { id: "yandex_taxi", name_uz: "Yandex Taxi", name_ru: "Yandex Такси" }
];

export function BuyNowModal({ isOpen, onClose, product, language }: BuyNowModalProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "+998 ",
        telegram: "",
        region: "",
        district: ""
    });
    const [quantity, setQuantity] = useState(1);
    const [deliveryMethod, setDeliveryMethod] = useState(DELIVERY_METHODS[0].id);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const regions = language === 'uz' ? REGIONS_UZ : REGIONS_RU;
    const basePrice = parseInt(product.price.replace(/\D/g, ''));
    const subtotal = basePrice * quantity;
    const shippingCost = subtotal > 100000 ? 0 : 25000;
    const totalPrice = subtotal + shippingCost;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Ensure prefix
        if (!val.startsWith("+998 ")) {
            val = "+998 ";
        }

        // Allow only numbers and spaces
        const raw = val.replace(/[^\d+ ]/g, "");

        // Limit length (13 digits total: 998 + 9 digits = 12, plus + sign = 13. With spaces formatted it's longer)
        // Simplified: just limit raw digits to 12 (998 + 9)
        const digits = raw.replace(/\D/g, "");
        if (digits.length > 12) return;

        // Simple formatting
        setFormData({ ...formData, phone: raw });
    };

    const handleQuantity = (delta: number) => {
        const newQ = quantity + delta;
        if (newQ >= 1 && newQ <= 100) {
            setQuantity(newQ);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Strict Phone Validation
        const phoneDigits = formData.phone.replace(/\D/g, "");
        if (phoneDigits.length !== 12) {
            alert(language === 'uz' ? "Telefon raqam noto'g'ri kitirilgan!" : "Неверный формат номера телефона!");
            return;
        }

        setIsSubmitting(true);

        try {
            const selectedMethod = DELIVERY_METHODS.find(m => m.id === deliveryMethod);
            const methodName = language === 'uz' ? selectedMethod?.name_uz : selectedMethod?.name_ru;

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
                    quantity: quantity,
                    subtotal: subtotal,
                    shippingCost: shippingCost,
                    totalPrice: totalPrice,
                    deliveryMethod: methodName,
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
                        phone: "+998 ",
                        telegram: "",
                        region: "",
                        district: ""
                    });
                    setQuantity(1);
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
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl space-y-3">
                            <div className="flex items-center gap-3">
                                <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{product.title}</p>
                                    <p className="text-xs text-brand-orange font-bold">{product.price}</p>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                    {language === 'uz' ? "Soni:" : "Количество:"}
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantity(-1)}
                                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-bold text-gray-900 dark:text-white w-4 text-center">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleQuantity(1)}
                                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Total Price & Delivery Summary */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-2">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>{language === 'uz' ? "Mahsulot narxi:" : "Цена товара:"}</span>
                                    <span>{subtotal.toLocaleString()} so'm</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {language === 'uz' ? "Yetkazib berish:" : "Доставка:"}
                                    </span>
                                    <span className={shippingCost === 0 ? "text-green-500 font-bold" : "text-gray-900 dark:text-gray-200"}>
                                        {shippingCost === 0
                                            ? (language === 'uz' ? "Bepul" : "Бесплатно")
                                            : `${shippingCost.toLocaleString()} so'm`}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                        {language === 'uz' ? "Jami:" : "Итого:"}
                                    </span>
                                    <span className="text-base font-black text-brand-orange">
                                        {totalPrice.toLocaleString()} So'm
                                    </span>
                                </div>
                                {shippingCost === 0 ? (
                                    <p className="text-[10px] text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-center font-medium animate-in zoom-in">
                                        🎉 {language === 'uz' ? "100 000 so'mdan oshgani uchun yetkazib berish bepul!" : "Бесплатная доставка при заказе от 100 000 сум!"}
                                    </p>
                                ) : (
                                    <p className="text-[10px] text-brand-orange bg-brand-orange/10 px-2 py-1 rounded text-center font-medium">
                                        💡 {language === 'uz'
                                            ? `Yana ${(100000 - subtotal).toLocaleString()} so'm savdo qiling va yetkazib berish bepul!`
                                            : `Добавьте товаров еще на ${(100000 - subtotal).toLocaleString()} сум для бесплатной доставки!`}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Delivery Method Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                                {language === 'uz' ? "Yetkazib berish turi" : "Способ доставки"}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {DELIVERY_METHODS.map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setDeliveryMethod(method.id)}
                                        className={`p-3 rounded-xl border text-left text-xs transition-all ${deliveryMethod === method.id
                                            ? "border-brand-orange bg-brand-orange/5 text-brand-orange font-bold shadow-sm"
                                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                                            }`}
                                    >
                                        {language === 'uz' ? method.name_uz : method.name_ru}
                                    </button>
                                ))}
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
                                inputMode="numeric"
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                placeholder="+998 90 123 45 67"
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
