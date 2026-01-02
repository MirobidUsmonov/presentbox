
"use client";

import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                        {language === 'uz' ? "MAXFIYLIK SIYOSATI" : "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ"}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                        {language === 'uz' ? (
                            <>
                                <p>
                                    Ushbu Maxfiylik siyosati <strong>present-box.uz</strong> (keyingi o‘rinlarda — “Sayt”) orqali foydalanuvchilardan olinadigan shaxsiy ma’lumotlarni yig‘ish, saqlash va ulardan foydalanish tartibini belgilaydi.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Umumiy qoidalar</h3>
                                <p>
                                    Sayt egasi va ma’lumotlar operatori — YaTT Usmonov Mirobid Mirasror o‘g‘li, O‘zbekiston Respublikasi hududida faoliyat yuritadi. Saytdan foydalanish orqali foydalanuvchi ushbu Maxfiylik siyosati shartlariga rozilik bildiradi.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Yig‘iladigan shaxsiy ma’lumotlar</h3>
                                <p>Sayt quyidagi shaxsiy ma’lumotlarni yig‘ishi mumkin:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Ism va familiya</li>
                                    <li>Telefon raqami</li>
                                    <li>Yetkazib berish manzili</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Shaxsiy ma’lumotlardan foydalanish maqsadi</h3>
                                <p>Yig‘ilgan ma’lumotlar quyidagi maqsadlarda ishlatiladi:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Buyurtmalarni qabul qilish va bajarish</li>
                                    <li>Foydalanuvchi bilan aloqa o‘rnatish</li>
                                    <li>Marketing va axborot xabarnomalarini yuborish</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Uchinchi shaxslarga uzatish</h3>
                                <p>Foydalanuvchining shaxsiy ma’lumotlari faqat quyidagi holatlarda uchinchi shaxslarga uzatilishi mumkin:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>To‘lov tizimlari</li>
                                    <li>Yetkazib berish (kuryer) xizmatlari</li>
                                </ul>
                                <p>Boshqa holatlarda ma’lumotlar uchinchi shaxslarga berilmaydi.</p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. Ma’lumotlarni himoyalash</h3>
                                <p>
                                    Sayt foydalanuvchilarning shaxsiy ma’lumotlarini ruxsatsiz kirish, yo‘qotish yoki o‘zgartirishdan himoyalash uchun zarur tashkiliy va texnik choralarni ko‘radi.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">6. Aloqa ma’lumotlari</h3>
                                <p>Maxfiylik siyosati bo‘yicha savollar uchun:</p>
                            </>
                        ) : (
                            <>
                                <p>
                                    Настоящая Политика конфиденциальности определяет порядок сбора, хранения и использования персональных данных пользователей сайта <strong>present-box.uz</strong> (далее — «Сайт»).
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Общие положения</h3>
                                <p>
                                    Владельцем и оператором персональных данных является ИП Усмонов Миробид Мирасрор угли, осуществляющий деятельность на территории Республики Узбекистан. Используя Сайт, пользователь выражает согласие с условиями настоящей Политики конфиденциальности.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Персональные данные</h3>
                                <p>Сайт может собирать следующие персональные данные:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Имя и фамилия</li>
                                    <li>Номер телефона</li>
                                    <li>Адрес доставки</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Цели обработки персональных данных</h3>
                                <p>Персональные данные пользователей используются для:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Приёма и обработки заказов</li>
                                    <li>Связи с пользователем</li>
                                    <li>Маркетинговых и информационных рассылок</li>
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Передача данных третьим лицам</h3>
                                <p>Персональные данные могут передаваться третьим лицам исключительно в следующих случаях:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Платёжным системам</li>
                                    <li>Курьерским и логистическим службам</li>
                                </ul>
                                <p>В иных случаях передача персональных данных третьим лицам не осуществляется.</p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">5. Защита персональных данных</h3>
                                <p>
                                    Администрация Сайта принимает необходимые организационные и технические меры для защиты персональных данных от несанкционированного доступа, утраты или изменения.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">6. Контактная информация</h3>
                                <p>По вопросам, связанным с обработкой персональных данных, вы можете связаться с нами:</p>
                            </>
                        )}
                        <p>
                            📧 Email: <a href="mailto:usmonovm007@gmail.com" className="text-blue-600 hover:underline">usmonovm007@gmail.com</a><br />
                            📞 Telefon: <a href="tel:+998770454547" className="text-blue-600 hover:underline">+998 77 045 45 47</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
