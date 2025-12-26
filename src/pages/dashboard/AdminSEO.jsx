import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Globe, Search, Save, Settings,
    Smartphone, Monitor, Share2,
    Image as ImageIcon, Type, Link,
    CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSEO() {
    const { token } = useAuth();
    const { language, t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className={`flex flex-col md:flex-row justify-between items-end gap-6 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                <div className={language === 'ar' ? 'text-right' : ''}>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">
                        {t.contentSEO.split(' ')[0]} <span className="text-accent">{t.contentSEO.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-gray-400 font-medium">{t.seoDesc}</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-accent/20"
                >
                    {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                    {saved ? (language === 'ar' ? 'تم الحفظ' : 'Settings Saved') : t.saveChanges}
                </button>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 ${language === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
                {/* Global Meta Tags */}
                <div className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 space-y-8">
                    <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Type className="text-accent" /> {t.metaConfig}
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest text-gray-500 block ${language === 'ar' ? 'text-right' : ''}`}>{t.siteTitle}</label>
                            <input type="text" defaultValue="TableEase • Jordan's Smart Dining Revolution" className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent transition-all ${language === 'ar' ? 'text-right' : ''}`} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest text-gray-500 block ${language === 'ar' ? 'text-right' : ''}`}>{t.siteDesc}</label>
                            <textarea rows="4" defaultValue="Discover, book, and enjoy the best restaurants in Jordan with TableEase. Exclusive offers and seamless booking." className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent transition-all resize-none ${language === 'ar' ? 'text-right' : ''}`} />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest text-gray-500 block ${language === 'ar' ? 'text-right' : ''}`}>{t.keywords}</label>
                            <input type="text" defaultValue="dining, amman, jordan, booking, restaurants, cafes" className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-accent transition-all ${language === 'ar' ? 'text-right' : ''}`} />
                        </div>
                    </div>
                </div>

                {/* Social Preview */}
                <div className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 space-y-8">
                    <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Share2 className="text-blue-400" /> {t.preview}
                    </h3>

                    <div className="bg-secondary rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                        <div className="h-48 bg-primary relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" className="w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10 flex items-center gap-2">
                                    <ImageIcon size={16} /> OpenGraph Image
                                </span>
                            </div>
                        </div>
                        <div className={`p-8 space-y-2 ${language === 'ar' ? 'text-right' : ''}`}>
                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">tableease.com</p>
                            <h4 className="text-white font-black text-xl">TableEase • Jordan's Smart Dining Revolution</h4>
                            <p className="text-gray-500 text-sm line-clamp-2">Discover, book, and enjoy the best restaurants in Jordan with TableEase.</p>
                        </div>
                    </div>

                    <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2">
                            <Smartphone size={16} /> {language === 'ar' ? 'معاينة الجوال' : 'Mobile Preview'}
                        </button>
                        <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2">
                            <Monitor size={16} /> {language === 'ar' ? 'معاينة المكتب' : 'Desktop Preview'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
