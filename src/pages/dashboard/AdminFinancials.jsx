import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, CreditCard, TrendingUp, ArrowUpRight,
    Download, Calendar, Wallet, Receipt,
    Briefcase, ShieldCheck, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

import { supabase } from '../../supabaseClient';

export default function AdminFinancials() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { language, t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [finStats, setFinStats] = useState({
        totalRevenue: 0,
        pendingPayouts: 0,
        bookingCount: 0,
        recentTx: []
    });

    useEffect(() => {
        let mounted = true;

        const fetchFinancials = async () => {
            if (authLoading) return;
            if (!isAuthenticated) {
                if (mounted) setLoading(false);
                return;
            }
            try {
                setLoading(true);
                // 1. Fetch Bookings for Revenue calculation (assuming 2.5 JOD per booking as service fee)
                const { data: bookings, count } = await supabase
                    .from('bookings')
                    .select(`
                        id,
                        created_at,
                        status,
                        restaurant:restaurants(name)
                    `, { count: 'exact' });

                // 2. Map to symbolic transactions
                const tx = bookings?.slice(0, 5).map(b => ({
                    name: b.restaurant?.name || 'Booking Fee',
                    date: new Date(b.created_at).toLocaleDateString(language === 'ar' ? 'ar-JO' : 'en-US'),
                    amount: 'JOD 2.50',
                    status: b.status === 'completed' ? 'Completed' : b.status === 'pending' ? 'Pending' : 'Failed'
                })) || [];

                if (mounted) {
                    setFinStats({
                        totalRevenue: (count || 0) * 2.5,
                        pendingPayouts: (bookings?.filter(b => b.status === 'pending').length || 0) * 2.5,
                        bookingCount: count || 0,
                        recentTx: tx
                    });
                }
            } catch (error) {
                console.error("Error fetching financials:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchFinancials();
        return () => { mounted = false; };
    }, [isAuthenticated, authLoading, language]);

    const FinCard = ({ title, value, subtitle, icon: Icon, color }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between h-full"
        >
            <div className={`absolute -top-10 -right-10 w-40 h-40 bg-${color}/10 blur-[80px] rounded-full`}></div>
            <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-${color}/20 flex items-center justify-center text-${color} mb-6`}>
                    <Icon size={28} />
                </div>
                <p className={`text-gray-400 text-xs font-black uppercase tracking-widest mb-2 ${language === 'ar' ? 'text-right' : ''}`}>{title}</p>
                <h3 className={`text-4xl font-black text-white tracking-tight mb-2 ${language === 'ar' ? 'text-right' : ''}`} dir="ltr">{value}</h3>
                <p className={`text-[10px] text-gray-500 font-bold uppercase tracking-wider ${language === 'ar' ? 'text-right' : ''}`}>{subtitle}</p>
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
                        {language === 'ar' ? 'القسم' : 'Financial'} <span className="text-accent">{language === 'ar' ? 'المالي' : 'Dashboard'}</span>
                    </h1>
                    <p className="text-gray-400 font-medium">{t.revenueDesc}</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-accent/20">
                        <Download size={18} /> {t.payoutReport}
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FinCard title={t.estRevenue} value={`JOD ${finStats.totalRevenue.toFixed(2)}`} subtitle={language === 'ar' ? "إجمالي العمولات المحجوزة" : "Total service fees from bookings"} icon={DollarSign} color="accent" />
                <FinCard title={t.activeBookings || 'Active Bookings'} value={finStats.bookingCount} subtitle={language === 'ar' ? "إجمالي عدد الحجوزات" : "Total number of bookings"} icon={Activity} color="blue-400" />
                <FinCard title={t.payouts} value={`JOD ${finStats.pendingPayouts.toFixed(2)}`} subtitle={language === 'ar' ? "عمولات قيد الانتظار" : "Fees from pending bookings"} icon={Wallet} color="purple-400" />
            </div>

            {/* Transactions / Subscriptions Table */}
            <div className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden">
                <div className={`p-10 border-b border-white/5 flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Receipt className="text-accent" /> {t.transactions}
                    </h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-accent transition-colors">{t.seeAll}</button>
                </div>
                <div className="overflow-x-auto">
                    <table className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{t.serviceEntity}</th>
                                <th className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{t.date}</th>
                                <th className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{t.amount}</th>
                                <th className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{t.status}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finStats.recentTx.map((tx, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                                                <Briefcase size={18} />
                                            </div>
                                            <span className="text-white font-black text-sm">{tx.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-gray-400 text-sm font-medium">{tx.date}</td>
                                    <td className="px-10 py-6 text-white font-black text-sm">{tx.amount}</td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${tx.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            tx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {tx.status === 'Completed' ? (language === 'ar' ? 'ناجح' : 'Completed') :
                                                tx.status === 'Pending' ? (language === 'ar' ? 'معلق' : 'Pending') :
                                                    (language === 'ar' ? 'فشل' : 'Failed')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
