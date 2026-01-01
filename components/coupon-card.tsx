"use client";

import { useLanguage } from "@/components/language-provider";
import { useState } from "react";
import { RotateCw, Gift } from "lucide-react";

export function CouponCard() {
    const { t } = useLanguage();
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="w-full max-w-md aspect-[1.8/1] cursor-pointer perspective-1000 group/card"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                    <div
                        className="w-full h-full bg-gradient-to-br from-brand-orange to-brand-coral shadow-2xl flex flex-col items-center justify-center text-white p-8 relative overflow-hidden"
                        style={{
                            maskImage: 'radial-gradient(circle at 10px 50%, transparent 15px, black 16px), radial-gradient(circle at right 10px top 50%, transparent 15px, black 16px)',
                            maskComposite: 'exclude',
                            WebkitMaskImage: 'radial-gradient(circle at 0px 50%, transparent 20px, black 21px), radial-gradient(circle at 100% 50%, transparent 20px, black 21px)',
                            WebkitMaskComposite: 'destination-in',
                        }}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-3xl"></div>

                        {/* Dashed Border Effect (Inset) */}
                        <div className="absolute inset-4 border-2 border-dashed border-white/30 rounded-lg"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm shadow-inner group-hover/card:scale-110 transition-transform duration-300">
                                <Gift size={40} className="text-white" />
                            </div>

                            <h3 className="text-xl font-bold uppercase tracking-wider mb-2 text-white/90">
                                {t.hero.coupon.front_subtitle}
                            </h3>
                            <h2 className="text-4xl font-black mb-6 drop-shadow-md">
                                {t.hero.coupon.front_title}
                            </h2>

                            <div className="flex items-center gap-2 text-sm font-medium bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md hover:bg-white/30 transition-colors animate-pulse">
                                <RotateCw size={18} className="animate-spin-slow" />
                                {t.hero.coupon.front_action}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div
                        className="w-full h-full bg-white dark:bg-gray-800 shadow-2xl border-4 border-brand-orange flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
                        style={{
                            maskImage: 'radial-gradient(circle at 0px 50%, transparent 20px, black 21px), radial-gradient(circle at 100% 50%, transparent 20px, black 21px)',
                            maskComposite: 'intersect',
                            WebkitMaskImage: 'radial-gradient(circle at 0px 50%, transparent 20px, black 21px), radial-gradient(circle at 100% 50%, transparent 20px, black 21px)',
                            WebkitMaskComposite: 'destination-in',
                        }}
                    >
                        <h3 className="text-brand-orange font-black text-5xl mb-3 tracking-tight drop-shadow-sm whitespace-nowrap">
                            7,000 - 77,000
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 font-medium text-sm leading-relaxed max-w-[90%] text-balance relative z-10">
                            {t.hero.coupon.back_text}
                        </p>


                    </div>
                </div>
            </div>
        </div>
    );
}
