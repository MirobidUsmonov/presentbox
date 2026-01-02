"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Clock, Truck, Package, RotateCcw, Trash2 } from "lucide-react";
import { Order } from "@/lib/orders";
import { EditOrderModal, ChangeStatusModal } from "@/components/admin-modals";
import { useLanguage } from "@/components/language-provider";

export default function OrdersPage() {
    const { t, language } = useLanguage();
    const adminT = (t as any).admin;
    const ordersT = adminT?.orders_page;
    const statusT = adminT?.status;

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<Order['status'] | 'all'>('all');
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [changingStatusOrder, setChangingStatusOrder] = useState<Order | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdownId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, newStatus: Order['status']) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                await fetchOrders();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const updateOrderDetails = async (id: number, updates: Partial<Order>) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                await fetchOrders();
            }
        } catch (error) {
            console.error("Failed to update order", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const deleteOrder = async (id: number) => {
        if (!confirm(statusT?.delete_confirm_order || "Haqiqatan ham bu buyurtmani butunlay o'chirib tashlamoqchimisiz?")) return;

        setUpdatingId(id);
        try {
            const res = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                const data = await res.json();
                await fetchOrders();
                if (activeDropdownId === id) setActiveDropdownId(null);
            }
        } catch (error) {
            console.error("Failed to delete order", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const StatusBadge = ({ status }: { status: Order['status'] }) => {
        const styles = {
            new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            accepted: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
            shipping: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        };

        const labels = {
            new: ordersT?.tabs?.new || "Yangi",
            accepted: ordersT?.tabs?.accepted || "Qabul qilindi",
            shipping: ordersT?.tabs?.shipping || "Yo'lda",
            delivered: ordersT?.tabs?.delivered || "Topshirildi",
            cancelled: ordersT?.tabs?.cancelled || "Bekor qilindi"
        };

        return (
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const tabs: { id: Order['status'] | 'all', label: string, count: number }[] = [
        { id: 'all', label: ordersT?.tabs?.all || "Barchasi", count: orders.length },
        { id: 'new', label: ordersT?.tabs?.new || "Yangilar", count: orders.filter(o => o.status === 'new').length },
        { id: 'accepted', label: ordersT?.tabs?.accepted || "Qabul qilindi", count: orders.filter(o => o.status === 'accepted').length },
        { id: 'shipping', label: ordersT?.tabs?.shipping || "Yo'lda", count: orders.filter(o => o.status === 'shipping').length },
        { id: 'delivered', label: ordersT?.tabs?.delivered || "Topshirildi", count: orders.filter(o => o.status === 'delivered').length },
        { id: 'cancelled', label: ordersT?.tabs?.cancelled || "Bekor qilindi", count: orders.filter(o => o.status === 'cancelled').length },
    ];

    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch =
            (order.productTitle || '').toLowerCase().includes(searchLower) ||
            (order.customer?.firstName || '').toLowerCase().includes(searchLower) ||
            (order.customer?.lastName || '').toLowerCase().includes(searchLower) ||
            (order.customer?.phone || '').includes(searchTerm);

        const matchesTab = activeTab === 'all' || order.status === activeTab;

        return matchesSearch && matchesTab;
    });

    return (
        <div className="p-8">
            <EditOrderModal
                isOpen={!!editingOrder}
                onClose={() => setEditingOrder(null)}
                order={editingOrder}
                onSave={updateOrderDetails}
            />

            <ChangeStatusModal
                isOpen={!!changingStatusOrder}
                onClose={() => setChangingStatusOrder(null)}
                order={changingStatusOrder}
                onSave={updateStatus}
            />

            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{ordersT?.title || "Buyurtmalar"}</h1>
                <p className="text-gray-500 font-medium">{ordersT?.description || "Barcha tushgan buyurtmalar ro'yxati va holati"}</p>
            </header>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === tab.id
                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                            : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id
                            ? 'bg-white/20 text-white dark:bg-gray-900/20 dark:text-gray-900'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3 mb-6">
                <Search className="text-gray-400 ml-2" size={20} />
                <input
                    type="text"
                    placeholder={ordersT?.search_placeholder || "Qidirish (ID, Ism, Mahsulot)..."}
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{ordersT?.table?.id || "ID"}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{ordersT?.table?.date || "Sana"}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{ordersT?.table?.customer || "Mijoz"}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{ordersT?.table?.product || "Mahsulot"}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{ordersT?.table?.address || "Manzil"}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{ordersT?.table?.price || "Narx"}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{ordersT?.table?.status || "Holat"}</th>
                                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">{ordersT?.table?.actions || "Amal"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center text-gray-400 animate-pulse">{adminT?.loading || "Yuklanmoqda..."}</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package size={40} className="opacity-20" />
                                            <p>{statusT?.no_products || "Buyurtmalar topilmadi"}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                                        <td className="p-4 font-mono text-xs text-brand-orange font-bold">#{order.id}</td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {new Date(order.createdAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ')}
                                            </div>
                                            <div className="text-xs text-gray-400 font-mono">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 dark:text-white text-sm">{order.customer?.firstName || 'Unknown'} {order.customer?.lastName || ''}</div>
                                            <a href={`tel:${order.customer?.phone}`} className="text-xs text-gray-500 hover:text-brand-orange block">
                                                {order.customer?.phone || ''}
                                            </a>
                                            {order.customer?.telegram && (
                                                <a href={`https://t.me/${order.customer.telegram.replace('@', '')}`} target="_blank" className="text-xs text-blue-500 hover:underline">
                                                    @{order.customer.telegram.replace('@', '')}
                                                </a>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={order.productImage} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 dark:border-gray-700" />
                                                <div className="max-w-[150px]">
                                                    <div className="font-medium text-xs text-gray-900 dark:text-white line-clamp-2" title={order.productTitle}>{order.productTitle}</div>
                                                    {order.variant && <span className="inline-block mt-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-500">{order.variant}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{order.customer?.region || '-'}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[100px]" title={order.customer?.district}>{order.customer?.district || '-'}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                {Number(order.totalPrice).toLocaleString()} <span className="text-xs text-gray-400 font-normal">{adminT?.currency || "so'm"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {/* Dynamic Action Button */}
                                                {order.status === 'new' && (
                                                    <button
                                                        onClick={() => { setUpdatingId(order.id); updateStatus(order.id, 'accepted'); }}
                                                        disabled={updatingId === order.id}
                                                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                                    >
                                                        {ordersT?.actions?.accept || "Qabul qilish"}
                                                    </button>
                                                )}
                                                {order.status === 'accepted' && (
                                                    <button
                                                        onClick={() => { setUpdatingId(order.id); updateStatus(order.id, 'shipping'); }}
                                                        disabled={updatingId === order.id}
                                                        className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                                    >
                                                        {ordersT?.actions?.send || "Yuborish"}
                                                    </button>
                                                )}
                                                {order.status === 'shipping' && (
                                                    <button
                                                        onClick={() => { setUpdatingId(order.id); updateStatus(order.id, 'delivered'); }}
                                                        disabled={updatingId === order.id}
                                                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                                    >
                                                        {ordersT?.actions?.deliver || "Topshirish"}
                                                    </button>
                                                )}

                                                {/* Cancel Button (Visible if not cancelled/delivered) */}
                                                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                                    <button
                                                        onClick={() => { setUpdatingId(order.id); updateStatus(order.id, 'cancelled'); }}
                                                        disabled={updatingId === order.id}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title={ordersT?.actions?.cancel || "Bekor qilish"}
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                )}

                                                {/* Actions Menu */}
                                                <div className="relative ml-1">
                                                    <button
                                                        onMouseEnter={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setDropdownPos({ top: rect.bottom + 5, right: window.innerWidth - rect.right });
                                                            setActiveDropdownId(order.id);
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setDropdownPos({ top: rect.bottom + 5, right: window.innerWidth - rect.right });
                                                            setActiveDropdownId(activeDropdownId === order.id ? null : order.id);
                                                        }}
                                                        disabled={updatingId === order.id}
                                                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${activeDropdownId === order.id
                                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                            }`}
                                                    >
                                                        {updatingId === order.id ? <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" /> : <MoreHorizontal size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Fixed Position Dropdown Portal */}
            {activeDropdownId && (() => {
                const order = orders.find(o => o.id === activeDropdownId);
                if (!order) return null;

                return (
                    <div
                        className="fixed z-[999] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 w-56"
                        style={{ top: dropdownPos.top, right: dropdownPos.right }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-1">
                            <button
                                onClick={() => {
                                    setEditingOrder(order);
                                    setActiveDropdownId(null);
                                }}
                                className="w-full text-left px-3 py-2.5 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg flex items-center gap-2"
                            >
                                <div className="p-1 bg-blue-100 text-blue-600 rounded">
                                    <Package size={14} />
                                </div>
                                {ordersT?.actions?.edit || "Buyurtmani o'zgartirish"}
                            </button>

                            <button
                                onClick={() => {
                                    setChangingStatusOrder(order);
                                    setActiveDropdownId(null);
                                }}
                                className="w-full text-left px-3 py-2.5 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg flex items-center gap-2 mt-1"
                            >
                                <div className="p-1 bg-orange-100 text-orange-600 rounded">
                                    <CheckCircle size={14} />
                                </div>
                                {ordersT?.actions?.change_status || "Holatni o'zgartirish"}
                            </button>

                            {/* Delete Option for Cancelled Orders */}
                            {order.status === 'cancelled' && (
                                <button
                                    onClick={() => deleteOrder(order.id)}
                                    className="w-full text-left px-3 py-2.5 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg flex items-center gap-2 mt-1"
                                >
                                    <div className="p-1 bg-red-100 text-red-600 rounded">
                                        <Trash2 size={14} />
                                    </div>
                                    {ordersT?.actions?.delete_perm || "Butunlay o'chirish"}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
