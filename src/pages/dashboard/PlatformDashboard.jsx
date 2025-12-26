import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Store, Tag, Eye, TrendingUp, AlertTriangle,
    ArrowUpRight, ArrowDownRight, Calendar, UserPlus,
    Coffee, Star, Ban, ExternalLink, MoreVertical
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function PlatformDashboard() {
    const { token, user } = useAuth();
    const { t, language } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                setStats(result.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-accent/30 transition-all"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/10 blur-[60px] rounded-full group-hover:bg-${color}/20 transition-all`}></div>
            <div className="relative z-10">
                <div className={`flex justify-between items-start mb-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-14 h-14 rounded-2xl bg-${color}/20 flex items-center justify-center text-${color}`}>
                        <Icon size={28} />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-sm font-black ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trend > 0 ? <TrendingUp size={16} /> : <ArrowDownRight size={16} />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <p className={`text-gray-400 text-xs font-black uppercase tracking-widest mb-1 ${language === 'ar' ? 'text-right' : ''}`}>{title}</p>
                <h3 className={`text-4xl font-black text-white tracking-tight ${language === 'ar' ? 'text-right' : ''}`} dir="ltr">{value}</h3>
                {subtitle && <p className={`text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-wider ${language === 'ar' ? 'text-right' : ''}`}>{subtitle}</p>}
            </div>
        </motion.div>
    );

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className={`flex flex-col md:flex-row justify-between items-end gap-6 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                <div className={language === 'ar' ? 'text-right' : ''}>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                        {t.platformControl.split(' ')[0]} <span className="text-accent">{t.platformControl.split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-400 font-medium tracking-wide">
                        {language === 'ar' ? `أهلاً بك مجدداً. إليك نظرة على نظام TableEase.` : `Welcome back, Owner. Here's a snapshot of the TableEase ecosystem.`}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-black uppercase tracking-widest">{t.systemOnline}</span>
                    </div>
                </div>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title={t.totalRestaurants}
                    value={stats?.restaurants + stats?.cafes || 0}
                    icon={Store}
                    color="accent"
                    trend={+12}
                    subtitle={`${stats?.restaurants} ${t.restaurant.toUpperCase()}S / ${stats?.cafes} ${t.cafe.toUpperCase()}S`}
                />
                <StatCard
                    title={t.activeUsers}
                    value={stats?.users || 0}
                    icon={Users}
                    color="blue-400"
                    trend={+5}
                    subtitle={language === 'ar' ? "إجمالي المستخدمين المسجلين" : "TOTAL REGISTERED USERS"}
                />
                <StatCard
                    title={t.platformVisits}
                    value={stats?.visits || 0}
                    icon={Eye}
                    color="purple-400"
                    trend={+28}
                    subtitle={language === 'ar' ? "إجمالي مشاهدات الصفحات" : "TOTAL PAGE VIEWS"}
                />
                <StatCard
                    title={t.activePromotions}
                    value={stats?.activeOffers || 0}
                    icon={Tag}
                    color="green-400"
                    trend={-2}
                    subtitle={language === 'ar' ? "العروض الحصرية النشطة" : "RUNNING EXCLUSIVE OFFERS"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Activities */}
                <div className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10">
                    <div className={`flex justify-between items-center mb-10 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                            <UserPlus className="text-accent" /> {t.recentExplorers}
                        </h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors">{t.seeAll}</button>
                    </div>
                    <div className="space-y-6">
                        {stats?.recentUsers?.map((u, i) => (
                            <div key={i} className={`flex items-center gap-4 group ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                                <img src={`https://ui-avatars.com/api/?name=${u.username}&background=random`} className="w-12 h-12 rounded-2xl border-2 border-white/10" alt="" />
                                <div className="flex-1">
                                    <h4 className="text-white font-black text-sm">{u.username}</h4>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase">{u.email}</p>
                                </div>
                                <span className="text-[10px] font-black text-gray-500 group-hover:text-accent transition-colors">
                                    {new Date(u.createdAt).toLocaleDateString(language === 'ar' ? 'ar-JO' : 'en-US')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Alerts */}
                <div className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10">
                    <div className={`flex justify-between items-center mb-10 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                            <AlertTriangle className="text-red-400" /> {t.platformAlerts}
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className={`bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                                <Ban size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white mb-1">{language === 'ar' ? 'هناك مطاعم بانتظار المراجعة' : '2 Restaurants Pending Review'}</p>
                                <p className="text-xs text-red-400 font-bold uppercase tracking-wider">{t.actionRequired}</p>
                            </div>
                        </div>
                        <div className={`bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-3xl flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white mb-1">{language === 'ar' ? 'عروض ستنتهي قريباً' : '5 Offers Expiring Today'}</p>
                                <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider">{t.manualReview}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
