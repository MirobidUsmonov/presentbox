"use client";

import { useLanguage } from "@/components/language-provider";
import { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const [permissions, setPermissions] = useState<any>(null);
    const [roleName, setRoleName] = useState("");
    const pathname = usePathname();
    const { t } = useLanguage();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate normalized position
            const x = (e.clientX - window.innerWidth / 2) / 20;
            const y = (e.clientY - window.innerHeight / 2) / 20;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = localStorage.getItem("admin_auth") === "true" || sessionStorage.getItem("admin_auth") === "true";

            if (!isAuth) {
                window.location.href = "/kirsaboladi";
                return;
            }

            // Load user and permissions
            try {
                const userStr = localStorage.getItem("admin_user") || sessionStorage.getItem("admin_user");
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    setUser(userData);

                    // Fetch roles to get permissions
                    const res = await fetch('/api/roles');
                    if (res.ok) {
                        const roles = await res.json();
                        const userRole = roles.find((r: any) => r.id === userData.roleId);
                        if (userRole) {
                            setPermissions(userRole.permissions);
                            setRoleName(userRole.name);
                        }
                    }
                } else {
                    // FALLBACK: Legacy session = Super Admin
                    const res = await fetch('/api/roles');
                    if (res.ok) {
                        const roles = await res.json();
                        const superAdminRole = roles.find((r: any) => r.id === 1);
                        if (superAdminRole) {
                            setPermissions(superAdminRole.permissions);
                            setRoleName(superAdminRole.name);
                            setUser({ username: "presentbox", fullName: "Super Admin" });
                        }
                    }
                }

                // Security override removed for production safety
            } catch (e) {
                console.error("Error loading permissions", e);
            }

            setAuthorized(true);
        };

        checkAuth();
    }, [pathname]);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_user");
        sessionStorage.removeItem("admin_auth");
        sessionStorage.removeItem("admin_user");
        window.location.href = "/kirsaboladi";
    };

    if (authorized === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">{((t as any)?.admin?.loading) || "Yuklanmoqda..."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="pt-8 px-10 pb-6 flex items-center justify-between">
                    <Link href="/" className="block">
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                            PRESENT<span className="text-brand-orange">BOX</span>
                        </h1>
                        <p className="text-[10px] text-brand-orange font-black uppercase tracking-[0.2em] mt-2 ml-0.5">{((t as any)?.admin?.admin_panel) || "Admin Panel"}</p>
                    </Link>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-8 scrollbar-hide">
                    {/* Dashboard is always visible */}
                    <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label={((t as any)?.admin?.dashboard) || "Dashboard"} active={pathname === "/admin"} />

                    {/* Products Section */}
                    {permissions?.products_view && (
                        <>
                            <div className="pt-6 pb-2 px-4">
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{((t as any)?.admin?.products) || "Mahsulotlar"}</p>
                            </div>
                            <NavItem href="/admin/products" icon={<Package size={20} />} label={((t as any)?.admin?.all_products) || "Barcha mahsulotlar"} active={pathname === "/admin/products"} />
                        </>
                    )}

                    {/* Categories Section */}
                    {permissions?.categories_view && (
                        <>
                            <div className="pt-6 pb-2 px-4">
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{((t as any)?.admin?.categories) || "Kategoriyalar"}</p>
                            </div>
                            <div className="space-y-1">
                                <CategoryItem href="/admin/categories/uzum" color="bg-brand-orange shadow-brand-orange/20" label={((t as any)?.admin?.uzum) || "Uzum Market"} active={pathname === "/admin/categories/uzum"} />
                                <Link
                                    href="/admin/categories/uzum/unit-economics"
                                    className={`flex items-center gap-3 px-10 py-2 rounded-2xl transition-all duration-300 font-bold text-xs ${pathname === "/admin/categories/uzum/unit-economics"
                                        ? 'text-brand-orange'
                                        : 'text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
                                >
                                    <ChevronRight size={14} />
                                    <span>Unit Economics</span>
                                </Link>
                                <CategoryItem href="/admin/categories/yandex" color="bg-yellow-400 shadow-yellow-400/20" label={((t as any)?.admin?.yandex) || "Yandex"} active={pathname === "/admin/categories/yandex"} />
                                <CategoryItem href="/admin/categories/china" color="bg-red-500 shadow-red-500/20" label={((t as any)?.admin?.china) || "Xitoy"} active={pathname === "/admin/categories/china"} />
                                <CategoryItem href="/admin/categories/direct" color="bg-blue-500 shadow-blue-500/20" label={((t as any)?.admin?.direct) || "To'g'ridan-to'g'ri"} active={pathname === "/admin/categories/direct"} />
                            </div>
                        </>
                    )}

                    {/* Management Section */}
                    {(permissions?.orders_view || permissions?.customers_view || permissions?.settings_view) && (
                        <div className="pt-6 pb-2 px-4">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{((t as any)?.admin?.management) || "Boshqaruv"}</p>
                        </div>
                    )}

                    {permissions?.orders_view && (
                        <NavItem href="/admin/orders" icon={<ShoppingBag size={20} />} label={((t as any)?.admin?.orders) || "Buyurtmalar"} active={pathname === "/admin/orders"} />
                    )}

                    {permissions?.customers_view && (
                        <NavItem href="/admin/customers" icon={<Users size={20} />} label={((t as any)?.admin?.customers) || "Mijozlar"} active={pathname === "/admin/customers"} />
                    )}

                    {permissions?.settings_view && (
                        <NavItem href="/admin/settings" icon={<Settings size={20} />} label={((t as any)?.admin?.settings) || "Sozlamalar"} active={pathname === "/admin/settings"} />
                    )}
                </nav>

                <div className="p-6 mt-auto border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all duration-300 font-bold group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        {((t as any)?.admin?.logout) || "Chiqish"}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-0 lg:ml-72 relative overflow-hidden bg-white dark:bg-[#0a0a0a] transition-[margin] duration-300">

                {/* Animated Ripple Background */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes drift {
                            0% { transform: translateX(-100px); }
                            100% { transform: translateX(100vw); }
                        }
                        .animate-drift {
                            animation: drift 60s linear infinite;
                        }
                        .animate-drift-slow {
                            animation: drift 80s linear infinite;
                        }
                        .animate-drift-slower {
                            animation: drift 100s linear infinite;
                        }
                    `}} />

                    {/* Top Left - Orange */}
                    <div
                        className="absolute -top-10 -left-10 animate-drift-slow opacity-20 dark:opacity-30"
                        style={{ top: '10%' }}
                    >
                        <div style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}>
                            <Ripple color="text-orange-500" size={400} />
                        </div>
                    </div>

                    {/* Top Right - Cyan */}
                    <div
                        className="absolute top-20 right-10 animate-drift opacity-20 dark:opacity-30"
                        style={{ top: '20%' }}
                    >
                        <div style={{ transform: `translate(${mousePosition.x * -0.4}px, ${mousePosition.y * 0.4}px)` }}>
                            <Ripple color="text-cyan-500" size={300} />
                        </div>
                    </div>

                    {/* Bottom Left - Green */}
                    <div
                        className="absolute bottom-20 left-20 animate-drift-slower opacity-20 dark:opacity-30"
                        style={{ top: '60%' }}
                    >
                        <div style={{ transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * -0.3}px)` }}>
                            <Ripple color="text-green-500" size={350} />
                        </div>
                    </div>

                    {/* Bottom Right - Purple */}
                    <div
                        className="absolute -bottom-20 -right-20 animate-drift-slow opacity-20 dark:opacity-30"
                        style={{ top: '80%' }}
                    >
                        <div style={{ transform: `translate(${mousePosition.x * -0.6}px, ${mousePosition.y * -0.6}px)` }}>
                            <Ripple color="text-purple-500" size={500} />
                        </div>
                    </div>

                    {/* Center/Random - Red */}
                    <div
                        className="absolute top-1/2 left-1/2 animate-drift-slower opacity-10 dark:opacity-20"
                        style={{ top: '40%' }}
                    >
                        <div style={{ transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)` }}>
                            <Ripple color="text-red-500" size={600} />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 h-full flex flex-col">
                    <header className="h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 gap-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                        {/* Hamburger Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="flex items-center gap-4 ml-auto">
                            <LanguageSwitcher />
                            <ThemeToggle />
                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2" />

                            <div className="relative group">
                                <button className="flex items-center gap-3 pl-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{user?.username || "Admin"}</p>
                                        <p className="text-sm text-gray-400 font-medium tracking-wider uppercase">{roleName || ((t as any)?.admin?.super_admin) || "Admin"}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-orange/20">
                                        {(user?.fullName?.charAt(0) || user?.username?.charAt(0) || "A").toUpperCase()}
                                    </div>
                                </button>

                                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                                    {permissions?.settings_view && (
                                        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors">
                                            <Settings size={18} />
                                            {((t as any)?.admin?.manage_account) || "Akkauntni boshqarish"}
                                        </Link>
                                    )}
                                    <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors">
                                        <LayoutDashboard size={18} />
                                        {((t as any)?.admin?.go_to_site) || "Sahifaga o'tish"}
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors mt-1">
                                        <LogOut size={18} />
                                        {((t as any)?.admin?.logout_system) || "Tizimdan chiqish"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold ${active
                ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/20 translate-x-1'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
        >
            <div className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'}>
                {icon}
            </div>
            {label}
        </Link>
    );
}

function CategoryItem({ href, color, label, active = false }: { href: string; color: string; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold group ${active
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
        >
            <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${color} ${active ? 'scale-125' : 'group-hover:scale-110'} transition-transform`} />
            <span className="text-sm">{label}</span>
        </Link>
    );
}

function Ripple({ color, size }: { color: string; size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={color} style={{ overflow: 'visible' }}>
            {[...Array(8)].map((_, i) => (
                <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r={10 + i * 5}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="opacity-50"
                />
            ))}
        </svg>
    );
}
