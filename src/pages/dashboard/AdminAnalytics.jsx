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

export default function AdminAnalytics() {
    const { token } = useAuth();
    const { language, t } = useLanguage();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/10 blur-[60px] rounded-full`}></div>
            <div className={`w-14 h-14 rounded-2xl bg-${color}/20 flex items-center justify-center text-${color} mb-6`}>
                <Icon size={28} />
            </div>
            <p className={`text-gray-400 text-xs font-black uppercase tracking-widest mb-1 ${language === 'ar' ? 'text-right' : ''}`}>{title}</p>
            <div className={`flex items-end gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-4xl font-black text-white tracking-tight" dir="ltr">{value}</h3>
                <span className={`flex items-center gap-1 text-sm font-black mb-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? <TrendingUp size={16} /> : <Activity size={16} />}
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
            {/* Header */}
            <div className={`flex flex-col md:flex-row justify-between items-end gap-6 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                <div className={language === 'ar' ? 'text-right' : ''}>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">
                        {t.analyticsInsights.split(' ')[0]} <span className="text-accent">{t.analyticsInsights.split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-400 font-medium">{t.insightsDesc}</p>
                </div>
                <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <button className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white flex items-center gap-3 hover:bg-white/10 transition-all">
                        <Calendar size={18} /> {t.last30Days}
                    </button>
                    <button className="bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-accent/20">
                        <Download size={18} /> {t.exportReport}
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard title={t.clickRate} value="12.4%" trend={+2.1} icon={MousePointer2} color="accent" />
                <MetricCard title={t.retention} value="68%" trend={-1.5} icon={Users} color="blue-400" />
                <MetricCard title={t.sessionTime} value="4m 12s" trend={+18} icon={Activity} color="purple-400" />
                <MetricCard title={t.socialShares} value="1.2k" trend={+42} icon={Share2} color="green-400" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Traffic Chart */}
                <div className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10">
                    <div className={`flex justify-between items-center mb-10 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
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

                {/* Regional Distribution */}
                <div className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10">
                    <div className={`flex justify-between items-center mb-10 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                            <Globe className="text-blue-400" /> {t.sources}
                        </h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: language === 'ar' ? 'عمان، الأردن' : 'Amman, Jordan', value: 65, color: 'bg-accent' },
                            { name: language === 'ar' ? 'إربد، الأردن' : 'Irbid, Jordan', value: 15, color: 'bg-blue-400' },
                            { name: language === 'ar' ? 'الزرقاء، الأردن' : 'Zarqa, Jordan', value: 12, color: 'bg-purple-400' },
                            { name: language === 'ar' ? 'أخرى' : 'Others', value: 8, color: 'bg-gray-500' },
                        ].map((source, i) => (
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
