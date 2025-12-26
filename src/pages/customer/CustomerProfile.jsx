import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useRestaurants } from '../../context/RestaurantContext';
import {
    Heart, Bell, Clock, Settings, ChevronRight,
    LogOut, MapPin, Star, Trash2, ExternalLink,
    Sparkles, Tag, Coffee, UtensilsCrossed, DollarSign,
    Mail, User
} from 'lucide-react';

export default function CustomerProfile() {
    const { t, language } = useLanguage();
    const { user, logout, updateProfile, toggleFavorite } = useAuth();
    const { restaurants } = useRestaurants();
    const navigate = useNavigate();

    // Local state for customer features
    const [favorites, setFavorites] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [preferences, setPreferences] = useState({
        venueType: 'all', // 'all', 'restaurant', 'cafe'
        priceRange: 'all', // 'all', '$', '$$', '$$$', '$$$$'
        cuisineTypes: []
    });

    // Load data
    useEffect(() => {
        const savedRecent = JSON.parse(localStorage.getItem('tableease_recently_viewed') || '[]');
        const savedPrefs = JSON.parse(localStorage.getItem('tableease_preferences') || 'null');

        // Match favorites with restaurant data from AuthContext
        if (user?.favorites && restaurants.length > 0) {
            const matchedFavorites = user.favorites
                .map(id => restaurants.find(r => r._id === id || r.id === id))
                .filter(Boolean);
            setFavorites(matchedFavorites);
        } else {
            setFavorites([]);
        }

        // Match recently viewed
        const matchedRecent = savedRecent
            .map(id => restaurants.find(r => r._id === id || r.id === id))
            .filter(Boolean)
            .slice(0, 5);

        setRecentlyViewed(matchedRecent);

        if (savedPrefs) {
            setPreferences(savedPrefs);
        }

        // Demo notifications
        setNotifications([
            { id: 1, type: 'offer', title: t.newOfferAlert || 'New Offer!', message: '20% off at The Summit', time: '2h', read: false },
            { id: 2, type: 'favorite', title: t.favoriteUpdate || 'Favorite Update', message: 'Café Cacao added new items', time: '1d', read: true },
        ]);
    }, [restaurants, user?.favorites]);

    const removeFavorite = async (id) => {
        await toggleFavorite(id);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const savePreferences = (newPrefs) => {
        setPreferences(newPrefs);
        localStorage.setItem('tableease_preferences', JSON.stringify(newPrefs));
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="py-6"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Premium Welcome Card - Precision Engineered Layout */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-[2.5rem] p-8 md:p-10 lg:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5"
                    >
                        {/* High-End Background Effects */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                            {/* User Profile Section */}
                            <div className="flex flex-col md:flex-row items-center gap-8 w-full xl:w-auto">
                                <div className="relative group">
                                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2rem] border-4 border-white/10 overflow-hidden shadow-2xl bg-white/5 group-hover:border-accent/50 transition-colors">
                                        <img
                                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=D4A574&color=fff&size=200`}
                                            alt="Profile"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 bg-green-500 border-4 border-[#1a1a2e] rounded-full shadow-lg"></div>
                                </div>

                                <div className="space-y-2 text-center md:text-start">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">
                                            {t.roleCustomer || 'Customer'}
                                        </span>
                                        <span className="text-white/40 text-xs font-medium">{t.welcomeBack || 'Welcome Back'}</span>
                                    </div>
                                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black font-heading tracking-tight leading-tight">
                                        {user?.username || t.guest || 'Guest'}
                                    </h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/30 text-sm">
                                        <Mail size={14} />
                                        <span className="truncate max-w-[200px]">{user?.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Separator Line */}
                            <div className="hidden xl:block w-px h-24 bg-white/10 mx-6"></div>
                            <div className="w-full h-px bg-white/10 xl:hidden"></div>

                            {/* Balanced Stats Section */}
                            <div className="grid grid-cols-2 gap-8 md:gap-16 w-full xl:w-auto">
                                <div className="flex flex-col items-center xl:items-start gap-2">
                                    <span className="text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tighter">
                                        {favorites.length}
                                    </span>
                                    <span className="text-[11px] text-accent/60 uppercase tracking-[0.25em] font-black whitespace-nowrap">
                                        {t.favorites || 'Favorites'}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center xl:items-start gap-2">
                                    <span className="text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tighter">
                                        {recentlyViewed.length}
                                    </span>
                                    <span className="text-[11px] text-accent/60 uppercase tracking-[0.25em] font-black whitespace-nowrap">
                                        {t.recentlyViewed || 'Viewed'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* My Favorites - Grid Layout */}
                    <motion.section variants={itemVariants}>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                    <Heart className="text-red-500" size={22} fill="currentColor" />
                                </div>
                                <h2 className="text-2xl font-bold text-primary">{t.myFavorites || 'My Favorites'}</h2>
                            </div>
                            <Link to="/me/favorites" className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-accent text-sm font-bold flex items-center gap-2 hover:shadow-md transition-all">
                                {t.viewAll || 'View All'} <ChevronRight size={16} />
                            </Link>
                        </div>

                        {favorites.length === 0 ? (
                            <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm">
                                <Heart size={64} className="mx-auto text-gray-100 mb-4" />
                                <p className="text-gray-500 text-lg font-bold">{t.noFavoritesYet || 'No favorites yet'}</p>
                                <Link to="/explore" className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-accent text-white rounded-2xl font-bold shadow-xl shadow-accent/20 hover:scale-105 transition-all">
                                    <Sparkles size={18} /> {t.exploreDining || 'Explore Venues'}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {favorites.slice(0, 4).map((venue, index) => (
                                    <motion.div
                                        key={venue._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-3xl p-4 border border-gray-100 flex gap-4 group hover:shadow-xl hover:border-accent/30 transition-all cursor-pointer overflow-hidden relative"
                                    >
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                                            <img
                                                src={venue.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop'}
                                                alt={language === 'ar' ? venue.nameAr : venue.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h3 className="font-bold text-primary text-lg truncate mb-1">
                                                {language === 'ar' ? venue.nameAr : venue.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                                <span className="flex items-center gap-1 font-bold text-yellow-600">
                                                    <Star size={12} fill="currentColor" /> {venue.rating || '4.8'}
                                                </span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="font-medium">{venue.cuisineType}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link to={`/restaurant/${venue._id}`} className="flex-1 px-3 py-2 bg-accent/10 text-accent rounded-xl text-xs font-bold text-center hover:bg-accent hover:text-white transition-all">
                                                    {t.view || 'View'}
                                                </Link>
                                                <button onClick={() => removeFavorite(venue._id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.section>

                    {/* Recently Viewed */}
                    <motion.section variants={itemVariants}>
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                <Clock size={22} />
                            </div>
                            <h2 className="text-2xl font-bold text-primary">{t.recentlyViewed || 'Recently Viewed'}</h2>
                        </div>

                        {recentlyViewed.length === 0 ? (
                            <div className="bg-white rounded-[2rem] p-8 text-center border border-gray-100">
                                <p className="text-gray-400 font-medium">{t.noRecentViews || 'No recently viewed venues'}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {recentlyViewed.map((venue, index) => (
                                    <Link key={venue._id} to={`/restaurant/${venue._id}`}>
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="group"
                                        >
                                            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg border-2 border-transparent group-hover:border-accent transition-all ring-offset-4 ring-accent/0 group-hover:ring-accent/10 ring-4">
                                                <img
                                                    src={venue.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop'}
                                                    alt={language === 'ar' ? venue.nameAr : venue.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="text-[11px] font-black text-primary mt-3 truncate text-center uppercase tracking-tighter">
                                                {language === 'ar' ? venue.nameAr : venue.name}
                                            </p>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </motion.section>
                </div>

                {/* Right Column: Sidebar (4 cols) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Notifications Panel */}
                    <motion.section variants={itemVariants} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                    <Bell size={20} />
                                </div>
                                <h3 className="font-bold text-primary text-lg">{t.notifications || 'Alerts'}</h3>
                            </div>
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest leading-none">
                                    New
                                </span>
                            )}
                        </div>

                        <div className="space-y-3">
                            {notifications.length > 0 ? (
                                notifications.slice(0, 3).map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 rounded-2xl border transition-all ${notif.read ? 'border-gray-50 bg-gray-50/50' : 'border-accent/10 bg-accent/5'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.type === 'offer' ? 'bg-green-100 text-green-600' : 'bg-accent/10 text-accent'
                                                }`}>
                                                {notif.type === 'offer' ? <Tag size={16} /> : <Heart size={16} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-primary text-xs leading-none mb-1">{notif.title}</p>
                                                <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{notif.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 text-xs py-4">{t.allCaughtUp || "All caught up!"}</p>
                            )}
                            <Link to="/me/notifications" className="block w-full text-center py-3 text-accent text-xs font-bold hover:bg-accent/5 rounded-xl transition-all">
                                {t.viewAllNotifications || 'View All Notifications'}
                            </Link>
                        </div>
                    </motion.section>

                    {/* Quick Settings & Prefs */}
                    <motion.section variants={itemVariants} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                    <Settings size={20} />
                                </div>
                                <h3 className="font-bold text-primary text-lg">{t.preferences || 'Preferences'}</h3>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.venueType || 'Venue Type'}</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { v: 'all', i: Sparkles },
                                            { v: 'restaurant', i: UtensilsCrossed },
                                            { v: 'cafe', i: Coffee }
                                        ].map(item => (
                                            <button
                                                key={item.v}
                                                onClick={() => savePreferences({ ...preferences, venueType: item.v })}
                                                className={`p-3 rounded-xl flex items-center justify-center transition-all ${preferences.venueType === item.v ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <item.i size={16} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 space-y-2">
                            <Link to="/me/settings" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-[1.5rem] group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-400 group-hover:text-primary transition-colors">
                                        <User size={16} />
                                    </div>
                                    <span className="font-bold text-sm text-primary">{t.accountSettings || 'Account Settings'}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-[1.5rem] text-red-500 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-red-400">
                                        <LogOut size={16} />
                                    </div>
                                    <span className="font-bold text-sm">{t.logout || 'Sign Out'}</span>
                                </div>
                            </button>
                        </div>
                    </motion.section>
                </div>
            </div>

            {/* Bottom spacing for mobile nav */}
            <div className="h-12 md:h-0"></div>
        </motion.div>
    );
}
