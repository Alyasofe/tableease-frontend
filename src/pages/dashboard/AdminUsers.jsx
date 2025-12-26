import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Mail, Shield, ShieldCheck,
    MoreVertical, Search, UserCheck, UserX,
    Clock, Key, Edit, Trash2, X, Save,
    CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminUsers() {
    const { token } = useAuth();
    const { language, t } = useLanguage();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'customer',
        status: 'active'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5001/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setUsers(result.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status || 'active'
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5001/api/admin/users/${editingUser._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (result.success) {
                setIsModalOpen(false);
                fetchUsers();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateUserStatus = async (id, status) => {
        try {
            await fetch(`http://localhost:5001/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const RoleBadge = ({ role }) => {
        const colors = {
            super_admin: 'bg-red-500/20 text-red-400 border-red-500/30',
            admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            restaurant_owner: 'bg-accent/20 text-accent border-accent/30',
            customer: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        };
        return (
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[role] || colors.customer}`}>
                {role.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="space-y-10">
            <div className={language === 'ar' ? 'text-right' : ''}>
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">
                    {t.userAuth.split(' ')[0]} <span className="text-accent">{t.userAuth.split(' ')[1]}</span>
                </h1>
                <p className="text-gray-400 font-medium">{t.userAuthDesc}</p>
            </div>

            <div className="relative">
                <Search className={`absolute ${language === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-gray-500`} size={20} />
                <input
                    type="text"
                    placeholder={t.searchUsers}
                    className={`w-full bg-primary/40 border border-white/5 rounded-3xl py-6 ${language === 'ar' ? 'pr-16 pl-8 text-right' : 'pl-16 pr-8'} text-white font-medium outline-none focus:border-accent/50 transition-all backdrop-blur-md`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden">
                <table className="w-full text-left border-collapse" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{t.userDetails}</th>
                            <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{t.platformRole}</th>
                            <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{t.accountStatus}</th>
                            <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-left' : 'text-right'}`}>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="py-20 text-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                        ) : filtered.map((u) => (
                            <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                        <img src={`https://ui-avatars.com/api/?name=${u.username}&background=random`} className="w-12 h-12 rounded-2xl border-2 border-white/10" alt="" />
                                        <div className={language === 'ar' ? 'text-right' : ''}>
                                            <h4 className="text-white font-black text-sm">{u.username}</h4>
                                            <p className={`text-gray-500 text-[10px] font-bold uppercase flex items-center gap-1 group-hover:text-accent transition-colors ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                <Mail size={12} /> {u.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className={`px-8 py-6 ${language === 'ar' ? 'text-right' : ''}`}>
                                    <RoleBadge role={u.role} />
                                </td>
                                <td className={`px-8 py-6 ${language === 'ar' ? 'text-right' : ''}`}>
                                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-2 h-2 rounded-full ${u.status === 'suspended' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${u.status === 'suspended' ? 'text-red-400' : 'text-green-400'}`}>
                                            {u.status === 'suspended' ? t.suspend : t.active}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className={`flex gap-2 shrink-0 ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                                        <button
                                            onClick={() => handleEdit(u)}
                                            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        {u.status === 'suspended' ? (
                                            <button onClick={() => updateUserStatus(u._id, 'active')} className="p-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl transition-all"><UserCheck size={16} /></button>
                                        ) : (
                                            <button onClick={() => updateUserStatus(u._id, 'suspended')} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"><UserX size={16} /></button>
                                        )}
                                        <button className="p-3 bg-gray-500/10 hover:bg-accent/20 text-accent rounded-xl transition-all"><Shield size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.form
                            onSubmit={handleSave}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-secondary border border-white/10 w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl"
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                        >
                            <div className="p-10 border-b border-white/5 bg-primary/20 flex justify-between items-center">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                    {language === 'ar' ? 'تعديل' : 'Edit'} <span className="text-accent">{language === 'ar' ? 'المستخدم' : 'User'}</span>
                                </h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-10 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                                    <input
                                        type="text" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                        value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                    <input
                                        type="email" required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'الدور' : 'Role'}</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent appearance-none"
                                            value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="customer" className="bg-secondary">{language === 'ar' ? 'عميل' : 'Customer'}</option>
                                            <option value="restaurant_owner" className="bg-secondary">{language === 'ar' ? 'صاحب منشأة' : 'Owner'}</option>
                                            <option value="admin" className="bg-secondary">{language === 'ar' ? 'مدير' : 'Admin'}</option>
                                            <option value="super_admin" className="bg-secondary">{language === 'ar' ? 'مدير عام' : 'Super Admin'}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'الحالة' : 'Status'}</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent appearance-none"
                                            value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="active" className="bg-secondary">{language === 'ar' ? 'نشط' : 'Active'}</option>
                                            <option value="suspended" className="bg-secondary">{language === 'ar' ? 'موقوف' : 'Suspended'}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-10 bg-primary/20 flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">{t.cancel}</button>
                                <button type="submit" className="flex-1 bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-accent/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                    <Save size={18} /> {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
