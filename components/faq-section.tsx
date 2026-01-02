"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function FaqSection() {
    const { t, language } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!t.faq) return null;

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 scroll-mt-24" id="faq">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-10">
                    <span className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
                        FAQ
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {language === 'uz' ? "Ko'p so'raladigan savollar" : "Часто задаваемые вопросы"}
                    </h2>
                </div>

                <div className="space-y-4">
                    {t.faq.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between p-5 text-left group"
                            >
                                <span className="font-bold text-gray-900 dark:text-white pr-4 group-hover:text-brand-orange transition-colors">
                                    {item.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-brand-orange shrink-0" size={20} />
                                ) : (
                                    <ChevronDown className="text-gray-400 shrink-0 group-hover:text-brand-orange transition-colors" size={20} />
                                )}
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 p-5 pt-0' : 'grid-rows-[0fr] opacity-0 p-0'
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
