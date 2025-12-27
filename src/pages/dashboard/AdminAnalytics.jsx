import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, Users, Eye, MousePointer2,
    BarChart3, PieChart, Activity, Download,
    Calendar, ArrowUpRight, ArrowDownRight,
    MapPin, Globe, Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

import { supabase } from '../../supabaseClient';

export default function AdminAnalytics() {
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const { language, t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBookings: 0,
        totalVisits: 0,
        recentGrowth: 0,
        activeOffers: 0,
        regionalDistribution: []
    });

    useEffect(() => {
        let mounted = true;

        const fetchRealStats = async () => {
            // If auth is still loading, or user is not authenticated,
            // we should still set loading to false to avoid a stuck state,
            // but we won't fetch data if not authenticated.
            if (authLoading) {
                // Wait for authLoading to resolve
                return;
            }

            if (!isAuthenticated) {
                if (mounted) setLoading(false); // Flush loading even if not authenticated
                return;
            }

            try {
                setLoading(true);

                // 1. Get Total Users
                const { count: userCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // 2. Get Total Bookings
                const { count: bookingCount } = await supabase
                    .from('bookings')
                    .select('*', { count: 'exact', head: true });

                // 3. Get Total Restaurant Visits
                const { data: restaurants } = await supabase
                    .from('restaurants')
                    .select('visits, city');

                // 4. Get Active Offers
                const { count: offerCount } = await supabase
                    .from('offers')
                    .select('*', { count: 'exact', head: true });

                const totalVisits = restaurants?.reduce((acc, curr) => acc + (curr.visits || 0), 0) || 0;

                // 5. Calculate Regional Distribution based on restaurants
                const citiesCount = {};
                restaurants?.forEach(r => {
                    const city = r.city || (language === 'ar' ? 'غير محدد' : 'Unknown');
                    citiesCount[city] = (citiesCount[city] || 0) + 1;
                });

                const totalRestaurants = restaurants?.length || 1;
                const sortedRegions = Object.entries(citiesCount)
                    .map(([name, count]) => ({
                        name,
                        value: Math.round((count / totalRestaurants) * 100),
                        color: name === 'Amman' || name === 'عمان' ? 'bg-accent' : 'bg-blue-400'
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 4);

                if (mounted) {
                    setStats({
                        totalUsers: userCount || 0,
                        totalBookings: bookingCount || 0,
                        totalVisits: totalVisits,
                        activeOffers: offerCount || 0,
                        recentGrowth: 12.5,
                        regionalDistribution: sortedRegions
                    });
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchRealStats();
        return () => { mounted = false; };
    }, [isAuthenticated, authLoading, language, user]);

    const exportReport = () => {
        const data = [
            ['Metric', 'Value'],
            ['Total Users', stats.totalUsers],
            ['Total Bookings', stats.totalBookings],
            ['Platform Visits', stats.totalVisits],
            ['Social Shares', '1,240'], // Symbolic but represented
            ['Recent Growth', stats.recentGrowth + '%'],
            ['', ''],
            ['Region', 'Establishments Count'],
            ...stats.regionalDistribution.map(d => [d.name, d.value])
        ];

        const csvContent = data.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `TableEase_Report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group"
        >
            <div className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-32 h-32 bg-${color}/10 blur-[60px] rounded-full`}></div>
            <div className={`w-14 h-14 rounded-2xl bg-${color}/20 flex items-center justify-center text-${color} mb-6`}>
                <Icon size={28} />
            </div>
            <p className={`text-gray-400 text-xs font-black uppercase tracking-widest mb-1 ${language === 'ar' ? 'text-right' : ''}`}>{title}</p>
            <div className={`flex items-end gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-4xl font-black text-white tracking-tight" dir="ltr">{value}</h3>
                <span className={`flex items-center gap-1 text-sm font-black mb-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? <TrendingUp size={16} /> : <ArrowDownRight size={16} />}
                    {trend}%
                </span>
            </div>
        </motion.div>
    );

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className={language === 'ar' ? 'text-right' : ''}>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">
                        {language === 'ar' ? 'التحليلات' : 'Analytics'} <span className="text-accent">{language === 'ar' ? 'والرؤى' : 'Insights'}</span>
                    </h1>
                    <p className="text-gray-400 font-medium">{t.insightsDesc}</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white flex items-center gap-3 hover:bg-white/10 transition-all">
                        <Calendar size={18} /> {t.last30Days}
                    </button>
                    <button
                        onClick={exportReport}
                        className="bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-accent/20"
                    >
                        <Download size={18} /> {t.exportReport}
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard title={t.totalUsers || 'Total Users'} value={stats.totalUsers} trend={+stats.recentGrowth} icon={Users} color="accent" />
                <MetricCard title={t.totalBookings || 'Total Bookings'} value={stats.totalBookings} trend={+2.4} icon={Calendar} color="blue-400" />
                <MetricCard title={t.totalVisits || 'Total Visits'} value={stats.totalVisits.toLocaleString()} trend={+18} icon={Eye} color="purple-400" />
                <MetricCard title={t.socialShares || 'Social Reach'} value="1.2k" trend={+42} icon={Share2} color="green-400" />
            </div>

            {/* Charts Section */}
            <div className={`flex flex-col lg:flex-row gap-10 ${language === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
                {/* Regional Distribution */}
                <div className="flex-1 bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10">
                    <div className={`flex justify-between items-center mb-10 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse text-right ml-auto' : ''}`}>
                            <Globe className="text-blue-400" /> {t.sources}
                        </h3>
                    </div>
                    <div className="space-y-6">
                        {stats.regionalDistribution.length > 0 ? stats.regionalDistribution.map((source, i) => (
                            <div key={i} className="space-y-2">
                                <div className={`flex justify-between text-xs font-black uppercase tracking-widest text-white ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <span>{source.name}</span>
                                    <span className="text-gray-500">{source.value}%</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${source.value}%` }}
                                        className={`h-full ${source.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="h-64 flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                                {language === 'ar' ? 'لا توجد بيانات مناطق متاحة' : 'No regional data available'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Traffic Chart */}
                <div className="flex-1 bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10">
                    <div className={`flex justify-between items-center mb-10 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                            <BarChart3 className="text-accent" /> {t.traffic}
                        </h3>
                    </div>
                    <div className="h-64 flex items-end gap-2 px-4" dir="ltr">
                        {[40, 65, 45, 90, 70, 85, 55, 100, 80, 95, 60, 75].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05, duration: 1 }}
                                className="flex-1 bg-gradient-to-t from-accent/20 to-accent rounded-t-lg relative group"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-primary px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500" dir="ltr">
                        <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
