import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import RestaurantCard from '../components/RestaurantCard';
import VibeFinder from '../components/VibeFinder';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurants } from '../context/RestaurantContext';
import { useOffers } from '../context/OfferContext';

export default function Home() {
    const { language, t } = useLanguage();
    const { restaurants, loading } = useRestaurants();
    const { offers, fetchOffers } = useOffers();

    useEffect(() => {
        fetchOffers();
    }, []);
    const getLocalized = (obj) => obj[language] || obj['en'] || obj;

    // Transform restaurant data to match the expected format
    const transformRestaurants = (restaurants) => {
        return restaurants.map(restaurant => ({
            id: restaurant._id,
            name: {
                en: restaurant.name,
                ar: restaurant.nameAr || restaurant.name
            },
            image: restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
            cuisine: restaurant.cuisineType || "International",
            rating: restaurant.rating || 5.0,
            location: {
                en: restaurant.city || "Amman",
                ar: restaurant.city || "عمان"
            },
            priceRange: restaurant.priceRange || "$$",
            description: {
                en: restaurant.description || "Welcome to our restaurant.",
                ar: restaurant.descriptionAr || "أهلاً بك في مطعمنا."
            },
            isFeatured: restaurant.isFeatured
        }));
    };

    const transformedRestaurants = Array.isArray(restaurants) ? transformRestaurants(restaurants) : [];
    const featuredRestaurants = transformedRestaurants.filter(r => r.isFeatured);

    return (
        <div className="min-h-screen bg-mesh selection:bg-accent/30 overflow-x-hidden">
            <Hero />
            <VibeFinder />

            {/* Featured Section */}
            <section className="relative z-10 py-32">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                        <div className="max-w-xl">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "4rem" }}
                                className="h-1.5 bg-accent rounded-full mb-6"
                            />
                            <h2 className="text-4xl md:text-6xl font-black font-heading text-primary mb-6 tracking-tight">{t.featuredTitle}</h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed">{t.featuredSubtitle}</p>
                        </div>
                        <Link to="/explore?featured=true" className="group flex items-center gap-3 text-lg font-black text-accent hover:text-primary transition-all uppercase tracking-widest pb-2 border-b-2 border-accent/20 hover:border-primary">
                            {t.viewAll}
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                &rarr;
                            </motion.span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {featuredRestaurants.slice(0, 4).map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: index * 0.1,
                                        duration: 0.8,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    viewport={{ once: true, margin: "-100px" }}
                                >
                                    <RestaurantCard data={item} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Cinematic Offers Section */}
            <section className="relative py-48 bg-[#050505] overflow-hidden">
                {/* Clean Section Divider - Removing the 'foggy' transition */}
                <div className="absolute top-0 left-0 w-full h-px bg-white/5" />

                {/* Advanced Atmospheric FX - Deep, saturated glows instead of fog */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-40">
                    <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent/20 blur-[180px] rounded-full animate-pulse" />
                    <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-accent/10 blur-[200px] rounded-full" />
                </div>

                {/* Floating Abstract Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ repeat: Infinity, duration: 8 }}
                        className="absolute top-1/4 right-[10%] w-64 h-64 border border-white/5 rounded-full"
                    />
                    <motion.div
                        animate={{ y: [0, 30, 0], opacity: [0.05, 0.1, 0.05] }}
                        transition={{ repeat: Infinity, duration: 12 }}
                        className="absolute bottom-1/4 left-[5%] w-96 h-96 border border-white/5 rounded-full"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-8 py-2.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-2xl mb-10"
                        >
                            <Sparkles className="text-accent" size={14} />
                            <span className="text-accent font-black uppercase tracking-[0.5em] text-[11px]">
                                {t.limitedTime}
                            </span>
                        </motion.div>
                        <h2 className="text-6xl md:text-9xl font-black font-heading text-white mb-10 uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
                            {t.exclusiveOffers}
                        </h2>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "12rem" }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto rounded-full shadow-[0_0_30px_rgba(197,160,89,0.8)]"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {offers.filter(o => (o.isExclusiveHome || o.isExclusive) && o.active).slice(0, 4).map((offer, index) => (
                            <motion.div
                                key={offer._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                {/* Card Glow Effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 rounded-[3.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative h-full bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-[3.5rem] p-10 md:p-14 transition-all duration-700 hover:bg-white/[0.05] hover:border-white/20">
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                                        <div className="flex-1 text-center md:text-start">
                                            <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight leading-tight group-hover:text-accent transition-colors uppercase">
                                                {language === 'ar' ? offer.titleAr : offer.title}
                                            </h3>
                                            <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium italic">
                                                "{language === 'ar' ? offer.descriptionAr : offer.description}"
                                            </p>
                                            <Link
                                                to={`/restaurant/${offer.restaurant?._id || offer.restaurant}?offerId=${offer._id}`}
                                                className="inline-block px-10 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-highlight transition-all shadow-2xl shadow-accent/20 transform hover:-translate-y-1 active:scale-95"
                                            >
                                                {t.claimNow || 'Claim Now'}
                                            </Link>
                                        </div>

                                        <div className="flex-shrink-0 relative">
                                            {/* Luxury Discount Badge */}
                                            <div className="w-40 h-40 rounded-full bg-primary/40 border border-white/5 backdrop-blur-md flex items-center justify-center p-6 relative group-hover:scale-110 transition-transform duration-700 group-hover:shadow-[0_0_50px_rgba(197,160,89,0.15)]">
                                                {/* Animated Ring */}
                                                <div className="absolute inset-0 border-2 border-accent/20 rounded-full animate-[spin_10s_linear_infinite]" />
                                                <div className="absolute inset-2 border border-accent/10 border-dashed rounded-full" />

                                                <div className="text-center relative z-10">
                                                    <p className="text-2xl font-black text-accent leading-none mb-1 uppercase">
                                                        {language === 'ar' ? (offer.discountAr || offer.discount) : offer.discount}
                                                    </p>
                                                    <div className="w-8 h-0.5 bg-accent/30 mx-auto mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}