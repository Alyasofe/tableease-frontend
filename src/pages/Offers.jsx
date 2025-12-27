import { useLanguage } from '../context/LanguageContext';
import { useOffers } from '../context/OfferContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calendar, Tag, ArrowRight, Store } from 'lucide-react';

export default function Offers() {
    const { t, language } = useLanguage();
    const { offers, fetchOffers, loading } = useOffers();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        fetchOffers();
    }, []);

    const exclusiveOffers = offers.filter(o => (o.isPromoCarousel || o.is_promo_carousel || o.isExclusive || o.isExclusiveHome || o.is_exclusive_home) && o.active);

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#F9FAFB] selection:bg-accent/30 font-inter" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-1.5 bg-accent rounded-full mx-auto mb-6"
                    />
                    <h1 className="text-5xl md:text-7xl font-black font-heading text-primary mb-6 tracking-tight uppercase">
                        {t.exclusiveOffers}
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
                        "{t.offersSubtitle || "Exclusive deals and premium experiences curated just for you."}"
                    </p>
                </div>

                {/* Cinematic Promo Carousel - Now Dynamic */}
                {exclusiveOffers.length > 0 && (
                    <div className="mb-32 relative group overflow-hidden">
                        <div className="flex items-center justify-between mb-10 px-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                    <Tag size={20} />
                                </div>
                                <h2 className="text-2xl font-black text-primary tracking-tight uppercase">
                                    {language === 'ar' ? "عروض الشركاء المميزين" : "Elite Partner Spotlights"}
                                </h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent">{language === 'ar' ? "مباشر الآن" : "Live Now"}</span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}>
                            {/* Subtle Gradient Fades */}
                            <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-[#F9FAFB] to-transparent z-20 pointer-events-none opacity-40" />
                            <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-[#F9FAFB] to-transparent z-20 pointer-events-none opacity-40" />

                            <motion.div
                                className="flex gap-8 py-4 w-fit"
                                animate={{
                                    x: language === 'ar' ? ["0%", "50%"] : ["0%", "-50%"]
                                }}
                                transition={{
                                    duration: isHovered ? 120 : 40,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                {[...exclusiveOffers, ...exclusiveOffers].map((promo, idx) => (
                                    <Link
                                        to={promo.restaurant ? `/restaurant/${promo.restaurant.id || promo.restaurant._id || promo.restaurant}?offerId=${promo.id || promo._id}` : "/explore"}
                                        key={`${promo._id}-${idx}`}
                                        className="min-w-[320px] md:min-w-[550px] h-[350px] relative rounded-[3rem] overflow-hidden group/card shadow-2xl border border-white/20 block"
                                    >
                                        <img
                                            src={promo.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"}
                                            className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-[2s]"
                                            alt={promo.title}
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent opacity-90 transition-opacity group-hover/card:opacity-100`} />

                                        <div className="absolute top-8 left-8 rtl:left-auto rtl:right-8">
                                            <span className="px-4 py-2 bg-accent/20 backdrop-blur-xl border border-accent/30 rounded-full text-[10px] font-black text-white tracking-[0.3em] uppercase">
                                                {promo.restaurant ? (language === 'ar' ? 'عرض خاص' : 'SPECIAL') : 'GLOBAL'}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-10 left-10 right-10 rtl:text-right">
                                            <h3 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight leading-none group-hover/card:translate-x-2 transition-transform uppercase">
                                                {language === 'ar' ? promo.titleAr : promo.title}
                                            </h3>
                                            <p className="text-accent font-medium text-sm md:text-xl italic opacity-80 group-hover/card:translate-x-4 transition-transform delay-75">
                                                {language === 'ar' ? (promo.discountAr || promo.discount) : promo.discount}
                                            </p>
                                        </div>

                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-500 scale-0 group-hover/card:scale-100">
                                            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(197,160,89,0.5)]">
                                                <ArrowRight size={32} className={language === 'ar' ? 'rotate-180' : ''} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {(!Array.isArray(offers) || offers.filter(o => o.isShowList !== false && o.active).length === 0) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-32 bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/60 shadow-xl"
                            >
                                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Tag className="w-10 h-10 text-accent" />
                                </div>
                                <p className="text-2xl font-black text-primary italic uppercase tracking-widest">{t.noResults}</p>
                            </motion.div>
                        )}
                        {Array.isArray(offers) && offers.filter(o => o.isShowList !== false && o.active).map((offer, index) => (
                            <motion.div
                                key={offer._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: "0 40px 80px -15px rgba(0, 0, 0, 0.15)"
                                }}
                                transition={{
                                    delay: index * 0.05,
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25
                                }}
                                className="group bg-white rounded-[2.5rem] shadow-xl border border-white/60 overflow-hidden"
                            >
                                <div className="bg-primary p-12 text-white text-center relative overflow-hidden h-[300px] flex flex-col justify-center">
                                    <motion.div
                                        className="absolute inset-0 bg-accent/15 translate-y-full group-hover:translate-y-0 transition-transform duration-700"
                                    />
                                    <div className="relative z-10">
                                        {offer.restaurant && (
                                            <span className="inline-block bg-accent/20 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20 mb-4 backdrop-blur-sm">
                                                <Store size={12} className="inline mr-1 -mt-0.5" />
                                                {language === 'ar' ? offer.restaurant.name_ar || offer.restaurant.nameAr || offer.restaurant.name : offer.restaurant.name}
                                            </span>
                                        )}
                                        <span className={`text-accent text-xs font-black uppercase tracking-[0.3em] mb-4 block ${offer.restaurant ? 'mt-2' : ''}`}>
                                            {t.exclusiveOffer || "Exclusive Offer"}
                                        </span>
                                        <h3 className="text-4xl font-black tracking-tight mb-2 uppercase leading-none">
                                            {language === 'ar' ? offer.titleAr : offer.title}
                                        </h3>
                                        <p className="text-accent font-black text-6xl mt-6 drop-shadow-2xl">
                                            {language === 'ar' ? (offer.discountAr || offer.discount) : offer.discount}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-10 text-center flex flex-col items-center">
                                    <p className="text-gray-500 leading-relaxed mb-8 h-12 line-clamp-2 font-medium">
                                        {language === 'ar' ? offer.descriptionAr : offer.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pb-8 border-b border-gray-100 w-full justify-center">
                                        <Calendar size={14} className="text-accent" />
                                        {t.offerExpiry}: {new Date(offer.expiryDate).toLocaleDateString(language === 'ar' ? 'ar-JO' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>

                                    <Link
                                        to={offer.restaurant ? `/restaurant/${offer.restaurant.id || offer.restaurant._id || offer.restaurant}?offerId=${offer.id || offer._id}` : "/explore"}
                                        className="group/btn relative inline-flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {t.bookTable}
                                            <ArrowRight size={16} className={`${language === 'ar' ? 'rotate-180' : ''} group-hover/btn:translate-x-1 transition-transform`} />
                                        </span>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
