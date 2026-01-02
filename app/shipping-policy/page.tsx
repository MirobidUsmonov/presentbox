
"use client";

import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ShippingPolicyPage() {
    const { language } = useLanguage();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
            <div className="container mx-auto max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-orange mb-8 font-bold transition-all hover:-translate-x-1 group">
                    <ArrowLeft size={20} className="group-hover:scale-110" />
                    {language === 'uz' ? "Bosh sahifaga qaytish" : "Вернуться на главную"}
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        {language === 'uz' ? "YETKAZIB BERISH SHARTLARI" : "УСЛОВИЯ ДОСТАВКИ"}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                        {language === 'uz' ? (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Yetkazib berish hududi</h3>
                                <p>
                                    Yetkazib berish faqat O‘zbekiston Respublikasi hududida amalga oshiriladi.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Yetkazib berish usullari</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Kuryer xizmati</li>
                                    <li>Pochta orqali</li>
                                    <li>Pickup (olib ketish)</li>
                                    <li>Yandex Market PVZ</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Yetkazib berish muddati</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Toshkent shahri: 1–2 ish kuni</li>
                                    <li>Boshqa hududlar: 2–7 ish kuni</li>
                                </ul>
                                <p className="mt-2 text-sm italic">
                                    Tabiiy ofatlar, texnik nosozliklar yoki boshqa kutilmagan holatlar sababli yetkazib berish muddati cho‘zilishi mumkin. Bunday holatlarda sotuvchi javobgar hisoblanmaydi.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Yetkazib berish narxi</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>100 000 so‘mdan yuqori buyurtmalar uchun — bepul</li>
                                    <li>100 000 so‘mdan kam buyurtmalar uchun — 25 000–40 000 so‘m</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. Hamkor kuryerlar</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>BTS</li>
                                    <li>Yandex Market PVZ</li>
                                    <li>Emu Express</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Территория доставки</h3>
                                <p>
                                    Доставка осуществляется только по территории Республики Узбекистан.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Способы доставки</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Курьерская доставка</li>
                                    <li>Почтовая доставка</li>
                                    <li>Самовывоз (Pickup)</li>
                                    <li>Пункты выдачи заказов Yandex Market (PVZ)</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Сроки доставки</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>г. Ташкент: 1–2 рабочих дня</li>
                                    <li>Регионы: 2–7 рабочих дней</li>
                                </ul>
                                <p className="mt-2 text-sm italic">
                                    Сроки доставки могут быть увеличены по причинам, не зависящим от Продавца (форс-мажор, погодные условия, технические сбои). В таких случаях Продавец ответственности не несёт.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Стоимость доставки</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Бесплатно — при заказе от 100 000 сум</li>
                                    <li>25 000 – 40 000 сум — при заказе менее 100 000 сум</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. Службы доставки</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>BTS</li>
                                    <li>Yandex Market PVZ</li>
                                    <li>Emu Express</li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
