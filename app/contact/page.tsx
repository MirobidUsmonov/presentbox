
"use client";

import { useLanguage } from "@/components/language-provider";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Clock, MapPin, Instagram, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const { language } = useLanguage();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
            <div className="container mx-auto max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-orange mb-8 font-bold transition-all hover:-translate-x-1 group">
                    <ArrowLeft size={20} className="group-hover:scale-110" />
                    {language === 'uz' ? "Bosh sahifaga qaytish" : "Вернуться на главную"}
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        {language === 'uz' ? "KONTAKTLAR" : "КОНТАКТЫ"}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-brand-orange shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                        {language === 'uz' ? "Telefon" : "Телефон"}
                                    </h3>
                                    <a href="tel:+998770454547" className="text-lg text-gray-600 dark:text-gray-300 hover:text-brand-orange transition-colors">
                                        +998 77 045 45 47
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-brand-orange shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email</h3>
                                    <a href="mailto:usmonovm007@gmail.com" className="text-lg text-gray-600 dark:text-gray-300 hover:text-brand-orange transition-colors">
                                        usmonovm007@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-brand-orange shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                        {language === 'uz' ? "Ish vaqti" : "Время работы"}
                                    </h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-300">
                                        10:00 – 18:00
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-brand-orange shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                        {language === 'uz' ? "Manzil" : "Адрес"}
                                    </h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {language === 'uz' ? "Toshkent shahar, Shayxontoxur tumani, Abdulla Qodiriy ko‘chasi 10A" : "г. Ташкент, Шайхонтохурский район, ул. Абдуллы Кадыри, 10A"}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <a
                                    href="https://instagram.com/presentbox_uz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-all font-bold"
                                >
                                    <Instagram size={20} />
                                    <span>Instagram</span>
                                </a>
                                <a
                                    href="https://t.me/presentboxuz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all font-bold"
                                >
                                    <MessageCircle size={20} />
                                    <span>Telegram</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
