"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-6">
                    PresentBox
                </h2>
                <div className="mb-8">
                    <Link
                        href="#"
                        className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-brand-orange/30 hover:bg-brand-coral transition-all hover:-translate-y-1"
                    >
                        {t.footer.support_btn}
                    </Link>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t.footer.rights}
                </p>
            </div>
        </footer>
    );
}
