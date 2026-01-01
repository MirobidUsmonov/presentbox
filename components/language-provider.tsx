"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/lib/translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations['uz'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('uz');
    const [mergedTranslations, setMergedTranslations] = useState(translations);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Failed to fetch');
                const allProducts = await res.json();

                // Filter out products with 0 stock for the public site
                const products = allProducts.filter((p: any) => (p.stockQuantity || 0) > 0);

                // Map unified products to language-specific structure
                const mapToLang = (p: any, lang: Language) => {
                    const localized = p[lang] || { title: "", description: "", characteristics: [] };
                    return {
                        ...p,
                        ...localized,
                        fullDescription: localized.description,
                        variants: p.variants?.map((v: any) => ({
                            color: lang === 'uz' ? v.colorUz : v.colorRu,
                            images: v.images
                        }))
                    };
                };

                const uzItems = products.map((p: any) => mapToLang(p, 'uz'));
                const ruItems = products.map((p: any) => mapToLang(p, 'ru'));

                const newTranslations = {
                    uz: { ...translations.uz, items: uzItems },
                    ru: { ...translations.ru, items: ruItems }
                };
                setMergedTranslations(newTranslations as any);
            } catch (e) {
                console.error("Error fetching products:", e);
            }
        };

        fetchProducts();
    }, []);

    const value = {
        language,
        setLanguage,
        t: mergedTranslations[language],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
