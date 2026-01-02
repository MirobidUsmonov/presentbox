"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Sector } from 'recharts';

// Adapted Interface mirroring the API response
interface Order {
    id: number;
    // Order info
    status: string;
    createdAt: string; // ISO String

    // Product info
    productTitle: string;
    productImage: string;

    // Financials
    totalPrice: number; // Revenue
    purchasePrice: number; // Tan Narxi (COGS)
    commission: number;
    logisticDeliveryFee: number;
    sellerProfit: number; // Payout from platform
}

type TimeRange = 'today' | 'week' | 'month' | 'all';

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

    return (
        <g style={{ outline: 'none' }}>
            <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#9CA3AF" fontSize={10}>
                {payload.name}
            </text>
            <text x={cx} y={cy} dy={14} textAnchor="middle" fill={fill} fontSize={14} fontWeight="bold">
                {(value as number).toLocaleString()}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                style={{ outline: 'none' }}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 10}
                outerRadius={outerRadius + 14}
                fill={fill}
                style={{ outline: 'none' }}
            />
        </g>
    );
};

export default function UnitEconomicsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>('week');
    const [activeIndex, setActiveIndex] = useState(0);
    const [chartMetric, setChartMetric] = useState<'sales' | 'profit'>('sales');

    const onPieEnter = useCallback((_: any, index: number) => {
        setActiveIndex(index);
    }, []);

    const onPieLeave = useCallback(() => {
        setActiveIndex(0); // Reset to "Sof Foyda"
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (data.orders) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders/refresh', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
            } else {
                console.error("Refresh failed");
            }
        } catch (error) {
            console.error("Error refreshing:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCostChange = async (orderId: number, newCost: number) => {
        // Optimistic update
        const updatedOrders = orders.map(o => {
            if (o.id === orderId) {
                return { ...o, purchasePrice: newCost };
            }
            return o;
        });
        setOrders(updatedOrders);

        try {
            await fetch('/api/orders/update-cost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, purchasePrice: newCost })
            });
        } catch (error) {
            console.error("Failed to update cost", error);
            fetchData(); // Revert on error
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const kpiStats = useMemo(() => {
        // Filter out cancelled/returned for KPI
        const validOrders = orders.filter(o =>
            !['cancelled', 'returned', 'canceled'].includes(o.status.toLowerCase())
        );

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
        const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();

        // Profit = SellerProfit (Payout) - PurchasePrice (COGS)
        // If sellerProfit is missing/0, fallback to Revenue - Expenses - COGS
        const getNetProfit = (o: Order) => {
            let payout = o.sellerProfit;
            if (!payout) {
                payout = o.totalPrice - (o.commission || 0) - (o.logisticDeliveryFee || 0);
            }
            return payout - (o.purchasePrice || 0);
        };

        const calcProfit = (ords: Order[]) => ords.reduce((sum, o) => sum + getNetProfit(o), 0);
        const calcSales = (ords: Order[]) => ords.reduce((sum, o) => sum + o.totalPrice, 0);

        const todaysOrders = validOrders.filter(o => new Date(o.createdAt).getTime() >= todayStart);
        const weeklyOrders = validOrders.filter(o => new Date(o.createdAt).getTime() >= weekStart);
        const monthlyOrders = validOrders.filter(o => new Date(o.createdAt).getTime() >= monthStart);

        return {
            daily_sales: calcSales(todaysOrders),
            daily_profit: calcProfit(todaysOrders),
            weekly_profit: calcProfit(weeklyOrders),
            monthly_profit: calcProfit(monthlyOrders),
        };
    }, [orders]);

    const filteredData = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
        const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();

        let filtered = orders;
        if (timeRange === 'today') filtered = orders.filter(o => new Date(o.createdAt).getTime() >= todayStart);
        else if (timeRange === 'week') filtered = orders.filter(o => new Date(o.createdAt).getTime() >= weekStart);
        else if (timeRange === 'month') filtered = orders.filter(o => new Date(o.createdAt).getTime() >= monthStart);

        const validFiltered = filtered.filter(o => !['cancelled', 'returned', 'canceled'].includes(o.status.toLowerCase()));

        // Calculate Totals
        const netProfit = validFiltered.reduce((sum, o) => {
            let payout = o.sellerProfit;
            if (!payout) payout = o.totalPrice - (o.commission || 0) - (o.logisticDeliveryFee || 0);
            return sum + (payout - (o.purchasePrice || 0));
        }, 0);

        const totalCommission = validFiltered.reduce((sum, o) => sum + (o.commission || 0), 0);
        const totalLogistics = validFiltered.reduce((sum, o) => sum + (o.logisticDeliveryFee || 0), 0);
        const totalCostPrice = validFiltered.reduce((sum, o) => sum + (o.purchasePrice || 0), 0);

        // Dynamics Chart Data
        const dynamicsData = [...validFiltered]
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .reduce((acc: any[], order) => {
                const d = new Date(order.createdAt);

                let name = '';
                if (timeRange === 'today') {
                    name = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                } else {
                    name = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }

                // Calculate Profit for this order
                let payout = order.sellerProfit;
                if (!payout) payout = order.totalPrice - (order.commission || 0) - (order.logisticDeliveryFee || 0);
                const profit = payout - (order.purchasePrice || 0);

                const existing = acc.find(i => i.name === name);
                if (existing) {
                    existing.sales += order.totalPrice;
                    existing.profit += profit;
                } else {
                    acc.push({ name, sales: order.totalPrice, profit });
                }
                return acc;
            }, []);

        return {
            orders: filtered,
            costs: {
                net_profit: netProfit,
                commission: totalCommission,
                logistics: totalLogistics,
                cost_price: totalCostPrice
            },
            sales_dynamics: dynamicsData
        };
    }, [orders, timeRange]);


    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
    </div>;

    const costData = [
        { name: 'Sof Foyda', value: filteredData.costs.net_profit, color: '#10b981' },
        { name: 'Tan Narxi', value: filteredData.costs.cost_price, color: '#f59e0b' },
        { name: 'Komissiya', value: filteredData.costs.commission, color: '#ef4444' },
        { name: 'Logistika', value: filteredData.costs.logistics, color: '#3b82f6' },
    ];

    const hasCostData = Math.abs(filteredData.costs.net_profit) > 0 || filteredData.costs.cost_price > 0 || filteredData.costs.commission > 0;

    return (
        <div className="space-y-6">
            <style jsx global>{`
                .recharts-wrapper *:focus { outline: none !important; }
                .recharts-layer path:focus { outline: none !important; }
                .recharts-sector:focus { outline: none !important; }
                .recharts-surface:focus { outline: none !important; }
                g:focus { outline: none !important; }
                path { outline: none !important; }
            `}</style>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="bg-sky-900/30 text-sky-400 px-2 py-0.5 rounded text-xs font-bold border border-sky-800/50">UNIT IQTISODIYOT</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-1">Yunit Iqtisodiyot</h1>
                    <p className="text-gray-400 text-sm">PresentBox do'koni tahlili (Real vaqt)</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="bg-slate-800 p-1 rounded-lg flex border border-slate-700">
                        {(['today', 'week', 'month', 'all'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${timeRange === range
                                    ? 'bg-slate-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                    }`}
                            >
                                {range === 'today' && 'Bugun'}
                                {range === 'week' && 'Hafta'}
                                {range === 'month' && 'Oy'}
                                {range === 'all' && 'Jami'}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 px-4 py-2 rounded-lg font-semibold text-sm transition-colors active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                        Yangilash
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon="💰"
                    iconBg="bg-indigo-50 text-indigo-600"
                    badge="Bugun"
                    label="KUNLIK SAVDO"
                    value={kpiStats.daily_sales}
                />
                <StatCard
                    icon="💲"
                    iconBg="bg-green-50 text-green-600"
                    badge="Bugun"
                    label="KUNLIK FOYDA"
                    value={kpiStats.daily_profit}
                />
                <StatCard
                    icon="📈"
                    iconBg="bg-blue-50 text-blue-600"
                    badge="7 kun"
                    label="HAFTALIK FOYDA"
                    value={kpiStats.weekly_profit}
                />
                <StatCard
                    icon="📊"
                    iconBg="bg-cyan-50 text-cyan-600"
                    badge="30 kun"
                    label="OYLIK FOYDA"
                    value={kpiStats.monthly_profit}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 min-h-[400px] lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            ↗ {chartMetric === 'sales' ? 'Sotuvlar Dinamikasi' : 'Foyda Dinamikasi'}
                        </h3>
                        <div className="relative">
                            <select
                                value={chartMetric}
                                onChange={(e) => setChartMetric(e.target.value as 'sales' | 'profit')}
                                className="appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-1.5 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="sales">Savdo (Tushum)</option>
                                <option value="profit">Sof Foyda</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData.sales_dynamics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar
                                    dataKey={chartMetric}
                                    fill={chartMetric === 'sales' ? '#f97316' : '#10b981'}
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                    name={chartMetric === 'sales' ? "Sotuv" : "Foyda"}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 min-h-[400px] lg:col-span-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">🕓 Harajatlar Tarkibi ({timeRange === 'today' ? 'Bugun' : timeRange === 'week' ? 'Shu hafta' : timeRange === 'month' ? 'Shu oy' : 'Jami'})</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        {hasCostData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={costData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        onMouseEnter={onPieEnter}
                                        onMouseLeave={onPieLeave}
                                    >
                                        {costData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        formatter={(value, entry: any) => (
                                            <span className="ml-2 font-bold text-slate-900 dark:text-white">
                                                <span className="block text-xs font-normal text-slate-500 mb-0.5">{value}</span>
                                                {(entry.payload.value as number).toLocaleString()} so'm
                                            </span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400 text-sm">Ma'lumotlar yetarli emas</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filtered Buyurtmalar ({filteredData.orders.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-3">Rasm/ID</th>
                                <th className="px-6 py-3">Mahsulot</th>
                                <th className="px-6 py-3">Sana</th>
                                <th className="px-6 py-3">Narx</th>
                                <th className="px-6 py-3">Tan Narxi</th>
                                <th className="px-6 py-3">Komissiya</th>
                                <th className="px-6 py-3">Logistika</th>
                                <th className="px-6 py-3">Sof Foyda</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.orders.map((order) => {
                                let payout = order.sellerProfit;
                                if (!payout) payout = order.totalPrice - (order.commission || 0) - (order.logisticDeliveryFee || 0);
                                const realNetProfit = payout - (order.purchasePrice || 0);

                                return (
                                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-3">
                                                {order.productImage && (
                                                    <img
                                                        src={order.productImage}
                                                        alt=""
                                                        className="w-10 h-10 rounded object-cover border border-slate-200"
                                                    />
                                                )}
                                                <span className="text-xs text-slate-400">#{order.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="font-medium text-slate-900 dark:text-white">{order.productTitle}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {order.totalPrice.toLocaleString()} so'm
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            <div className="relative group">
                                                <input
                                                    type="number"
                                                    className="bg-transparent text-orange-500 w-24 border-b border-transparent focus:border-orange-500 focus:outline-none"
                                                    value={order.purchasePrice || ''}
                                                    onChange={(e) => handleCostChange(order.id, Number(e.target.value))}
                                                    placeholder="0"
                                                />
                                                <span className="absolute -top-3 left-0 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">tahrirlash</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-red-500">
                                            -{(order.commission || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-blue-500">
                                            -{(order.logisticDeliveryFee || 0).toLocaleString()}
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${realNetProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {realNetProfit >= 0 ? '+' : ''}{realNetProfit.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, iconBg, badge, label, value }: { icon: string, iconBg: string, badge: string, label: string, value: number }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} text-xl`}>
                    {icon}
                </div>
                <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs font-bold">{badge}</span>
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {value.toLocaleString()} <span className="text-base font-normal text-slate-400">so'm</span>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: { [key: string]: string } = {
        processing: 'bg-blue-100 text-blue-700 border-blue-200',
        delivered: 'bg-green-100 text-green-700 border-green-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
        returned: 'bg-orange-100 text-orange-700 border-orange-200',
        new: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };

    const statusKey = status ? status.toLowerCase() : 'new';

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[statusKey] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
}
