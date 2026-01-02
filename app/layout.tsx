import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
    title: "PresentBox - Sifat va Ishonch",
    description: "Minglab xaridorlarning to'g'ri tanlovi. Sifatli gadjetlar va sovg'alar.",
};

import { LanguageProvider } from "@/components/language-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutWrapper } from "@/components/layout-wrapper";

import Script from "next/script";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uz" suppressHydrationWarning>
            <head>
                <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
            </head>
            <body className={montserrat.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <LanguageProvider>
                        <LayoutWrapper>
                            {children}
                        </LayoutWrapper>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
