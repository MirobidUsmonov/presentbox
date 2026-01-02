"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useCartStore } from "@/lib/store";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
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

const TIPS = [0.15, 0.20, 0.30];

export function CheckoutModal({ isOpen, onClose, language }: CheckoutModalProps) {
    const { items, subtotal, clearCart } = useCartStore();

    // Fallback if needed
    const regions = language === 'uz' ? REGIONS_UZ : REGIONS_RU;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "+998 ",
        telegram: "",
        region: "",
        district: ""
    });
    const [deliveryMethod, setDeliveryMethod] = useState(DELIVERY_METHODS[0].id);
    const [tipPercentage, setTipPercentage] = useState<number | null>(0.15);
    const [customTip, setCustomTip] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const currentSubtotal = subtotal();
    const shippingCost = currentSubtotal > 100000 ? 0 : 25000;

    let tipAmount = 0;
    if (tipPercentage !== null) {
        tipAmount = Math.round(currentSubtotal * tipPercentage);
    } else {
        tipAmount = customTip;
    }

    const totalPrice = currentSubtotal + shippingCost + tipAmount;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (!val.startsWith("+998 ")) val = "+998 ";
        const raw = val.replace(/[^\d+ ]/g, "");
        const digits = raw.replace(/\D/g, "");
        if (digits.length > 12) return;
        setFormData({ ...formData, phone: raw });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({
                        productId: i.id,
                        title: i.title,
                        quantity: i.quantity,
                        price: i.price,
                        variant: i.variant
                    })),
                    subtotal: currentSubtotal,
                    shippingCost: shippingCost,
                    tip: tipAmount,
                    totalPrice: totalPrice,
                    deliveryMethod: methodName,
                    customer: formData
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                clearCart();
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
                }, 2000);
            }
        } catch (error) {
            console.error("Order error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {language === 'uz' ? "Buyurtmani rasmiylashtirish" : "Оформление заказа"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Buyurtma qabul qilindi!</h4>
                        <p className="text-gray-500 dark:text-gray-400">Tez orada operatorimiz siz bilan bog'lanadi.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row">
                        {/* LEFT COLUMN - FORM */}
                        <div className="w-full lg:w-3/5 p-6 lg:border-r border-gray-100 dark:border-gray-700 space-y-6">
                            {/* Contact Info */}
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">{language === 'uz' ? "Kontakt ma'lumotlari" : "Контактная информация"}</h4>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="label-text">Ism</label>
                                            <input required type="text" className="input-field" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="label-text">Familiya</label>
                                            <input required type="text" className="input-field" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="label-text">Telefon raqam</label>
                                            <input required type="tel" inputMode="numeric" className="input-field" value={formData.phone} onChange={handlePhoneChange} placeholder="+998" />
                                        </div>
                                        <div>
                                            <label className="label-text">Telegram username</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-500">@</span>
                                                <input type="text" className="input-field pl-7" value={formData.telegram} onChange={e => setFormData({ ...formData, telegram: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery */}
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">{language === 'uz' ? "Yetkazib berish" : "Доставка"}</h4>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="label-text">Viloyat</label>
                                            <select required className="input-field appearance-none" value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })}>
                                                <option value="">Tanlang</option>
                                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label-text">Tuman / Shahar</label>
                                            <input required type="text" className="input-field" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label-text">Usulni tanlang</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {DELIVERY_METHODS.map((method) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => setDeliveryMethod(method.id)}
                                                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${deliveryMethod === method.id
                                                        ? "border-brand-orange bg-brand-orange/5 text-brand-orange font-bold shadow-sm"
                                                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                                                        }`}
                                                >
                                                    <span>{language === 'uz' ? method.name_uz : method.name_ru}</span>
                                                    {deliveryMethod === method.id && <Check size={16} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - SUMMARY */}
                        <div className="w-full lg:w-2/5 bg-gray-50 dark:bg-gray-900/50 p-6 flex flex-col justify-between h-auto lg:min-h-[600px]">
                            <div className="space-y-6">
                                {/* Items Overview */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                            {language === 'uz' ? "Sizning buyurtmangiz" : "Ваш заказ"}
                                        </h4>
                                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {items.length}
                                        </span>
                                    </div>
                                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                        {items.map((item) => (
                                            <div key={`${item.id}-${item.variant}`} className="flex gap-3">
                                                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 text-sm">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-medium text-gray-900 dark:text-white line-clamp-2">{item.title}</span>
                                                        <span className="font-bold text-gray-900 dark:text-white ml-2 whitespace-nowrap">{item.price}</span>
                                                    </div>
                                                    <div className="text-gray-500 text-xs mt-0.5">
                                                        {item.variant && <span>{item.variant} • </span>}
                                                        <span>{item.quantity} dona</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* TIP SECTION */}
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                                            {language === 'uz' ? "Jamoani qo'llab-quvvatlash" : "Поддержать команду"}
                                        </span>
                                    </label>

                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {TIPS.map((pct) => (
                                            <button
                                                key={pct}
                                                type="button"
                                                onClick={() => { setTipPercentage(pct); setCustomTip(0); }}
                                                className={`py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center border ${tipPercentage === pct
                                                    ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                                                    }`}
                                            >
                                                <span className="text-sm font-bold">{pct * 100}%</span>
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                    {(currentSubtotal * pct).toLocaleString()}
                                                </span>
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => { setTipPercentage(null); setCustomTip(0); }}
                                            className={`py-2 px-1 rounded-lg text-center transition-all text-xsfont-medium border ${tipPercentage === null && customTip === 0
                                                ? 'bg-gray-100 border-gray-400 text-gray-900 dark:bg-gray-600 dark:border-gray-400 dark:text-white'
                                                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500'
                                                }`}
                                        >
                                            <span className="text-xs font-bold leading-tight">
                                                {language === 'uz' ? "Yo'q" : "Нет"}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                placeholder={language === 'uz' ? "Boshqa summa" : "Другая сумма"}
                                                className="w-full pl-3 pr-12 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={customTip > 0 ? customTip : ''}
                                                onChange={(e) => {
                                                    setTipPercentage(null);
                                                    setCustomTip(Number(e.target.value));
                                                }}
                                                onFocus={() => setTipPercentage(null)}
                                            />
                                            <span className="absolute right-3 top-2 text-xs text-gray-500 font-bold">UZS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Mahsulotlar:</span>
                                    <span>{currentSubtotal.toLocaleString()} UZS</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Yetkazib berish:</span>
                                    <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                                        {shippingCost === 0 ? (language === 'uz' ? "Bepul" : "Бесплатно") : `${shippingCost.toLocaleString()} UZS`}
                                    </span>
                                </div>
                                {tipAmount > 0 && (
                                    <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                                        <span>Choychaqa (Tip):</span>
                                        <span>+{tipAmount.toLocaleString()} UZS</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-baseline pt-2">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Jami:</span>
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                                        {totalPrice.toLocaleString()} <span className="text-sm font-medium text-gray-500">UZS</span>
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                >
                                    {isSubmitting ? "Yuborilmoqda..." : (language === 'uz' ? "BUYURTMA BERISH" : "ОФОРМИТЬ ЗАКАЗ")}
                                </button>

                                <p className="text-center text-[10px] text-gray-400 mt-2">
                                    Tugmani bosish orqali siz ommaviy oferta shartlariga rozilik bildirasiz
                                </p>
                            </div>
                        </div>
                    </form>
                )}
            </div>
            <style jsx>{`
                .label-text { @apply block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 }
                .input-field { @apply w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all placeholder:text-gray-400 }
            `}</style>
        </div>
    );
}
