"use client";

import { useState } from "react";
import { Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        login: "",
        password: "",
        remember: false
    });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: formData.login, password: formData.password })
            });

            const data = await res.json();

            if (res.ok) {
                const storage = formData.remember ? localStorage : sessionStorage;
                storage.setItem("admin_auth", "true");
                storage.setItem("admin_user", JSON.stringify(data.user));
                window.location.href = "/admin";
            } else {
                setError(data.error || "Login yoki parol noto'g'ri!");
            }
        } catch (err) {
            setError("Tizim xatoligi yuz berdi");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-coral/30 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md z-10">
                {/* Brand Logo / Title */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20 group-hover:scale-110 transition-transform duration-300">
                                <Lock className="text-white" size={24} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                            PRESENT<span className="text-brand-orange">BOX</span> <span className="text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg ml-1">ADMIN</span>
                        </h1>
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Boshqaruv paneliga xush kelibsiz
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-2xl shadow-gray-200/50 dark:shadow-none relative group overflow-hidden">
                    {/* Top border highlight */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                                Kirish (Login)
                            </label>
                            <div className="relative group/field">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-brand-orange transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.login}
                                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                                    placeholder="Username yoki Email"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange dark:focus:border-brand-orange transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Mahfiy so'z
                                </label>
                                <button type="button" className="text-xs font-bold text-brand-orange hover:text-brand-coral transition-colors">
                                    Unutdingizmi?
                                </button>
                            </div>
                            <div className="relative group/field">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-brand-orange transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange dark:focus:border-brand-orange transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-1">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={formData.remember}
                                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange transition-colors cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                                Meni eslab qol
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-brand-orange hover:bg-brand-coral disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Kirilmoqda...
                                </>
                            ) : (
                                "Tizimga kirish"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <div className="text-center mt-8">
                    <Link href="/" className="text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft size={16} />
                        Asosiy sahifaga qaytish
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ArrowLeft({ size }: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    );
}
