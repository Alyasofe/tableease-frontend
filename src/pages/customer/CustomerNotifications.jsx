import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, Tag, Heart, CheckCircle, Trash2, Settings } from 'lucide-react';

export default function CustomerNotifications() {
    const { t } = useLanguage();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Load notifications (demo data for now)
        setNotifications([
            {
                id: 1,
                type: 'offer',
                title: t.newOfferAlert || 'New Exclusive Offer!',
                message: '20% off at The Summit this weekend only!',
                time: '2 hours ago',
                read: false,
                actionUrl: '/offers'
            },
            {
                id: 2,
                type: 'favorite',
                title: t.favoriteUpdate || 'Favorite Update',
                message: 'Café Cacao added new items to their menu',
                time: '1 day ago',
                read: false,
                actionUrl: '/restaurant/123'
            },
            {
                id: 3,
                type: 'offer',
                title: t.offerExpiring || 'Offer Expiring Soon!',
                message: 'Last chance: 15% off at Levant Kitchen ends tomorrow',
                time: '2 days ago',
                read: true,
                actionUrl: '/offers'
            },
            {
                id: 4,
                type: 'system',
                title: t.welcomeToTableEase || 'Welcome to TableEase!',
                message: 'Start exploring amazing restaurants and cafes near you',
                time: '3 days ago',
                read: true,
                actionUrl: '/explore'
            },
        ]);
    }, [t]);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'offer': return <Tag size={18} />;
            case 'favorite': return <Heart size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'offer': return 'bg-green-100 text-green-600';
            case 'favorite': return 'bg-red-100 text-red-500';
            default: return 'bg-accent/10 text-accent';
        }
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
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notif.id);
                                            }}
                                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Clear All */}
            {notifications.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center pt-4"
                >
                    <button
                        onClick={clearAll}
                        className="text-gray-400 text-sm hover:text-red-500 transition-colors"
                    >
                        {t.clearAllNotifications || 'Clear all notifications'}
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}
