import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Plus, Search, Filter,
    Calendar, Store, Clock, Trash2,
    Edit3, CheckCircle, AlertCircle, Eye,
    Sparkles, ArrowRight, Copy, ExternalLink
} from 'lucide-react';
import { useOffers } from '../../context/OfferContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRestaurants } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminOffers() {
    const { offers, loading, fetchAdminOffers, addOffer, updateOffer, deleteOffer } = useOffers();
    const { restaurants, fetchRestaurants } = useRestaurants();
    const { language, t } = useLanguage();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [formData, setFormData] = useState({
        title: '', titleAr: '',
        description: '', descriptionAr: '',
        discount: '', discountAr: '',
        restaurant: '',
        expiryDate: '',
        imageUrl: '',
        active: true,
        isExclusiveHome: false,
        isShowList: true,
        isPromoCarousel: false
    });

    useEffect(() => {
        fetchAdminOffers();
        fetchRestaurants();
    }, []);

    const handleEdit = (offer) => {
        setEditingOffer(offer);
        setFormData({
            title: offer.title,
            titleAr: offer.titleAr,
            description: offer.description,
            descriptionAr: offer.descriptionAr,
            discount: offer.discount || '',
            discountAr: offer.discountAr || '',
            restaurant: offer.restaurant?._id || offer.restaurant || '',
            expiryDate: offer.expiryDate ? new Date(offer.expiryDate).toISOString().split('T')[0] : '',
            imageUrl: offer.imageUrl || '',
            active: offer.active,
            isExclusiveHome: offer.isExclusiveHome || false,
            isShowList: offer.isShowList !== undefined ? offer.isShowList : true,
            isPromoCarousel: offer.isPromoCarousel || false
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const res = editingOffer
            ? await updateOffer(editingOffer._id, formData)
            : await addOffer(formData);

        if (res.success) {
            setIsModalOpen(false);
            setEditingOffer(null);
            setFormData({
                title: '', titleAr: '',
                description: '', descriptionAr: '',
                discount: '', discountAr: '',
                restaurant: '', expiryDate: '',
                imageUrl: '',
                active: true,
                isExclusiveHome: false,
                isShowList: true,
                isPromoCarousel: false
            });
        }
    };

    const filtered = offers.filter(o =>
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.restaurant?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div className={language === 'ar' ? 'text-right' : ''}>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
                        {t.globalOffers.split(' ')[0]} <span className="text-accent">{t.globalOffers.split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-400 font-medium">{t.globalOffersDesc}</p>
                </div>
                <button
                    onClick={() => { setEditingOffer(null); setIsModalOpen(true); }}
                    className="bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-accent/20"
                >
                    <Plus size={18} /> {t.newCampaign}
                </button>
            </div>

            <div className="relative">
                <Search className={`absolute ${language === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-gray-400`} size={20} />
                <input
                    type="text"
                    placeholder={t.searchOffers}
                    className={`w-full bg-primary/40 border border-white/5 rounded-3xl py-6 ${language === 'ar' ? 'pr-16 pl-8 text-right' : 'pl-16 pr-8'} text-white font-medium outline-none focus:border-accent/50 transition-all backdrop-blur-md`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full h-64 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filtered.map((offer, i) => (
                    <motion.div
                        key={offer._id}
                        initial={{ opacity: 0, x: (language === 'ar' ? 20 : -20) }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 flex flex-col md:flex-row gap-8 hover:border-accent/30 transition-all group ${language === 'ar' ? 'md:flex-row-reverse text-right' : ''}`}
                    >
                        <div className="w-full md:w-48 h-48 rounded-[2rem] overflow-hidden relative shrink-0">
                            <img src={offer.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                <span className="text-white font-black text-lg">{language === 'ar' ? offer.discountAr || offer.discount : offer.discount}</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className={`flex justify-between items-start mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-widest">
                                            <Tag size={12} /> {language === 'ar' ? 'حملة' : 'Campaign'}
                                        </div>
                                        {offer.isExclusiveHome && (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest" title="Homepage">
                                                <Eye size={12} /> {language === 'ar' ? 'الصفحة الرئيسية' : 'Homepage'}
                                            </div>
                                        )}
                                        {offer.isShowList && (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-[10px] font-black uppercase tracking-widest" title="Offers List">
                                                <CheckCircle size={12} /> {language === 'ar' ? 'قائمة العروض' : 'List'}
                                            </div>
                                        )}
                                        {offer.isPromoCarousel && (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-widest" title="Promo Carousel">
                                                <Sparkles size={12} /> {language === 'ar' ? 'الشريط المتحرك' : 'Carousel'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(offer)} className="p-2 text-gray-500 hover:text-white transition-colors"><Edit3 size={18} /></button>
                                        <button onClick={() => deleteOffer(offer._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 leading-tight uppercase">
                                    {language === 'ar' ? offer.titleAr || offer.title : offer.title}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-4">
                                    {language === 'ar' ? offer.descriptionAr || offer.description : offer.description}
                                </p>
                            </div>

                            <div className={`pt-6 border-t border-white/5 flex flex-wrap gap-6 items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex items-center gap-2 text-xs font-bold text-gray-400 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <Store size={16} className="text-accent" />
                                    {offer.restaurant?.name || (language === 'ar' ? 'عام' : 'Global')}
                                </div>
                                <div className={`flex items-center gap-2 text-xs font-bold text-gray-400 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <Calendar size={16} className="text-accent" />
                                    {new Date(offer.expiryDate).toLocaleDateString(language === 'ar' ? 'ar-JO' : 'en-US')}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal - Expanded Fields */}
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
                            <div className="p-10 border-b border-white/5 bg-primary/20">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                    {editingOffer ? t.edit : (language === 'ar' ? 'إنشاء' : 'Create')} <span className="text-accent">{language === 'ar' ? 'حملة' : 'Campaign'}</span>
                                </h2>
                            </div>

                            <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'العنوان (EN)' : 'Title (EN)'}</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'العنوان (AR)' : 'Title (AR)'}</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                            value={formData.titleAr} onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'الخصم (EN)' : 'Discount Label (EN)'}</label>
                                        <input
                                            type="text" placeholder="20% OFF"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                            value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'الخصم (AR)' : 'Discount Label (AR)'}</label>
                                        <input
                                            type="text" placeholder="خصم ٢٠٪"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                            value={formData.discountAr} onChange={e => setFormData({ ...formData, discountAr: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'الوصف (EN)' : 'Description (EN)'}</label>
                                        <textarea
                                            rows="2"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent resize-none"
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'الوصف (AR)' : 'Description (AR)'}</label>
                                        <textarea
                                            rows="2"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent resize-none"
                                            value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'رابط الصورة (Promo)' : 'Image URL (Promo)'}</label>
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                        value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{language === 'ar' ? 'المطعم' : 'Restaurant'}</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent appearance-none"
                                            value={formData.restaurant} onChange={e => setFormData({ ...formData, restaurant: e.target.value })}
                                        >
                                            <option value="" className="bg-secondary">{language === 'ar' ? 'عام' : 'Global'}</option>
                                            {restaurants.map(r => (
                                                <option key={r._id} value={r._id} className="bg-secondary">{r.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.expiryDate}</label>
                                        <input
                                            type="date"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent"
                                            value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">{language === 'ar' ? 'إعدادات الظهور' : 'Display Settings'}</p>

                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Homepage Spotlight */}
                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:border-accent/20 transition-colors">
                                            <div className="space-y-1">
                                                <p className="text-white font-black text-sm uppercase tracking-tight">{language === 'ar' ? 'عرض حصري (Homepage)' : 'Home Spotlight'}</p>
                                                <p className="text-gray-500 text-[10px]">{language === 'ar' ? 'سيظهر في صدارة الصفحة الرئيسية' : 'Featured in homepage spotlights'}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isExclusiveHome: !formData.isExclusiveHome })}
                                                className={`w-14 h-8 rounded-full flex items-center px-1 transition-all duration-500 ${formData.isExclusiveHome ? 'bg-green-500 justify-end' : 'bg-gray-700 justify-start'}`}
                                            >
                                                <motion.div
                                                    layout
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                                                />
                                            </button>
                                        </div>

                                        {/* Offers List */}
                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:border-accent/20 transition-colors">
                                            <div className="space-y-1">
                                                <p className="text-white font-black text-sm uppercase tracking-tight">{language === 'ar' ? 'عرض جديد (Offers List)' : 'New in List'}</p>
                                                <p className="text-gray-500 text-[10px]">{language === 'ar' ? 'سيظهر في القائمة الرئيسية لصفحة العروض' : 'Show in the main scrollable list of offers'}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isShowList: !formData.isShowList })}
                                                className={`w-14 h-8 rounded-full flex items-center px-1 transition-all duration-500 ${formData.isShowList ? 'bg-green-500 justify-end' : 'bg-gray-700 justify-start'}`}
                                            >
                                                <motion.div
                                                    layout
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                                                />
                                            </button>
                                        </div>

                                        {/* Promo Carousel */}
                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:border-accent/20 transition-colors">
                                            <div className="space-y-1">
                                                <p className="text-white font-black text-sm uppercase tracking-tight">{language === 'ar' ? 'عرض خاص (Carousel)' : 'Special Carousel'}</p>
                                                <p className="text-gray-500 text-[10px]">{language === 'ar' ? 'سيظهر في شريط العروض المميزة بالأعلى' : 'Featured in the high-end scrolling carousel'}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isPromoCarousel: !formData.isPromoCarousel })}
                                                className={`w-14 h-8 rounded-full flex items-center px-1 transition-all duration-500 ${formData.isPromoCarousel ? 'bg-green-500 justify-end' : 'bg-gray-700 justify-start'}`}
                                            >
                                                <motion.div
                                                    layout
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-10 bg-primary/20 flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">{t.cancel}</button>
                                <button type="submit" className="flex-1 bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-accent/20 hover:scale-[1.02] transition-all">
                                    {language === 'ar' ? 'تحديث ونشر الحملة' : 'Update & Deploy Campaign'}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
