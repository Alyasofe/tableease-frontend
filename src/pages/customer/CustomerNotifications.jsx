import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Tag, Heart, CheckCircle, Trash2, Settings } from 'lucide-react';

export default function CustomerNotifications() {
    const { t } = useLanguage();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [filter, setFilter] = useState('all');

    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.is_read)
            : notifications.filter(n => n.type === filter);

    const getNotificationIcon = (type) => {
        // Simple mapping based on type string used in backend
        if (type.includes('offer')) return <Tag size={18} />;
        if (type.includes('booking')) return <CheckCircle size={18} />;
        return <Bell size={18} />;
    };

    const getNotificationColor = (type) => {
        if (type.includes('booking_confirmed')) return 'bg-green-100 text-green-600';
        if (type.includes('booking_cancelled') || type.includes('booking_rejected')) return 'bg-red-100 text-red-500';
        return 'bg-accent/10 text-accent';
    };



    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-6 space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/10 rounded-2xl relative">
                        <Bell className="text-accent" size={24} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-primary">{t.notifications || 'Notifications'}</h1>
                        <p className="text-gray-500 text-sm">{unreadCount} {t.unread || 'unread'}</p>
                    </div>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-1.5 px-3 py-2 text-accent font-bold text-sm hover:bg-accent/10 rounded-xl transition-colors"
                    >
                        <CheckCircle size={16} /> {t.markAllRead || 'Mark all read'}
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { value: 'all', label: t.all || 'All' },
                    { value: 'unread', label: t.unread || 'Unread' },
                    { value: 'offer', label: '🎁 ' + (t.offers || 'Offers') },
                    { value: 'favorite', label: '❤️ ' + (t.favorites || 'Favorites') },
                ].map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === f.value
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-500 border border-gray-100 hover:border-primary/20'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-10 text-center border border-gray-100"
                >
                    <Bell size={64} className="mx-auto text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-primary mb-2">{t.noNotifications || 'No notifications'}</h3>
                    <p className="text-gray-400">{t.allCaughtUp || "You're all caught up!"}</p>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notif, index) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => markAsRead(notif.id)}
                            className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all hover:shadow-md ${notif.read
                                ? 'border-gray-100'
                                : 'border-accent/30 bg-gradient-to-r from-accent/5 to-transparent'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2.5 rounded-xl ${getNotificationColor(notif.type)}`}>
                                    {getNotificationIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className={`font-bold text-primary ${!notif.read ? 'text-primary' : 'text-gray-600'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{notif.message}</p>
                                        </div>
                                        {!notif.read && (
                                            <span className="w-2.5 h-2.5 bg-accent rounded-full flex-shrink-0 mt-1.5"></span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs text-gray-400">{notif.time}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}


        </motion.div>
    );
}
