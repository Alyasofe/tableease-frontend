import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

export default function Offers() {
    const { t, language } = useLanguage();
    const getLocalized = (obj) => obj[language] || obj['en'] || obj;

    // Fetch offers from localStorage
    const offers = JSON.parse(localStorage.getItem('restaurant_offers') || '[]').filter(o => o.active);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-cream">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold font-heading text-primary mb-2 text-center">{t.exclusiveOffers}</h1>
                <p className="text-gray-500 text-center mb-12">{t.heroSubtitle}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-400 text-lg">No exclusive offers available at the moment.</p>
                        </div>
                    )}
                    {offers.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        >
                            <div className="bg-secondary p-6 text-white text-center">
                                <h3 className="text-2xl font-bold">{getLocalized(offer.title)}</h3>
                                <p className="text-accent font-bold text-4xl mt-2">{getLocalized(offer.discount)}</p>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-gray-600 mb-6">{getLocalized(offer.description)}</p>
                                <button className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
                                    {t.bookTable}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
