import { motion } from 'framer-motion';
import { Star, MapPin, Heart, Sparkles, Utensils } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const RestaurantCard = ({ data }) => {
    const { language, t } = useLanguage();
    const { user, toggleFavorite } = useAuth();
    const navigate = useNavigate();
    const isFavorite = user?.favorites?.includes(data.id) || user?.favorites?.includes(data._id);

    const getLocalized = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[language] || obj['en'] || '';
    };

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleFavorite(data.id || data._id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/10 shadow-soft hover:shadow-2xl hover:border-accent/20 transition-all duration-700"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={data.image}
                    alt={getLocalized(data.name)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-6 right-6 p-3 rounded-2xl backdrop-blur-md border border-white/20 transition-all active:scale-90 z-20"
                    style={{ backgroundColor: isFavorite ? '#ef4444' : 'rgba(255,255,255,0.3)' }}
                >
                    <Heart size={20} className={isFavorite ? 'text-white fill-current' : 'text-primary'} />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {data.isFeatured && (
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-accent/90 backdrop-blur-md rounded-full border border-white/20">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={10} /> {t.featuredTitle}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-primary group-hover:text-accent transition-colors truncate pr-2">
                        {getLocalized(data.name)}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-sm font-black text-primary">{data.rating}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-accent" />
                        {getLocalized(data.location)}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <Utensils size={12} className="text-accent" />
                        {data.cuisine}
                    </div>
                </div>

                <Link
                    to={`/restaurant/${data.id || data._id}`}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 group/btn hover:bg-accent transition-all transform active:scale-95 shadow-xl shadow-primary/10"
                >
                    {t.viewDetails}
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        &rarr;
                    </motion.div>
                </Link>
            </div>
        </motion.div>
    );
};

export const RestaurantSkeleton = () => (
    <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-soft animate-pulse">
        <div className="aspect-[4/5] bg-gray-200" />
        <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div className="h-7 w-32 bg-gray-200 rounded-lg" />
                <div className="h-7 w-12 bg-gray-100 rounded-lg" />
            </div>
            <div className="flex gap-4 mb-8">
                <div className="h-4 w-20 bg-gray-100 rounded-md" />
                <div className="h-4 w-20 bg-gray-100 rounded-md" />
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-2xl" />
        </div>
    </div>
);

export default RestaurantCard;
