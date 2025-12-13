import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { offers } from '../data/mockData';
import Hero from '../components/Hero';
import RestaurantCard from '../components/RestaurantCard';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
    const { language, t } = useLanguage();
    const getLocalized = (obj) => obj[language] || obj['en'] || obj;
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        // Fetch User's Restaurant from LocalStorage
        const detailsStr = localStorage.getItem('restaurant_details');
        const imagesStr = localStorage.getItem('restaurant_images');
        const locationStr = localStorage.getItem('restaurant_location');

        if (detailsStr) {
            const details = JSON.parse(detailsStr);
            const images = imagesStr ? JSON.parse(imagesStr) : [];

            const userRestaurant = {
                id: 'my-restaurant', // Unique ID for the user's restaurant
                name: {
                    en: details.nameEn || "My Restaurant",
                    ar: details.nameAr || "مطعمي"
                },
                image: images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
                cuisine: details.cuisine || "International",
                rating: 5.0,
                location: {
                    en: locationStr || "Amman",
                    ar: locationStr || "عمان"
                },
                priceRange: "$$",
                description: {
                    en: details.description || "Welcome to our restaurant.",
                    ar: details.description || "أهلاً بك في مطعمنا."
                }
            };
            setRestaurants([userRestaurant]);
        } else {
            setRestaurants([]);
        }
    }, []);

    return (
        <div className="min-h-screen bg-cream">
            <Hero />

            {/* Featured Section */}
            <section className="container mx-auto px-6 py-16">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-2">{t.featuredTitle}</h2>
                        <p className="text-gray-500">{t.featuredSubtitle}</p>
                    </div>
                    <a href="/explore" className="text-accent font-semibold hover:tracking-wide transition-all rtl:flex-row-reverse">
                        {t.viewAll} &rarr;
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {restaurants.slice(0, 4).map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <RestaurantCard data={item} />
                        </motion.div>
                    ))}
                    {restaurants.length === 0 && (
                        <div className="col-span-full text-center text-gray-400 py-10">
                            No restaurants added yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Offers Section */}
            <section className="bg-secondary py-16 text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold font-heading mb-10 text-center">{t.exclusiveOffers}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {offers.map((offer) => (
                            <div key={offer.id} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="bg-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">{t.limitedTime}</span>
                                        <h3 className="text-2xl font-bold mb-2">{getLocalized(offer.title)}</h3>
                                        <p className="text-gray-300 mb-4">{getLocalized(offer.description)}</p>
                                    </div>
                                    <div className={`text-${language === 'ar' ? 'left' : 'right'}`}>
                                        <p className="text-3xl font-bold text-accent">{getLocalized(offer.discount)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
