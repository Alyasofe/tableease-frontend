import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRestaurants } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, Star, ExternalLink, Trash2, Search, Filter, Sparkles, MapPin, Utensils, Coffee } from 'lucide-react';

export default function CustomerFavorites() {
    const { t, language } = useLanguage();
    const { restaurants } = useRestaurants();
    const { user, toggleFavorite } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        if (user?.favorites && restaurants.length > 0) {
            const matchedFavorites = user.favorites
                .map(id => restaurants.find(r => r._id === id || r.id === id))
                .filter(Boolean);
            setFavorites(matchedFavorites);
        } else {
            setFavorites([]);
        }
    }, [user?.favorites, restaurants]);

    const removeFavorite = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleFavorite(id);
    };

    const filteredFavorites = favorites.filter(venue => {
        const matchesSearch = (venue.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.nameAr?.includes(searchQuery));
        const matchesType = filterType === 'all' || venue.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 space-y-8"
        >
            {/* Cinematic Header Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl shadow-primary/5">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <Heart className="text-white" size={32} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black font-heading text-primary tracking-tight">
                                {t.myFavorites || 'My Favorites'}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <p className="text-gray-500 font-bold text-sm tracking-wide">
                                    {favorites.length} {t.placesSaved || 'Places Saved'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Integrated Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search size={18} className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} />
                            <input
                                type="text"
                                placeholder={t.searchFavorites || 'Search...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full sm:w-64 ${language === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 bg-white rounded-2xl border border-gray-100 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none text-sm font-bold shadow-soft transition-all`}
                            />
                        </div>
                        <div className="flex bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100 p-1.5 shadow-soft">
                            {[
                                { id: 'all', icon: Sparkles, label: t.all || 'All' },
                                { id: 'restaurant', icon: Utensils, label: t.restaurants || 'Restaurants' },
                                { id: 'cafe', icon: Coffee, label: t.cafes || 'Cafes' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setFilterType(item.id)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${filterType === item.id
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-400 hover:text-primary hover:bg-white'
                                        }`}
                                >
                                    <item.icon size={14} />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Favorites Display */}
            <AnimatePresence mode="popLayout">
                {filteredFavorites.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-16 text-center border border-white shadow-2xl"
                    >
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            <Heart size={48} className="text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-primary mb-3">
                            {searchQuery ? (t.noResults || 'No results found') : (t.noFavoritesYet || 'No favorites yet')}
                        </h3>
                        <p className="text-gray-400 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                            {searchQuery ? t.tryDifferentSearch : (t.startExploring || 'Discover and save Jordanian dining gems!')}
                        </p>
                        <Link
                            to="/explore"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95"
                        >
                            <Sparkles size={16} /> {t.exploreDining || 'Browse Venues'}
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {filteredFavorites.map((venue, index) => (
                            <motion.div
                                key={venue._id || venue.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-3xl hover:border-accent/30 transition-all duration-500 relative"
                            >
                                <div className="flex h-full">
                                    {/* Responsive Image Section */}
                                    <div className="relative w-40 sm:w-48 overflow-hidden flex-shrink-0">
                                        <img
                                            src={venue.imageUrl || venue.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop'}
                                            alt={language === 'ar' ? venue.nameAr : venue.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Tag Badge */}
                                        <div className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'}`}>
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg ${venue.type === 'cafe' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                                                }`}>
                                                {venue.type === 'cafe' ? '☕ Café' : '🍽️ Dine'}
                                            </span>
                                        </div>

                                        {/* Quick Remove Action */}
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => removeFavorite(venue._id || venue.id, e)}
                                            className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        >
                                            <Trash2 size={18} />
                                        </motion.button>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-black text-primary text-xl truncate leading-tight group-hover:text-accent transition-colors">
                                                    {language === 'ar' ? (venue.nameAr || venue.name) : venue.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                                    <Star size={12} className="text-yellow-600 fill-current" />
                                                    <span className="text-[10px] font-black text-yellow-700">{venue.rating || '4.5'}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold text-gray-400 capitalize">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-accent/60" />
                                                    {venue.city || venue.location?.en || 'Amman'}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Sparkles size={14} className="text-accent/60" />
                                                    {venue.cuisineType || venue.cuisine || 'International'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <Link
                                                to={`/restaurant/${venue._id || venue.id}`}
                                                className="w-full h-12 flex items-center justify-center gap-3 bg-gray-50 border border-gray-100 text-primary rounded-xl font-black text-xs uppercase tracking-[0.2em] group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300"
                                            >
                                                {t.viewDetails || 'Explore'} <ExternalLink size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
