import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Plus, MoreVertical,
    Store, Coffee, CheckCircle, AlertCircle,
    Eye, Edit, Trash2, Shield, Star, X, Save,
    Image as ImageIcon, MapPin, Globe, Type
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRestaurants } from '../../context/RestaurantContext';

export default function AdminRestaurants() {
    const { token } = useAuth();
    const { language, t } = useLanguage();
    const { restaurants, loading, fetchRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } = useRestaurants();

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [formData, setFormData] = useState({
        name: '', nameAr: '',
        description: '', descriptionAr: '',
        cuisineType: '', city: '',
        imageUrl: '', status: 'active',
        type: 'restaurant', rating: 4.5
    });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleEdit = (r) => {
        setEditingRestaurant(r);
        setFormData({
            name: r.name || '',
            nameAr: r.nameAr || '',
            description: r.description || '',
            descriptionAr: r.descriptionAr || '',
            cuisineType: r.cuisineType || '',
            city: r.city || '',
            imageUrl: r.imageUrl || '',
            status: r.status || 'active',
            type: r.type || 'restaurant',
            rating: r.rating || 4.5
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingRestaurant(null);
        setFormData({
            name: '', nameAr: '',
            description: '', descriptionAr: '',
            cuisineType: '', city: '',
            imageUrl: '', status: 'active',
            type: 'restaurant', rating: 4.5
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const res = editingRestaurant
            ? await updateRestaurant(editingRestaurant._id, formData)
            : await createRestaurant(formData);

        if (res.success) {
            setIsModalOpen(false);
            fetchRestaurants();
        }
    };

    const filtered = restaurants.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.nameAr?.includes(search);
        if (filter === 'all') return matchesSearch;
        return matchesSearch && r.type === filter;
    });

    return (
        <div className="space-y-10">
            <div className={`flex flex-col md:flex-row justify-between items-end gap-6 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                <div className={language === 'ar' ? 'text-right' : ''}>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">
                        {t.manageEntities.split(' ')[0]} <span className="text-accent">{t.manageEntities.split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-400 font-medium">{t.manageEntitiesDesc}</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-accent/20"
                >
                    <Plus size={18} /> {t.addNewEntity}
                </button>
            </div>

            {/* Toolbar */}
            <div className={`flex flex-col md:flex-row gap-4 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 relative">
                    <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500`} size={20} />
                    <input
                        type="text"
                        placeholder={t.searchEntities}
                        className={`w-full bg-primary/40 border border-white/5 rounded-2xl py-4 ${language === 'ar' ? 'pr-12 pl-6 text-right' : 'pl-12 pr-6'} text-white font-medium outline-none focus:border-accent/50 transition-all backdrop-blur-md`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'restaurant', 'cafe'].map(typeKey => (
                        <button
                            key={typeKey}
                            onClick={() => setFilter(typeKey)}
                            className={`px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${filter === typeKey ? 'bg-white text-primary border-white' : 'bg-transparent text-gray-400 border-white/5 hover:border-white/20'}`}
                        >
                            {t[typeKey]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map((r, i) => (
                            <motion.div
                                key={r._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-accent/30 transition-all"
                            >
                                <div className="h-48 relative">
                                    <img src={r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" alt="" />
                                    <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} flex gap-2`}>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${r.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                            {r.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'متوقف' : 'Stopped')}
                                        </div>
                                    </div>
                                    <div className={`absolute bottom-4 ${language === 'ar' ? 'right-4' : 'left-4'}`}>
                                        <div className="bg-primary/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white">
                                            {r.type === 'cafe' ? <Coffee size={20} /> : <Store size={20} />}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className={`flex justify-between items-start mb-4 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                                        <div>
                                            <h3 className="text-xl font-black text-white mb-1">{language === 'ar' ? r.nameAr || r.name : r.name}</h3>
                                            <p className={`text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                <Star size={14} className="text-yellow-500 fill-yellow-500" /> {r.rating} • {r.city || 'Amman'}
                                            </p>
                                        </div>
                                        <button className="text-gray-500 hover:text-white transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>

                                    <div className={`flex gap-4 pt-6 border-t border-white/5 mt-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                        <button
                                            onClick={() => handleEdit(r)}
                                            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                        >
                                            <Edit size={14} /> {t.edit}
                                        </button>
                                        <button
                                            onClick={() => deleteRestaurant(r._id)}
                                            className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-4 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button className="px-4 bg-accent/10 hover:bg-accent/20 text-accent py-4 rounded-xl transition-all">
                                            <Shield size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Edit/Add Modal */}
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
                            className="relative bg-secondary border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl"
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                        >
                            <div className="p-10 border-b border-white/5 bg-primary/20 flex justify-between items-center">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                    {editingRestaurant ? (language === 'ar' ? 'تعديل' : 'Edit') : (language === 'ar' ? 'إضافة' : 'Add')} <span className="text-accent">{language === 'ar' ? 'منشأة' : 'Entity'}</span>
                                </h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'الاسم (AR)' : 'Name (AR)'}</label>
                                        <input
                                            type="text" required dir="rtl"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                            value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'النوع' : 'Type'}</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent appearance-none"
                                            value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="restaurant" className="bg-secondary">{language === 'ar' ? 'مطعم' : 'Restaurant'}</option>
                                            <option value="cafe" className="bg-secondary">{language === 'ar' ? 'مقهى' : 'Cafe'}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'المدينة' : 'City'}</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                            value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'رابط الصورة' : 'Image URL'}</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                        value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'المطبخ' : 'Cuisine'}</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                            value={formData.cuisineType} onChange={e => setFormData({ ...formData, cuisineType: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'الحالة' : 'Status'}</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent appearance-none"
                                            value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="active" className="bg-secondary">{language === 'ar' ? 'نشط' : 'Active'}</option>
                                            <option value="inactive" className="bg-secondary">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-10 bg-primary/20 flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">{t.cancel}</button>
                                <button type="submit" className="flex-1 bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-accent/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                    <Save size={18} /> {language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
