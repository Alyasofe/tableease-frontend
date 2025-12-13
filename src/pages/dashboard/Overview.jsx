import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Users, DollarSign, Eye, Star, TrendingUp } from 'lucide-react';

import { useBookings } from '../../context/BookingContext';

export default function DashboardOverview() {
    const { t } = useLanguage();
    const { bookings } = useBookings();

    // Calculate simple stats
    const totalBookings = bookings.length;
    const revenue = bookings.filter(b => b.paymentStatus === 'paid').length * 10; // Assuming 10 JOD deposit
    const recentGrowth = bookings.filter(b => b.status === 'confirmed').length;

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={64} />
            </div>
            <div className="relative z-10">
                <p className="text-gray-400 text-sm mb-1">{title}</p>
                <h3 className="text-3xl font-bold font-heading text-white">{value}</h3>
                <div className="flex items-center gap-1 mt-4 text-xs font-bold text-green-400">
                    <TrendingUp size={12} />
                    <span>{trend}</span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold mb-2">{t.dashboard}</h1>
                <p className="text-gray-400">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title={t.stats.totalBookings} value={totalBookings} icon={Users} color="text-blue-500" trend={`${recentGrowth} new`} />
                <StatCard title={t.stats.revenue} value={`${revenue} JOD`} icon={DollarSign} color="text-green-500" trend="+0% from last week" />
                <StatCard title={t.stats.views} value="0" icon={Eye} color="text-purple-500" trend="No data yet" />
                <StatCard title={t.stats.rating} value="-" icon={Star} color="text-yellow-500" trend="No ratings" />
            </div>

            {/* Recent Activity Graph Placeholder */}
            <div className="bg-primary border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6">{t.overview} (Activity)</h3>
                <div className="h-48 flex items-end gap-2 justify-between">
                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.1 }}
                            className="flex-1 bg-gradient-to-t from-accent/20 to-accent rounded-t-lg hover:from-accent hover:to-white transition-all cursor-pointer relative group"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-primary text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {h * 10}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
