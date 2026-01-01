"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Shield, User, Loader2, Save, X, Lock, Check } from "lucide-react";
import { Admin } from "@/lib/admins";
import { Role, Permissions } from "@/lib/roles";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'admins' | 'roles'>('admins');

    // Data State
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Editing State
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [adminFormData, setAdminFormData] = useState<Partial<Admin>>({ roleId: 2 });

    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roleFormData, setRoleFormData] = useState<Partial<Role>>({
        permissions: {
            products_view: false, products_manage: false,
            categories_view: false, categories_manage: false,
            orders_view: false, orders_manage: false,
            customers_view: false,
            settings_view: false, settings_manage: false
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [adminsRes, rolesRes] = await Promise.all([
                fetch('/api/admins'),
                fetch('/api/roles')
            ]);

            if (adminsRes.ok) setAdmins(await adminsRes.json());
            if (rolesRes.ok) setRoles(await rolesRes.json());
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Admin Handlers ---
    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingAdmin ? '/api/admins' : '/api/admins';
            const method = editingAdmin ? 'PUT' : 'POST';
            const body = editingAdmin ? { ...adminFormData, id: editingAdmin.id } : adminFormData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                // Refresh admins only
                const newAdmins = await (await fetch('/api/admins')).json();
                setAdmins(newAdmins);
                closeModal();
            } else {
                alert("Xatolik yuz berdi");
            }
        } catch (error) {
            console.error("Failed to save admin", error);
        }
    };

    const handleDeleteAdmin = async (id: number) => {
        if (!confirm("Haqiqatan ham ushbu adminni o'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/admins?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAdmins(admins.filter(a => a.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "O'chirishda xatolik");
            }
        } catch (error) {
            console.error("Failed to delete admin", error);
        }
    };

    // --- Role Handlers ---
    const handleRoleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingRole ? '/api/roles' : '/api/roles';
            const method = editingRole ? 'PUT' : 'POST';
            const body = editingRole ? { ...roleFormData, id: editingRole.id } : roleFormData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const newRoles = await (await fetch('/api/roles')).json();
                setRoles(newRoles);
                closeModal();
            } else {
                alert("Xatolik yuz berdi");
            }
        } catch (error) {
            console.error("Failed to save role", error);
        }
    };

    const handleDeleteRole = async (id: number) => {
        if (!confirm("Haqiqatan ham ushbu rolni o'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/roles?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setRoles(roles.filter(r => r.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "O'chirishda xatolik");
            }
        } catch (error) {
            console.error("Failed to delete role", error);
        }
    };

    // --- Modal Logic ---
    const openAdminModal = (admin?: Admin) => {
        if (admin) {
            setEditingAdmin(admin);
            setAdminFormData({ ...admin, password: '' }); // Don't show password
        } else {
            setEditingAdmin(null);
            setAdminFormData({ roleId: roles[0]?.id || 1, username: '', fullName: '', password: '' });
        }
        setIsModalOpen(true);
    };

    const openRoleModal = (role?: Role) => {
        if (role) {
            setEditingRole(role);
            setRoleFormData(role);
        } else {
            setEditingRole(null);
            setRoleFormData({
                name: '',
                permissions: {
                    products_view: false, products_manage: false,
                    categories_view: false, categories_manage: false,
                    orders_view: false, orders_manage: false,
                    customers_view: false,
                    settings_view: false, settings_manage: false
                }
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAdmin(null);
        setEditingRole(null);
    };

    const getRoleName = (roleId: number) => {
        return roles.find(r => r.id === roleId)?.name || 'Unknown';
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Sozlamalar</h1>
                    <p className="text-gray-500 font-medium">Tizim foydalanuvchilari va ruxsatlar</p>
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'admins'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                    >
                        Adminlar
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'roles'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                    >
                        Rollar & Ruxsatlar
                    </button>
                </div>

                <button
                    onClick={() => activeTab === 'admins' ? openAdminModal() : openRoleModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-orange/20"
                >
                    <Plus size={20} />
                    {activeTab === 'admins' ? 'Yangi Admin' : 'Yangi Rol'}
                </button>
            </header>

            {/* ADMINS TAB */}
            {activeTab === 'admins' && (
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">F.I.O</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Login</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Rol</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Yaratilgan sana</th>
                                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold uppercase">
                                                {admin.fullName.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white">{admin.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 font-mono text-sm text-gray-600 dark:text-gray-300">
                                        @{admin.username}
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            {getRoleName(admin.roleId)}
                                        </span>
                                    </td>
                                    <td className="p-6 text-sm text-gray-500">
                                        {new Date(admin.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openAdminModal(admin)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteAdmin(admin.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ROLES TAB */}
            {activeTab === 'roles' && (
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.map((role) => (
                            <div key={role.id} className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-shadow bg-gray-50/50 dark:bg-gray-900/50">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{role.name}</h3>
                                    {!role.isSystem && (
                                        <div className="flex gap-1">
                                            <button onClick={() => openRoleModal(role)} className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-md">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteRole(role.id)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                    {role.isSystem && <Shield size={16} className="text-brand-orange" />}
                                </div>
                                <div className="space-y-2">
                                    <PermissionBadge label="Mahsulotlar" active={role.permissions.products_view} manage={role.permissions.products_manage} />
                                    <PermissionBadge label="Kategoriyalar" active={role.permissions.categories_view} manage={role.permissions.categories_manage} />
                                    <PermissionBadge label="Buyurtmalar" active={role.permissions.orders_view} manage={role.permissions.orders_manage} />
                                    <PermissionBadge label="Sozlamalar" active={role.permissions.settings_view} manage={role.permissions.settings_manage} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODALS */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                {activeTab === 'admins'
                                    ? (editingAdmin ? "Adminni tahrirlash" : "Yangi Admin")
                                    : (editingRole ? "Rolni tahrirlash" : "Yangi Rol")}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {/* ADMIN FORM */}
                        {activeTab === 'admins' && (
                            <form onSubmit={handleAdminSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">To'liq ism</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all font-bold text-gray-900 dark:text-white"
                                        value={adminFormData.fullName || ''}
                                        onChange={e => setAdminFormData({ ...adminFormData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Login (Username)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all font-bold text-gray-900 dark:text-white"
                                        value={adminFormData.username || ''}
                                        onChange={e => setAdminFormData({ ...adminFormData, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                        Parol {editingAdmin && <span className="text-xs font-normal text-gray-400">(O'zgartirish uchun kiriting)</span>}
                                    </label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            required={!editingAdmin}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all font-bold text-gray-900 dark:text-white"
                                            value={adminFormData.password || ''}
                                            onChange={e => setAdminFormData({ ...adminFormData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                        Rol
                                        {editingAdmin?.id === 1 && <span className="text-xs font-normal text-red-500 ml-2">(O'zgartirib bo'lmaydi)</span>}
                                    </label>
                                    <select
                                        disabled={editingAdmin?.id === 1}
                                        className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all font-bold text-gray-900 dark:text-white appearance-none ${editingAdmin?.id === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        value={adminFormData.roleId}
                                        onChange={e => setAdminFormData({ ...adminFormData, roleId: parseInt(e.target.value) })}
                                    >
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-4 bg-brand-orange text-white font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-orange/20 mt-4 flex items-center justify-center gap-2">
                                    <Save size={20} />
                                    Saqlash
                                </button>
                            </form>
                        )}

                        {/* ROLE FORM */}
                        {activeTab === 'roles' && roleFormData.permissions && (
                            <form onSubmit={handleRoleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Rol nomi</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all font-bold text-gray-900 dark:text-white"
                                        value={roleFormData.name || ''}
                                        onChange={e => setRoleFormData({ ...roleFormData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Ruxsatlar</label>
                                    <div className="space-y-3">
                                        <PermissionCheckbox
                                            label="Mahsulotlar (Ko'rish)"
                                            checked={roleFormData.permissions.products_view}
                                            onChange={c => setRoleFormData(prev => ({ ...prev, permissions: { ...prev.permissions!, products_view: c } }))}
                                        />
                                        <PermissionCheckbox
                                            label="Mahsulotlar (Boshqaruv - Qo'shish/O'chirish)"
                                            checked={roleFormData.permissions.products_manage}
                                            onChange={c => setRoleFormData(prev => ({ ...prev, permissions: { ...prev.permissions!, products_manage: c } }))}
                                        />
                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />

                                        <PermissionCheckbox
                                            label="Kategoriyalar (Ko'rish)"
                                            checked={roleFormData.permissions.categories_view}
                                            onChange={c => setRoleFormData(prev => ({ ...prev, permissions: { ...prev.permissions!, categories_view: c } }))}
                                        />
                                        <PermissionCheckbox
                                            label="Kategoriyalar (Boshqaruv)"
                                            checked={roleFormData.permissions.categories_manage}
                                            onChange={c => setRoleFormData(prev => ({ ...prev, permissions: { ...prev.permissions!, categories_manage: c } }))}
                                        />
                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />

                                        <PermissionCheckbox
                                            label="Buyurtmalar (Ko'rish)"
                                            checked={roleFormData.permissions.orders_view}
                                            onChange={c => setRoleFormData(prev => ({ ...prev, permissions: { ...prev.permissions!, orders_view: c } }))}
                                        />
                                        <PermissionCheckbox
                                            label="Buyurtmalar (Boshqaruv)"
                                            checked={roleFormData.permissions.orders_manage}
                                            onChange={c => setRoleFormData(prev => ({ ...prev, permissions: { ...prev.permissions!, orders_manage: c } }))}
                                        />
                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />

                                        <PermissionCheckbox
                                            label="Sozlamalar (Ko'rish)"
                                            checked={roleFormData.permissions.settings_view}
                                            onChange={c => setRoleFormData(prev => ({ ...prev, permissions: { ...prev.permissions!, settings_view: c } }))}
                                        />
                                        <PermissionCheckbox
                                            label="Sozlamalar (Boshqaruv)"
                                            checked={roleFormData.permissions.settings_manage}
                                            onChange={c => setRoleFormData(prev => ({ ...prev, permissions: { ...prev.permissions!, settings_manage: c } }))}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-brand-orange text-white font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-orange/20 mt-4 flex items-center justify-center gap-2">
                                    <Save size={20} />
                                    Saqlash
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function PermissionBadge({ label, active, manage }: { label: string, active: boolean, manage: boolean }) {
    if (!active) return null;
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <div className="flex gap-2">
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Ko'rish</span>
                {manage && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Boshqaruv</span>}
            </div>
        </div>
    );
}

function PermissionCheckbox({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-brand-orange border-brand-orange' : 'border-gray-300 dark:border-gray-600 bg-transparent'}`}>
                {checked && <Check size={14} className="text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={checked} onChange={e => onChange(e.target.checked)} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-orange transition-colors">{label}</span>
        </label>
    );
}
