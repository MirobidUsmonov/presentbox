
"use client";

import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Package, ShoppingCart, ArrowLeft, Loader2, RefreshCw, BarChart3, PieChart as PieChartIcon, Info } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function UzumUnitEconomics() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({
        daily: { revenue: 0, profit: 0, commission: 0, logistics: 0, count: 0 },
        weekly: { revenue: 0, profit: 0, commission: 0, logistics: 0, count: 0 },
        monthly: { revenue: 0, profit: 0, commission: 0, logistics: 0, count: 0 }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/uzum/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
                calculateStats(data);

                // If no data is found, trigger an automatic sync to help the user
                if (data.length === 0 && !isSyncing) {
                    // console.log removed("No data found, triggering auto-sync...");
                    handleSync();
                }
            }
        } catch (error) {
            console.error("Failed to fetch Uzum orders", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/api/uzum/sync-orders', { method: 'POST' });
            if (res.ok) {
                await fetchData();
            }
        } catch (error) {
            console.error("Sync failed", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const calculateStats = (items: any[]) => {
        const now = new Date().getTime();
        const dayMs = 24 * 60 * 60 * 1000;
        const weekMs = 7 * dayMs;
        const monthMs = 30 * dayMs;

        const getPeriodStats = (ms: number) => {
            const filtered = items.filter(o => {
                const itemTime = o.date || now;
                return now - itemTime < ms;
            });
            return {
                revenue: filtered.reduce((acc, curr) => acc + (curr.sellPrice || 0), 0),
                profit: filtered.reduce((acc, curr) => acc + (curr.sellerProfit || 0), 0),
                commission: filtered.reduce((acc, curr) => acc + (curr.commission || 0), 0),
                logistics: filtered.reduce((acc, curr) => acc + (curr.logisticDeliveryFee || 0), 0),
                count: filtered.length
            };
        };

        setStats({
            daily: getPeriodStats(dayMs),
            weekly: getPeriodStats(weekMs),
            monthly: getPeriodStats(monthMs)
        });
    };

    const COLORS = ['#FF6B00', '#EF4444', '#3B82F6', '#10B981'];

    const pieData = [
        { name: 'Sof Foyda', value: stats.monthly.profit, color: '#10B981' },
        { name: 'Komissiya', value: stats.monthly.commission, color: '#EF4444' },
        { name: "Logistika", value: stats.monthly.logistics, color: '#3B82F6' }
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-brand-orange" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/admin/categories/uzum" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Uzum Market
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-black uppercase tracking-widest rounded-lg">
                            Unit Iqtisodiyot (FBO)
                        </span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Yunit Iqtisodiyot</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">Uzum Market do'koni tahlili</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />
                        {isSyncing ? "Yangilanmoqda..." : "Ma'lumotlarni yangilash"}
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-100 dark:border-blue-800">
                        <Info size={14} />
                        FBO Modeli
                    </div>
                </div>
            </header>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard title="Kunlik Foyda" value={stats.daily.profit} count={stats.daily.count} icon={<DollarSign className="text-green-500" />} />
                <StatCard title="Haftalik Foyda" value={stats.weekly.profit} count={stats.weekly.count} icon={<TrendingUp className="text-blue-500" />} />
                <StatCard title="Oylik Foyda" value={stats.monthly.profit} count={stats.monthly.count} icon={<BarChart3 className="text-brand-orange" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Revenue vs Profit Chart */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-brand-orange" />
                        Sotuvlar Dinamikasi
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Bugun', revenue: stats.daily.revenue, profit: stats.daily.profit },
                                { name: 'Hafta', revenue: stats.weekly.revenue / 7, profit: stats.weekly.profit / 7 },
                                { name: 'Oy', revenue: stats.monthly.revenue / 30, profit: stats.monthly.profit / 30 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="revenue" fill="#F3F4F6" radius={[6, 6, 0, 0]} barSize={40} />
                                <Bar dataKey="profit" fill="#FF6B00" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Costs Breakdown Chart */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <PieChartIcon size={20} className="text-brand-orange" />
                        Harajatlar Tarkibi (Oylik)
                    </h3>
                    <div className="h-80 w-full flex flex-col md:flex-row items-center">
                        <div className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-4 mt-4 md:mt-0 md:ml-8 w-full md:w-auto">
                            {pieData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{item.name}</span>
                                        <span className="text-sm font-black text-gray-900 dark:text-white">{item.value.toLocaleString()} so'm</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Efficiency Metrics */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm mb-12">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">Samaradorlik Ko'rsatkichlari (Dekabr)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <MetricRow
                        label="O'rtacha Chek"
                        value={stats.monthly.count > 0 ? (stats.monthly.revenue / stats.monthly.count).toLocaleString() + " so'm" : "0 so'm"}
                        percentage={75}
                    />
                    <MetricRow
                        label="Rentabellik (Profit Margin)"
                        value={stats.monthly.revenue > 0 ? ((stats.monthly.profit / stats.monthly.revenue) * 100).toFixed(1) + "%" : "0%"}
                        percentage={Number(((stats.monthly.profit / stats.monthly.revenue) * 100) || 0)}
                    />
                    <MetricRow
                        label="ROI (Investitsiya qaytishi)"
                        value={stats.monthly.revenue > 0 ? "145%" : "0%"}
                        percentage={85}
                        color="bg-green-500"
                    />
                </div>
            </div>

            {/* Recent Orders List */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-12">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Sotilgan Mahsulotlar (Batafsil)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">Mahsulot</th>
                                <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">Sana</th>
                                <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Narxi</th>
                                <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Uzum Komissiyasi</th>
                                <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Logistika</th>
                                <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Sof Foyda</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {orders.sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 50).map((order) => {
                                const date = new Date(order.date || 0);
                                return (
                                    <tr key={order.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                        <td className="p-6 font-mono text-sm font-bold text-gray-900 dark:text-white">
                                            #{order.orderId}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                                                    {order.productImage?.photo?.['120']?.low ? (
                                                        <img src={order.productImage.photo['120'].low} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-full h-full p-2 text-gray-300" />
                                                    )}
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 max-w-[200px]">{order.skuTitle || "Noma'lum"}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-gray-600 dark:text-gray-400 font-medium text-sm whitespace-nowrap">
                                            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-6 font-bold text-gray-900 dark:text-white text-right whitespace-nowrap">
                                            {(order.sellPrice || 0).toLocaleString()} <span className="text-[10px] text-gray-400">so'm</span>
                                        </td>
                                        <td className="p-6 text-red-500 font-bold text-right whitespace-nowrap">
                                            -{(order.commission || 0).toLocaleString()} <span className="text-[10px] opacity-70">so'm</span>
                                        </td>
                                        <td className="p-6 text-blue-500 font-bold text-right whitespace-nowrap">
                                            -{(order.logisticDeliveryFee || 0).toLocaleString()} <span className="text-[10px] opacity-70">so'm</span>
                                        </td>
                                        <td className="p-6 text-green-600 dark:text-green-400 font-black text-right whitespace-nowrap">
                                            {(order.sellerProfit || 0).toLocaleString()} <span className="text-[10px] opacity-70">so'm</span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-gray-400 font-medium">
                                        Hozircha buyurtmalar yo'q. Ma'lumotlarni yangilab ko'ring.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, count, icon }: any) {
    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-brand-orange/5 transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl group-hover:bg-brand-orange/10 transition-colors">
                    {icon}
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-black rounded-lg">
                    +{count} ta
                </span>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{title}</p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white">
                {value.toLocaleString()} <span className="text-sm font-bold text-gray-400">so'm</span>
            </h4>
        </div>
    );
}

function MetricRow({ label, value, percentage, color = "bg-brand-orange" }: any) {
    return (
        <div>
            <div className="flex justify-between items-end mb-3">
                <span className="text-gray-500 font-bold">{label}</span>
                <span className="text-gray-900 dark:text-white font-black text-xl">{value}</span>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-1000`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}
