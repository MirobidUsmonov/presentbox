
"use client";

import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
                        {language === 'uz' ? "FOYDALANISH SHARTLARI (OMMAVIY OFERTA)" : "ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ (ПУБЛИЧНАЯ ОФЕРТА)"}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                        {language === 'uz' ? (
                            <>
                                <p>
                                    Ushbu hujjat <strong>present-box.uz</strong> saytida joylashtirilgan ommaviy oferta bo‘lib, sotuvchi va xaridor o‘rtasidagi huquqiy munosabatlarni tartibga soladi.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Umumiy qoidalar</h3>
                                <p>
                                    Sayt orqali buyurtma berish xaridor tomonidan ushbu shartlarning to‘liq qabul qilinganini anglatadi.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Sotuvchi haqida ma’lumot</h3>
                                <p>
                                    Sotuvchi: YaTT Usmonov Mirobid Mirasror o‘g‘li<br />
                                    Faoliyat shakli: Yakka tartibdagi tadbirkor
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Mahsulotlar</h3>
                                <p>
                                    Saytda turli xil jismoniy tovarlar sotiladi.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Buyurtma berish tartibi</h3>
                                <p>
                                    Buyurtmalar faqat sayt orqali qabul qilinadi. Xaridor buyurtma berishda kiritgan ma’lumotlarining to‘g‘riligiga shaxsan javobgardir.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. To‘lov usullari</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Naqd pul</li>
                                    <li>Bank kartalari</li>
                                    <li>Uzum Bank orqali to‘lov</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">6. Javobgarlikni cheklash</h3>
                                <p>
                                    Sotuvchi foydalanuvchiga bog‘liq bo‘lmagan texnik nosozliklar yoki uchinchi shaxslar faoliyati oqibatida yuzaga kelgan zararlarga javobgar emas.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">7. Nizolarni hal etish</h3>
                                <p>
                                    Barcha nizolar O‘zbekiston Respublikasi qonunchiligi asosida hal etiladi.
                                </p>
                            </>
                        ) : (
                            <>
                                <p>
                                    Настоящий документ является официальным предложением (публичной офертой) сайта <strong>present-box.uz</strong> и регулирует отношения между Продавцом и Покупателем.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Общие положения</h3>
                                <p>
                                    Оформление заказа на Сайте означает полное и безоговорочное принятие Покупателем условий настоящего Соглашения.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Информация о продавце</h3>
                                <p>
                                    Продавец: ИП Усмонов Миробид Мирасрор угли<br />
                                    Форма деятельности: индивидуальный предприниматель
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Товары</h3>
                                <p>
                                    На Сайте представлены различные физические товары.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Порядок оформления заказа</h3>
                                <p>
                                    Заказы принимаются исключительно через Сайт. Покупатель несёт ответственность за достоверность предоставленных данных.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. Способы оплаты</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Наличный расчёт</li>
                                    <li>Банковские карты</li>
                                    <li>Uzum Bank</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">6. Ограничение ответственности</h3>
                                <p>
                                    Продавец не несёт ответственности за убытки, возникшие вследствие технических сбоев, действий третьих лиц или иных обстоятельств, не зависящих от Продавца.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">7. Разрешение споров</h3>
                                <p>
                                    Все споры и разногласия подлежат разрешению в соответствии с законодательством Республики Узбекистан.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
