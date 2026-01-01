
"use client";

import { useState, useEffect } from "react";
import { X, Save, Check, Circle, Search, Copy, Plus } from "lucide-react";
import { Order } from "@/lib/orders";
import { Product } from "@/lib/translations";

// ... existing modals (EditOrderModal, ChangeStatusModal) ...

interface EditOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onSave: (id: number, updates: Partial<Order>) => Promise<void>;
}

export function EditOrderModal({ isOpen, onClose, order, onSave }: EditOrderModalProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        telegram: "",
        region: "",
        district: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form when order opens
    useEffect(() => {
        if (order) {
            setFormData({ ...order.customer });
        }
    }, [order]);

    if (!isOpen || !order) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(order.id, {
            customer: {
                ...order.customer,
                ...formData
            }
        });
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Buyurtmani o'zgartirish</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Ism</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Familiya</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Telefon</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Telegram</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                            value={formData.telegram}
                            onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Viloyat</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                                value={formData.region}
                                onChange={e => setFormData({ ...formData, region: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Tuman / Shahar</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                                value={formData.district}
                                onChange={e => setFormData({ ...formData, district: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 bg-brand-orange hover:bg-brand-coral py-3 rounded-xl font-bold text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface ChangeStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onSave: (id: number, status: Order['status']) => Promise<void>;
}

export function ChangeStatusModal({ isOpen, onClose, order, onSave }: ChangeStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<Order['status']>('new');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (order) {
            setSelectedStatus(order.status);
        }
    }, [order]);

    if (!isOpen || !order) return null;

    const statuses: { id: Order['status'], label: string, color: string }[] = [
        { id: 'new', label: 'Yangi', color: 'bg-blue-500' },
        { id: 'accepted', label: 'Qabul qilindi', color: 'bg-indigo-500' },
        { id: 'shipping', label: "Yo'lda", color: 'bg-yellow-500' },
        { id: 'delivered', label: 'Topshirildi', color: 'bg-green-500' },
        { id: 'cancelled', label: 'Bekor qilindi', color: 'bg-red-500' },
    ];

    const handleSave = async () => {
        if (selectedStatus === order.status) {
            onClose();
            return;
        }
        setIsSaving(true);
        await onSave(order.id, selectedStatus);
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Holatni o'zgartirish</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-2 space-y-1">
                    {statuses.map((status) => (
                        <button
                            key={status.id}
                            onClick={() => setSelectedStatus(status.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${selectedStatus === status.id
                                ? 'bg-gray-50 dark:bg-gray-700/50 ring-2 ring-brand-orange ring-inset'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className={`w-3 h-3 rounded-full ${status.color} shadow-sm ring-2 ring-white dark:ring-gray-800`} />
                            <span className={`flex-1 text-left font-bold ${selectedStatus === status.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                {status.label}
                            </span>
                            {selectedStatus === status.id && (
                                <Check size={20} className="text-brand-orange" strokeWidth={3} />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 bg-brand-orange hover:bg-brand-coral py-3 rounded-xl font-bold text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
                    >
                        {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ImportProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (product: Product) => Promise<void>;
    existingProducts?: Product[];
}

export function ImportProductModal({ isOpen, onClose, onImport, existingProducts = [] }: ImportProductModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isImporting, setIsImporting] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetch('/api/products')
                .then(res => res.json())
                .then(data => setProducts(data))
                .catch(err => console.error(err))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen]);

    const filteredProducts = products.filter(p =>
        p.uz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ru.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImport = async (product: Product) => {
        setIsImporting(product.id);
        await onImport(product);
        setIsImporting(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Mahsulot import qilish</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Boshqa bo'limdan mahsulot nusxasini ko'chirish</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 pb-2">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Import qilish uchun qidiring..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl focus:ring-2 focus:ring-brand-orange/50 outline-none transition-all font-medium text-gray-900 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-400">Yuklanmoqda...</div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => {
                            const isAlreadyImported = products.some(p => p.uz.title === product.uz.title && p.source === (document.location.pathname.split('/').pop() || 'uzum'));
                            // Note: Above check is a bit simplified. Ideally pass current 'slug' to modal.
                            // But since modal is generic, let's rely on parent passing excluded IDs or logic.
                            // Actually, let's just make the button text clearer and maybe check via props? 
                            // Since we can't easily change prop interface without editing usage, 
                            // Actually, let's just make the button text clearer and maybe check via props?
                            // Since we can't easily change prop interface without editing usage,
                            // let's pass 'existingProductIds' to modal.

                            // Checking via 'onImport' logic is better? No, UI needs to show it.
                            // Let's rely on the user visually or add a prop.
                            // Simplest valid fix: Add `existingProductIds` prop to `ImportProductModal`.
                            const isDuplicate = existingProducts.some(p => p.uz.title === product.uz.title);

                            return (
                                <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 transition-colors group">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
                                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 dark:text-white truncate">{product.uz.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-md uppercase tracking-wider">
                                                {product.source || 'uzum'}
                                            </span>
                                            <span className="text-sm font-medium text-gray-500">{product.price}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleImport(product)}
                                        disabled={!!isImporting || isDuplicate}
                                        className={`px-4 py-2 font-bold rounded-xl transition-all flex items-center gap-2
                                            ${isDuplicate
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange text-gray-600 dark:text-gray-300'}`}
                                    >
                                        {isImporting === product.id ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : isDuplicate ? (
                                            <Check size={18} />
                                        ) : (
                                            <Copy size={18} />
                                        )}
                                        {isDuplicate ? "Bor" : "Import"}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-10 text-gray-400 font-medium">
                            Mahsulotlar topilmadi
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
