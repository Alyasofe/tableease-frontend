import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function RestaurantCard({ data }) {
    const { language, t } = useLanguage();

    // Helper to safely get localized string
    const getLocalized = (obj) => obj[language] || obj['en'] || obj;

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={data.image}
                    alt={getLocalized(data.name)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-md`}>
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm text-primary">{data.rating}</span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-heading font-bold text-primary mb-1">{getLocalized(data.name)}</h3>
                        <p className="text-sm text-gray-500">{t.cuisines[data.cuisine] || data.cuisine} • {data.priceRange}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    <MapPin size={16} className="text-accent" />
                    <span>{getLocalized(data.location)}</span>
                </div>

                <Link to={`/restaurant/${data.id}`} className="block w-full text-center py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-primary transition-colors">
                    {t.viewDetails}
                </Link>
            </div>
        </motion.div>
    );
}
