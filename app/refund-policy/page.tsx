
"use client";

import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
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
                        {language === 'uz' ? "QAYTARISH SIYOSATI" : "ПОЛИТИКА ВОЗВРАТА"}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                        {language === 'uz' ? (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Qaytarish muddati</h3>
                                <p>
                                    Mahsulot xarid qilingan kundan boshlab 10 kun ichida qaytarilishi mumkin.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Qaytarib bo‘lmaydigan holatlar</h3>
                                <p>Quyidagi holatlarda mahsulot qaytarilmaydi:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Ishlatilgan mahsulotlar</li>
                                    <li>Yetkazib berish jarayonida tarkibi o‘zgargan mahsulotlar</li>
                                    <li>Xaridorning shunchaki yoqmaganligi sababli</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Pul mablag‘larini qaytarish</h3>
                                <p>Pul mablag‘lari:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Naqd pulda</li>
                                    <li>Bank kartasiga qaytariladi</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Yetkazib berish xarajatlari</h3>
                                <p>
                                    Yetkazib berish uchun to‘langan mablag‘ qaytarilmaydi.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. Aloqa</h3>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Срок возврата</h3>
                                <p>
                                    Возврат товара возможен в течение 10 дней с момента получения.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Товары, не подлежащие возврату</h3>
                                <p>Возврат не осуществляется в следующих случаях:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Товар был в использовании</li>
                                    <li>Состав или состояние товара изменено во время доставки</li>
                                    <li>Возврат по причине «не понравился»</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Возврат денежных средств</h3>
                                <p>Возврат средств осуществляется:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Наличными</li>
                                    <li>На банковскую карту</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Стоимость доставки</h3>
                                <p>
                                    Стоимость доставки не подлежит возврату.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. Контактная информация</h3>
                            </>
                        )}
                        <p>
                            📞 Telefon: <a href="tel:+998770454547" className="text-blue-600 hover:underline">+998 77 045 45 47</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
