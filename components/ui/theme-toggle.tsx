"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-16 h-8" />; // Placeholder to avoid layout shift
    }

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={`relative w-16 h-8 rounded-full transition-colors duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] focus:outline-none shadow-inner ${resolvedTheme === "dark" ? "bg-[#0f172a]" : "bg-sky-200"
                }`}
            aria-label="Toggle Theme"
        >
            {/* Track Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
                {/* Clouds (Light Mode) */}
                <div className={`absolute top-1 right-2 w-4 h-2 bg-white rounded-full opacity-80 transition-all duration-500 ${resolvedTheme === 'dark' ? 'translate-y-10' : 'translate-y-0'}`}></div>
                <div className={`absolute bottom-1 right-5 w-5 h-2 bg-white rounded-full opacity-60 transition-all duration-500 delay-75 ${resolvedTheme === 'dark' ? 'translate-y-10' : 'translate-y-0'}`}></div>

                {/* Stars (Dark Mode) */}
                <div className={`absolute top-2 left-3 w-0.5 h-0.5 bg-white rounded-full transition-all duration-500 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute bottom-2 left-6 w-1 h-1 bg-white rounded-full transition-all duration-500 delay-75 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute top-3 left-8 w-0.5 h-0.5 bg-white rounded-full transition-all duration-500 delay-150 ${resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>

            {/* Sliding Circle */}
            <div
                className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center ${resolvedTheme === "dark"
                    ? "translate-x-8 bg-gray-100" // Moon
                    : "translate-x-0 bg-yellow-400" // Sun
                    }`}
            >
                {resolvedTheme === 'dark' && (
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full opacity-50 -translate-x-0.5 -translate-y-0.5"></div>
                )}
            </div>
        </button>
    );
}
