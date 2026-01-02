"use client";

import { useState, useEffect } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";

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

export default function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal, clearCart, updateQuantity, removeItem } = useCartStore();
    const [isHydrated, setIsHydrated] = useState(false);

    const { language } = useLanguage();

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

    useEffect(() => {
        useCartStore.persist.rehydrate();
        setIsHydrated(true);
    }, []);

    // Redirect if cart is empty and not success state
    useEffect(() => {
        if (isHydrated && items.length === 0 && !isSuccess) {
            router.push('/');
        }
    }, [isHydrated, items.length, isSuccess, router]);

    if (!isHydrated) return null;

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
                // Optional: Redirect home after a delay
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
        } catch (error) {
            console.error("Order error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={48} strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Muvaffaqiyatli!</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Buyurtmangiz qabul qilindi. Tez orada operatorimiz siz bilan bog'lanadi.
                    </p>
                    <Link
                        href="/"
                        className="block w-full bg-brand-orange hover:bg-brand-coral text-white font-bold py-4 rounded-xl transition-all"
                    >
                        Bosh sahifaga qaytish
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <ArrowLeft className="text-gray-600 dark:text-gray-300" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {language === 'uz' ? "Buyurtmani rasmiylashtirish" : "Оформление заказа"}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT COLUMN - FORM */}
                    <div className="w-full lg:w-3/5 bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-sm h-fit">
                        {/* Contact Info */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center text-sm">1</span>
                                {language === 'uz' ? "Kontakt ma'lumotlari" : "Контактная информация"}
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Ism</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Familiya</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Telefon raqam</label>
                                        <input
                                            required
                                            type="tel"
                                            inputMode="numeric"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            placeholder="+998"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Telegram username</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-500">@</span>
                                            <input
                                                type="text"
                                                className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                                value={formData.telegram}
                                                onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center text-sm">2</span>
                                {language === 'uz' ? "Yetkazib berish" : "Доставка"}
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Viloyat</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400 appearance-none"
                                            value={formData.region}
                                            onChange={e => setFormData({ ...formData, region: e.target.value })}
                                        >
                                            <option value="">Tanlang</option>
                                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Tuman / Shahar</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                            value={formData.district}
                                            onChange={e => setFormData({ ...formData, district: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Usulni tanlang</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {DELIVERY_METHODS.map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setDeliveryMethod(method.id)}
                                                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${deliveryMethod === method.id
                                                    ? "border-brand-orange bg-brand-orange/5 text-brand-orange font-bold shadow-sm ring-1 ring-brand-orange"
                                                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                                                    }`}
                                            >
                                                <span className="text-sm font-medium">{language === 'uz' ? method.name_uz : method.name_ru}</span>
                                                {deliveryMethod === method.id && <Check size={18} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SUMMARY */}
                    <div className="w-full lg:w-2/5 flex flex-col gap-6">
                        {/* Order Items */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    {language === 'uz' ? "Sizning buyurtmangiz" : "Ваш заказ"}
                                </h3>
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {items.length}
                                </span>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.variant}`} className="flex gap-4 group relative">
                                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-sm flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <span className="font-medium text-gray-900 dark:text-white line-clamp-2 pr-6">{item.title}</span>
                                                <span className="font-bold text-gray-900 dark:text-white ml-2 whitespace-nowrap">
                                                    {(parseInt(item.price.replace(/\D/g, '')) * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="text-gray-500 text-xs">
                                                    {item.variant && <span className="mr-2">{item.variant}</span>}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (item.quantity > 1) {
                                                                updateQuantity(item.id, -1, item.variant);
                                                            } else {
                                                                removeItem(item.id, item.variant);
                                                            }
                                                        }}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-lg leading-none"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-medium text-gray-900 dark:text-white text-sm w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, 1, item.variant)}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-lg leading-none"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips & Totals */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                            {/* TIP SECTION */}
                            <div className="mb-6">
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
                                                ? 'bg-blue-50 border-blue-500'
                                                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                                                }`}
                                        >
                                            <span className={`text-sm font-bold ${tipPercentage === pct ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                                {pct * 100}%
                                            </span>
                                            <span className={`text-[10px] ${tipPercentage === pct ? 'text-blue-600/80 dark:text-blue-400/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {(currentSubtotal * pct).toLocaleString()}
                                            </span>
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => { setTipPercentage(null); setCustomTip(0); }}
                                        className={`py-2 px-1 rounded-lg text-center transition-all text-xs font-medium border ${tipPercentage === null && customTip === 0
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
                                            className="w-full pl-3 pr-12 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
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

                            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
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
                                {shippingCost > 0 && (
                                    <p className="text-xs text-brand-orange text-right">
                                        {language === 'uz'
                                            ? `Yetkazib berish bepul bo'lishi uchun yana ${(100000 - currentSubtotal).toLocaleString()} UZS lik xarid qiling`
                                            : `До бесплатной доставки осталось купить на ${(100000 - currentSubtotal).toLocaleString()} сум`}
                                    </p>
                                )}
                                {tipAmount > 0 && (
                                    <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                                        <span>Choychaqa (Tip):</span>
                                        <span>+{tipAmount.toLocaleString()} UZS</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-baseline pt-2">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Jami:</span>
                                    <span className="text-2xl font-black text-brand-orange">
                                        {totalPrice.toLocaleString()} <span className="text-sm font-medium text-gray-500">UZS</span>
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-orange hover:bg-brand-coral text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                            >
                                {isSubmitting ? "Yuborilmoqda..." : (language === 'uz' ? "BUYURTMA BERISH" : "ОФОРМИТЬ ЗАКАЗ")}
                            </button>

                            <p className="text-center text-[10px] text-gray-400 mt-3">
                                {language === 'uz' ? (
                                    <>
                                        Tugmani bosish orqali siz <Link href="/terms-of-service" className="underline hover:text-brand-orange">ommaviy oferta shartlariga</Link> rozilik bildirasiz
                                    </>
                                ) : (
                                    <>
                                        Нажимая на кнопку, вы соглашаетесь с <Link href="/terms-of-service" className="underline hover:text-brand-orange">условиями публичной оферты</Link>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .label-text { @apply block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide }
                .input-field { @apply w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all placeholder:text-gray-400 }
            `}</style>
        </div>
    );
}
