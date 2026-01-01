"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, TrendingUp, Users, Package } from "lucide-react";
import { Order } from "@/lib/orders";
import { useLanguage } from "@/components/language-provider";

interface CustomerStats {
    phone: string;
    fullName: string;
    totalOrders: number;
    deliveredOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    region: string;
    district: string;
}

export default function CustomersPage() {
    const { t, language } = useLanguage();
    const adminT = (t as any).admin;
    const custT = adminT?.customers_page;

    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<CustomerStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'all' | 'most_spent' | 'most_frequent'>('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data: Order[] = await res.json();
                setOrders(data);
                processCustomers(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const processCustomers = (data: Order[]) => {
        const customerMap = new Map<string, CustomerStats>();

        data.forEach(order => {
            const phone = order.customer.phone;
            const existing = customerMap.get(phone);

            if (existing) {
                existing.totalOrders += 1;
                if (order.status === 'delivered') existing.deliveredOrders += 1;
                existing.totalSpent += order.totalPrice;
                if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
                    existing.lastOrderDate = order.createdAt;
                }
            } else {
                customerMap.set(phone, {
                    phone,
                    fullName: `${order.customer.firstName} ${order.customer.lastName}`,
                    totalOrders: 1,
                    deliveredOrders: order.status === 'delivered' ? 1 : 0,
                    totalSpent: order.totalPrice,
                    lastOrderDate: order.createdAt,
                    region: order.customer.region,
                    district: order.customer.district
                });
            }
        });

        setCustomers(Array.from(customerMap.values()));
    };

    const filteredCustomers = customers
        .filter(c =>
            c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm)
        )
        .sort((a, b) => {
            if (filter === 'most_spent') return b.totalSpent - a.totalSpent;
            if (filter === 'most_frequent') return b.totalOrders - a.totalOrders;
            return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
        });

    const deliveredCustomersCount = customers.filter(c => c.deliveredOrders > 0).length;
    const newCustomersCount = customers.filter(c => c.deliveredOrders === 0).length; // Customers with no delivered orders yet

    // Group by region for Map
    const regionStats = customers.reduce((acc, curr) => {
        acc[curr.region] = (acc[curr.region] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{custT?.title || "Mijozlar"}</h1>
                <p className="text-gray-500 font-medium">{custT?.description || "Doimiy va yangi mijozlar tahlili"}</p>
            </header>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400">{custT?.stats?.total || "Jami mijozlar"}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{customers.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400">{custT?.stats?.delivered || "Topshirilgan mijozlar"}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{deliveredCustomersCount}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl flex items-center justify-center">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400">{custT?.stats?.new || "Yangi mijozlar"}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{newCustomersCount}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Map Section (Placeholder for now, can be expanded with SVG) */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <MapPin className="text-brand-orange" />
                        {custT?.regions || "Hududlar bo'yicha"}
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(regionStats)
                            .sort(([, a], [, b]) => b - a)
                            .map(([region, count]) => (
                                <div key={region} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-xl transition-colors">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">{region}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-brand-orange rounded-full"
                                                style={{ width: `${(count / customers.length) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-black text-gray-900 dark:text-white w-8 text-right">{count}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Customers Table */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{custT?.list_title || "Mijozlar ro'yxati"}</h3>
                        <div className="flex gap-2">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl font-bold text-sm outline-none"
                            >
                                <option value="all">{custT?.filters?.all || "Barchasi"}</option>
                                <option value="most_spent">{custT?.filters?.most_spent || "Ko'p xarid qilgan"}</option>
                                <option value="most_frequent">{custT?.filters?.most_frequent || "Ko'p buyurtma bergan"}</option>
                            </select>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={custT?.search_placeholder || "Qidirish..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl font-bold text-sm outline-none w-full sm:w-64"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/30">
                                <tr>
                                    <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">{custT?.table?.customer || "Mijoz"}</th>
                                    <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider text-center">{custT?.table?.orders || "Buyurtmalar"}</th>
                                    <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider text-center">{custT?.table?.delivered || "Topshirilgan"}</th>
                                    <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider text-right">{custT?.table?.total_spent || "Jami summa"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-400 animate-pulse">{adminT?.loading || "Yuklanmoqda..."}</td>
                                    </tr>
                                ) : filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users size={40} className="opacity-20" />
                                                <p>{adminT?.status?.no_products || "Mijozlar topilmadi"}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                            <td className="p-6">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{customer.fullName}</p>
                                                    <p className="text-xs text-gray-400 font-mono mt-0.5">{customer.phone}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">{customer.region}, {customer.district}</p>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className="font-bold text-gray-900 dark:text-white">{customer.totalOrders}</span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${customer.deliveredOrders > 0
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                    {customer.deliveredOrders}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right font-mono font-bold text-gray-900 dark:text-white">
                                                {customer.totalSpent.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">{adminT?.currency || "so'm"}</span>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
