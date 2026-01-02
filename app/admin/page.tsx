"use client";

import { useEffect, useState } from "react";
import { Order } from "@/lib/orders";
import { Product } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";
import { DollarSign, ShoppingBag, Truck, CheckCircle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const { t, language } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/orders');
                const productsRes = await fetch('/api/products');

                if (res.ok && productsRes.ok) {
                    const data = await res.json();
                    const productsData = await productsRes.json();
                    setOrders(data);
                    setProducts(productsData);
                }
            } catch (error) {
                console.error("Failed to fetch order stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + order.totalPrice, 0);

    const todayRevenue = orders
        .filter(o => o.status !== 'cancelled' && new Date(o.createdAt).toDateString() === new Date().toDateString())
        .reduce((sum, order) => sum + order.totalPrice, 0);

    const parsePrice = (price?: string) => {
        if (!price) return 0;
        return parseInt(price.replace(/\D/g, '')) || 0;
    };

    const netProfit = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => {
            const orderCost = (order.items || []).reduce((itemSum, item) => {
                const product = products.find(p => p.id === item.id);
                const cost = product ? parsePrice(product.costPrice) : 0;
                return itemSum + (cost * item.quantity);
            }, 0);
            return sum + (order.totalPrice - orderCost);
        }, 0);

    const adminT = (t as any).admin;

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{adminT?.dashboard || "Boshqaruv Paneli"}</h1>
                <p className="text-gray-500 font-medium">{language === 'ru' ? 'Статистика и показатели вашего магазина' : "Do'koningiz statistikasi va ko'rsatkichlari"}</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title={adminT?.total_revenue || "Jami tushum"}
                    value={`${totalRevenue.toLocaleString()} ${adminT?.currency || "so'm"}`}
                    icon={<DollarSign className="text-white" size={24} />}
                    color="bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30"
                />
                <StatCard
                    title={adminT?.net_profit || "Sof foyda"}
                    value={`${netProfit.toLocaleString()} ${adminT?.currency || "so'm"}`}
                    icon={<TrendingUp className="text-white" size={24} />}
                    color="bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-500/30"
                />
                <StatCard
                    title={adminT?.today_sales || "Bugungi savdo"}
                    value={`${todayRevenue.toLocaleString()} ${adminT?.currency || "so'm"}`}
                    icon={<CheckCircle className="text-white" size={24} />}
                    color="bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30"
                />
                <StatCard
                    title={adminT?.total_orders || "Jami buyurtmalar"}
                    value={orders.length.toString()}
                    icon={<ShoppingBag className="text-white" size={24} />}
                    color="bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30"
                />
                <StatCard
                    title={adminT?.shipping_orders || "Yetkazish jarayonida"}
                    value={orders.filter(o => o.status === 'shipping').length.toString()}
                    icon={<Truck className="text-white" size={24} />}
                    color="bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/30"
                />
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{adminT?.order_status || "Buyurtmalar holati"}</h2>

                <div className="space-y-4">
                    <StatusProgress
                        label={adminT?.new_orders || "Yangi buyurtmalar"}
                        count={orders.filter(o => o.status === 'new').length}
                        total={orders.length}
                        color="bg-blue-500"
                    />
                    <StatusProgress
                        label={adminT?.accepted_orders || "Qabul qilingan"}
                        count={orders.filter(o => o.status === 'accepted').length}
                        total={orders.length}
                        color="bg-indigo-500"
                    />
                    <StatusProgress
                        label={adminT?.on_the_way || "Yo'lda"}
                        count={orders.filter(o => o.status === 'shipping').length}
                        total={orders.length}
                        color="bg-yellow-500"
                    />
                    <StatusProgress
                        label={adminT?.delivered_orders || "Muvaffaqiyatli topshirildi"}
                        count={orders.filter(o => o.status === 'delivered').length}
                        total={orders.length}
                        color="bg-green-500"
                    />
                    <StatusProgress
                        label={adminT?.cancelled_orders || "Bekor qilingan"}
                        count={orders.filter(o => o.status === 'cancelled').length}
                        total={orders.length}
                        color="bg-red-500"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200 dark:shadow-none ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{value}</h3>
            </div>
        </div>
    );
}

function StatusProgress({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div className="flex items-center gap-4">
            <div className="w-40 font-medium text-sm text-gray-700 dark:text-gray-300">{label}</div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="w-12 text-right font-bold text-gray-900 dark:text-white text-sm">{count}</div>
        </div>
    );
}
