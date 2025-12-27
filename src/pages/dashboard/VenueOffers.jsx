import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Plus, Search, Filter,
    Calendar, Store, Clock, Trash2,
    Edit3, CheckCircle, AlertCircle, Eye,
    Sparkles, ArrowRight, Save, X, Megaphone, Zap
} from 'lucide-react';
import { useOffers } from '../../context/OfferContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRestaurants } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function VenueOffers() {
    const { offers, loading, fetchVenueOffers, addOffer, updateOffer, deleteOffer } = useOffers();
    const { restaurants } = useRestaurants();
    const { language, t } = useLanguage();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [myRestaurant, setMyRestaurant] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '', titleAr: '',
        description: '', descriptionAr: '',
        discount: '', discountAr: '',
        expiryDate: '',
        imageUrl: '',
        active: true
    });

    useEffect(() => {
        if (user && restaurants && restaurants.length > 0) {
            const userId = user._id || user.id;
            // Only find restaurant where the current user is the owner
            const res = restaurants.find(r => r.ownerId === userId);
            if (res) {
                setMyRestaurant(res);
                fetchVenueOffers(res._id);
            } else {
                // No restaurant found for this user
                setMyRestaurant(null);
            }
        }
    }, [user, restaurants, fetchVenueOffers]);

    const handleEdit = (offer) => {
        setEditingOffer(offer);
        setFormData({
            title: offer.title,
            titleAr: offer.titleAr,
            description: offer.description,
            descriptionAr: offer.descriptionAr,
            discount: offer.discount || '',
            discountAr: offer.discountAr || '',
            expiryDate: offer.expiryDate ? new Date(offer.expiryDate).toISOString().split('T')[0] : '',
            imageUrl: offer.imageUrl || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
            active: offer.active
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!myRestaurant) {
            addToast(language === 'ar' ? 'خطأ: لم يتم العثور على منشأتك. يرجى التحديث.' : 'Error: Venue not found. Please refresh.', 'error');
            return;
        }

        setSaving(true);
        try {
            const data = {
                ...formData,
                restaurantId: myRestaurant._id,
                restaurantName: myRestaurant.name,
                isShowList: true,
                isExclusiveHome: false,
                isPromoCarousel: false
            };

            const res = editingOffer
                ? await updateOffer(editingOffer._id, data)
                : await addOffer(data);

            if (res.success) {
                addToast(editingOffer ? t.changesSaved : (language === 'ar' ? 'تم نشر العرض بنجاح!' : 'Offer published successfully!'), 'success');
                setIsModalOpen(false);
                setEditingOffer(null);
                fetchVenueOffers(myRestaurant._id);
            } else {
                addToast(res.message || (language === 'ar' ? 'فشل في حفظ العرض' : 'Failed to save offer'), 'error');
            }
        } catch (error) {
            console.error("Save error:", error);
            addToast(error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header section with Marketing Focus */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Megaphone size={20} />
                        </div>
                        <h1 className="text-3xl font-heading font-black uppercase tracking-tight text-white">{t.marketingHub}</h1>
                    </div>
                    <p className="text-gray-500 text-sm font-medium opacity-70 ml-1">{t.venueOffersDesc}</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setEditingOffer(null);
                        setFormData({
                            title: '', titleAr: '',
                            description: '', descriptionAr: '',
                            discount: '', discountAr: '',
                            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
                            active: true
                        });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl shadow-accent/20 hover:bg-highlight"
                >
                    <Plus size={18} />
                    {t.addNewOffer || 'Create New Offer'}
                </motion.button>
            </div>

            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full h-64 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : offers.map((offer, i) => (
                    <motion.div
                        key={offer._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden hover:border-accent/40 transition-all group shadow-2xl"
                    >
                        <div className="flex flex-col sm:flex-row h-full">
                            {/* Image Part */}
                            <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden relative">
                                <img src={offer.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                <div className="absolute inset-0 bg-accent/20 group-hover:bg-transparent transition-colors duration-500" />
                                <div className="absolute top-4 left-4">
                                    <div className="bg-accent text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-xl">
                                        {language === 'ar' ? offer.discountAr : offer.discount}
                                    </div>
                                </div>
                            </div>

                            {/* Info Part */}
                            <div className="flex-1 p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${offer.active ? 'text-emerald-500' : 'text-gray-500'}`}>
                                            <Zap size={14} />
                                            {offer.active ? (language === 'ar' ? 'فعال حالياً' : 'Live Now') : (language === 'ar' ? 'متوقف' : 'Paused')}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(offer)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => deleteOffer(offer._id)} className="p-2.5 bg-white/5 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                        {language === 'ar' ? offer.titleAr : offer.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                        {language === 'ar' ? offer.descriptionAr : offer.description}
                                    </p>
                                </div>

                                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <Calendar size={14} className="text-accent/60" />
                                        {t.offerExpiry}: {new Date(offer.expiryDate).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={() => window.open(`/offers`, '_blank')}
                                        className="text-accent hover:text-white transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {offers.length === 0 && !loading && (
                    <div className="col-span-full py-24 text-center border-4 border-dashed border-white/5 rounded-[4rem]">
                        <Megaphone size={48} className="mx-auto text-gray-700 mb-6 opacity-20" />
                        <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest">{t.noResults}</h3>
                        <p className="text-sm text-gray-600 mt-2">{language === 'ar' ? 'ابدأ بجذب الزبائن عبر إنشاء أول عرض ترويجي لك!' : 'Start attracting guests by creating your first promotion!'}</p>
                    </div>
                )}
            </div>

            {/* Modal for Create/Edit */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.form
                            onSubmit={handleSave}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative bg-secondary/80 border border-white/10 w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                        >
                            <div className="p-12 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <span className="text-accent font-black text-[10px] uppercase tracking-[0.4em] block mb-2">{language === 'ar' ? 'حملة تسويقية' : 'MARKETING CAMPAIGN'}</span>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                        {editingOffer ? t.editOffer : t.addOffer}
                                    </h2>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-12 space-y-8 max-h-[60vh] overflow-y-auto premium-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">{language === 'ar' ? 'العنوان (EN)' : 'Campaign Title (EN)'}</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-primary/50 border-2 border-white/5 rounded-3xl py-5 px-8 text-white focus:border-accent outline-none font-bold"
                                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">{language === 'ar' ? 'العنوان (AR)' : 'عنوان الحملة (بالعربي)'}</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-primary/50 border-2 border-white/5 rounded-3xl py-5 px-8 text-white focus:border-accent outline-none font-bold text-right" dir="rtl"
                                            value={formData.titleAr} onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">{language === 'ar' ? 'قيمة الخصم (EN)' : 'Discount Label (EN)'}</label>
                                        <input
                                            type="text" required placeholder="e.g. 20% OFF"
                                            className="w-full bg-primary/50 border-2 border-white/5 rounded-3xl py-5 px-8 text-white focus:border-accent outline-none font-black"
                                            value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">{language === 'ar' ? 'قيمة الخصم (AR)' : 'قيمة الخصم (بالعربي)'}</label>
                                        <input
                                            type="text" required placeholder="مثال: خصم ٢٠٪"
                                            className="w-full bg-primary/50 border-2 border-white/5 rounded-3xl py-5 px-8 text-white focus:border-accent outline-none font-black text-right" dir="rtl"
                                            value={formData.discountAr} onChange={e => setFormData({ ...formData, discountAr: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">{t.expiryDate}</label>
                                    <input
                                        type="date" required
                                        className="w-full bg-primary/50 border-2 border-white/5 rounded-3xl py-5 px-8 text-white focus:border-accent outline-none font-bold"
                                        value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">{t.descriptionLabel} (EN)</label>
                                        <textarea
                                            rows="3"
                                            className="w-full bg-primary/50 border-2 border-white/5 rounded-[2rem] py-5 px-8 text-white focus:border-accent outline-none resize-none font-medium leading-relaxed"
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2 text-right block">{t.descriptionLabel} (AR)</label>
                                        <textarea
                                            rows="3"
                                            className="w-full bg-primary/50 border-2 border-white/5 rounded-[2rem] py-5 px-8 text-white focus:border-accent outline-none resize-none font-medium leading-relaxed text-right" dir="rtl"
                                            value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                                    className="flex items-center gap-4 group cursor-pointer"
                                >
                                    <div className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.active ? 'bg-accent' : 'bg-white/10'
                                        }`}>
                                        <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-all ${formData.active ? (language === 'ar' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                                            }`} />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-white">{formData.active ? (language === 'ar' ? 'العرض فعال ومباشر' : 'Live and Active') : (language === 'ar' ? 'عرض متوقف' : 'Paused')}</span>
                                </button>
                            </div>

                            <div className="p-12 bg-white/[0.02] flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">{t.cancel}</button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-accent text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-accent/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            {editingOffer ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'نشر العرض الآن' : 'Publish Offer Now')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const ExternalLink = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);
