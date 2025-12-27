import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, MapPin, Clock, Phone, Utensils, Award, ChefHat, Sparkles, Languages, Info, ShieldCheck, Heart, ChevronLeft, ChevronRight, Globe, Share2 } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurants } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../supabaseClient';

export default function RestaurantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, toggleFavorite } = useAuth();
    const { addToast } = useToast();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const offerId = queryParams.get('offerId');

    const { state } = useLocation();
    const preview = state?.preview;

    // Optimistic UI: Initialize with preview data if available
    const [restaurant, setRestaurant] = useState(preview ? {
        ...preview,
    } : null);

    const [loading, setLoading] = useState(!preview);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const { language, t } = useLanguage();
    const { fetchRestaurantById } = useRestaurants();

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    const getLocalized = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[language] || obj['en'] || obj;
    };

    const isFavorite = user?.favorites?.includes(id) || user?.favorites?.includes(restaurant?._id) || user?.favorites?.includes(restaurant?.id);

    // Initial gallery safety check
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const gallery = (restaurant?.gallery && restaurant.gallery.length > 0)
        ? restaurant.gallery
        : [restaurant?.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"].filter(Boolean);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            addToast(language === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first', 'error');
            return;
        }
        if (isToggling) return;
        setIsToggling(true);

        const res = await toggleFavorite(restaurant?._id || restaurant?.id || id);

        if (res.success) {
            addToast(
                res.isFavorite
                    ? (language === 'ar' ? 'تمت الإضافة للمفضلة ✨' : 'Added to favorites ✨')
                    : (language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites'),
                res.isFavorite ? 'success' : 'info'
            );
        } else {
            addToast(
                language === 'ar'
                    ? 'فشل في تحديث المفضلة - يرجى فحص إعدادات RLS'
                    : 'Failed to update favorites - Check RLS settings',
                'error'
            );
        }
        setIsToggling(false);
    };

    useEffect(() => {
        if (id && id !== 'my-restaurant') {
            const incrementVisit = async () => {
                const { error } = await supabase.rpc('increment_restaurant_visits', { rest_id: id });
                if (error) console.error("Visits error:", error);
            };
            incrementVisit();
        }
    }, [id]);

    useEffect(() => {
        const loadRestaurant = async () => {
            if (id === 'my-restaurant') {
                const detailsStr = localStorage.getItem('restaurant_details');
                const imagesStr = localStorage.getItem('restaurant_images');
                const locationStr = localStorage.getItem('restaurant_location');
                const amenitiesStr = localStorage.getItem('restaurant_amenities');
                const menuStr = localStorage.getItem('restaurant_menu');

                if (detailsStr) {
                    const details = JSON.parse(detailsStr);
                    const images = imagesStr ? JSON.parse(imagesStr) : [];
                    const amenities = amenitiesStr ? JSON.parse(amenitiesStr) : ['Wifi', 'Parking'];
                    const menu = menuStr ? JSON.parse(menuStr) : [];

                    setRestaurant({
                        id: 'my-restaurant',
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
                        priceRange: details.priceRange || "$$",
                        description: {
                            en: details.descriptionEn || details.description || "Welcome to our restaurant.",
                            ar: details.descriptionAr || details.description || "أهلاً بك في مطعمنا."
                        },
                        amenities: amenities,
                        menu: menu,
                        phone: details.phone || "+962 79 000 0000",
                        openingHours: details.openingHours || "12:00 PM - 12:00 AM"
                    });
                }
                setLoading(false);
            } else {
                try {
                    const restaurantData = await fetchRestaurantById(id);
                    if (restaurantData) {
                        const transformedRestaurant = {
                            _id: restaurantData._id || restaurantData.id,
                            id: restaurantData.id || restaurantData._id,
                            name: {
                                en: restaurantData.name,
                                ar: restaurantData.nameAr || restaurantData.name_ar || restaurantData.name
                            },
                            image: (() => {
                                // Priority 1: Check gallery/array
                                if (Array.isArray(restaurantData.gallery) && restaurantData.gallery.length > 0 && typeof restaurantData.gallery[0] === 'string') return restaurantData.gallery[0];

                                // Priority 2: Check direct properties (allowing Base64)
                                const candidates = [restaurantData.image, restaurantData.imageUrl, restaurantData.image_url];
                                for (const c of candidates) {
                                    if (typeof c === 'string' && (c.startsWith('http') || c.startsWith('data:image'))) return c;
                                }

                                // Fallback
                                return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
                            })(),
                            cuisine: restaurantData.cuisineType || restaurantData.cuisine || restaurantData.cuisine_type || "International",
                            rating: restaurantData.rating || 5.0,
                            location: {
                                en: restaurantData.city || restaurantData.address || "Amman",
                                ar: restaurantData.city || "عمان"
                            },
                            priceRange: restaurantData.priceRange || restaurantData.price_range || "$$",
                            description: {
                                en: restaurantData.description || "Welcome to our restaurant.",
                                ar: restaurantData.descriptionAr || restaurantData.description_ar || "أهلاً بك في مطعمنا."
                            },
                            gallery: (Array.isArray(restaurantData.gallery) && restaurantData.gallery.length > 0)
                                ? restaurantData.gallery
                                : [restaurantData.image_url || restaurantData.imageUrl || restaurantData.image].filter(c => typeof c === 'string' && (c.startsWith('http') || c.startsWith('data:image'))),
                            amenities: restaurantData.amenities || ['Wifi', 'Parking'],
                            menu: restaurantData.menu?.map(m => ({
                                ...m,
                                image: m.image_url || m.imageUrl || m.image
                            })) || [],
                            phone: restaurantData.phone || "+962 79 000 0000",
                            openingHours: restaurantData.openingHours || restaurantData.opening_hours || "12:00 PM - 12:00 AM"
                        };
                        setRestaurant(transformedRestaurant);
                    }
                } catch (error) {
                    console.error("Failed to fetch restaurant:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadRestaurant();
    }, [id, fetchRestaurantById]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-[60vh] bg-gray-200 animate-pulse relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />
                </div>
                <div className="container mx-auto px-6 -mt-20 relative z-10">
                    <div className="h-8 w-32 bg-gray-200 rounded-full mb-6 animate-pulse" />
                    <div className="h-16 w-3/4 bg-gray-200 rounded-3xl mb-8 animate-pulse" />
                    <div className="flex gap-4 mb-20">
                        <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-8">
                    <Utensils className="text-accent" size={40} />
                </div>
                <h2 className="text-3xl font-black text-primary mb-4 tracking-tight">{t.restaurantNotFound}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all">
                    {t.back}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white selection:bg-accent/30 font-inter pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Immersive Gallery Section */}
            <section className="relative h-[60vh] md:h-[85vh] overflow-hidden group">
                <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <img
                        src={gallery[activeImageIndex]}
                        alt={getLocalized(restaurant.name)}
                        onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
                        }}
                        className="w-full h-full object-cover"
                    />
                    {/* Artistic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />
                </motion.div>

                {/* Gallery Navigation Controls */}
                <div className="absolute bottom-40 right-6 md:right-16 z-30 flex flex-col gap-3">
                    {gallery.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 ${activeImageIndex === idx ? 'border-accent shadow-xl scale-110' : 'border-white/40 grayscale hover:grayscale-0'}`}
                        >
                            <img
                                src={img}
                                className="w-full h-full object-cover"
                                alt="Gallery thumbnail"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none'; // Hide broken thumbnails
                                }}
                            />
                        </button>
                    ))}
                </div>

                {/* Floating Navigation Header (Internal Page) */}
                <div className="absolute top-10 left-0 w-full z-20 px-6 container mx-auto flex justify-between items-center pointer-events-none">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all pointer-events-auto shadow-2xl"
                    >
                        {language === 'ar' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                    </button>

                    <button
                        onClick={handleToggleFavorite}
                        className={`w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center transition-all pointer-events-auto shadow-2xl group ${isFavorite ? 'text-red-500' : 'text-white hover:bg-white hover:text-red-500'}`}
                    >
                        <Heart size={24} className={isFavorite ? "fill-current" : "group-hover:scale-110 transition-transform"} />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <span className="px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                                    {t.cuisines[restaurant.cuisine] || restaurant.cuisine}
                                </span>
                                <div className="flex items-center gap-2 px-5 py-2.5 bg-accent/90 backdrop-blur-xl rounded-2xl text-white text-[10px] font-black border border-white/20 shadow-2xl transition-transform hover:scale-105">
                                    <Star size={12} className="fill-white" />
                                    <span>{restaurant.rating}</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-black font-heading text-primary tracking-tighter leading-[1.1] mb-12 drop-shadow-[0_4px_10px_rgba(255,255,255,0.5)]">
                                {getLocalized(restaurant.name)}
                            </h1>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex flex-wrap items-center gap-y-4 gap-x-12 p-1.5 rounded-full bg-white/30 backdrop-blur-2xl border border-white/40 shadow-xl shadow-black/5"
                            >
                                <div className="flex items-center gap-3 pl-2 pr-4 py-2">
                                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-accent shadow-sm">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                                        {getLocalized(restaurant.location)}
                                    </span>
                                </div>

                                <div className="hidden md:block w-px h-5 bg-primary/10" />

                                <div className="flex items-center gap-3 px-4 py-2" dir="ltr">
                                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-accent shadow-sm">
                                        <Clock size={16} />
                                    </div>
                                    <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                                        {restaurant.openingHours}
                                    </span>
                                </div>

                                <div className="hidden md:block w-px h-5 bg-primary/10" />

                                <div className="flex items-center gap-3 pl-4 pr-6 py-2">
                                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-accent shadow-sm">
                                        <Globe size={16} />
                                    </div>
                                    <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                                        {t.priceLevels[restaurant.priceRange] || restaurant.priceRange}
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="container mx-auto px-6 -mt-6 md:-mt-10 relative z-30 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Story / About */}
                        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-16 shadow-sm relative overflow-hidden">
                            <div className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none`}></div>
                            <h2 className="text-3xl font-black text-primary mb-8 tracking-tight flex items-center gap-4 relative z-10">
                                <Sparkles className="text-accent" />
                                {t.aboutExperience}
                            </h2>
                            <p className="text-xl text-gray-400 font-medium leading-relaxed italic mb-12 relative z-10">
                                "{getLocalized(restaurant.description)}"
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                                {restaurant.amenities && restaurant.amenities.map((amenity, idx) => (
                                    <div key={idx} className="group flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-accent/20 transition-all">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-accent shadow-sm group-hover:bg-accent group-hover:text-white transition-all">
                                            <Award size={20} />
                                        </div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Menu Highlights (Cinematic Preview) */}
                        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-16 shadow-sm overflow-hidden relative">
                            {/* Decorative background circle */}
                            <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

                            <div className="flex justify-between items-end mb-12 relative z-10">
                                <div>
                                    <h2 className="text-3xl font-black text-primary mb-2 tracking-tight">
                                        {t.popularDishes}
                                    </h2>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        {language === 'ar' ? "مختارات الشيف اليوم" : "CHEF'S CURATED SELECTION"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => addToast(language === 'ar' ? "ميزة القائمة الكاملة قادمة قريباً للتطبيق!" : "Full menu feature is coming soon to the app!", 'info')}
                                    className="px-8 py-3 border border-accent/20 text-accent rounded-full font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all"
                                >
                                    {t.fullMenu}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                {restaurant.menu && restaurant.menu.length > 0 ? (
                                    restaurant.menu.slice(0, 4).map((dish, i) => (
                                        <div key={i} className="flex gap-6 items-start group">
                                            {dish.image && (
                                                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <h4 className="font-black text-primary tracking-tight group-hover:text-accent transition-colors">{dish.name}</h4>
                                                    <span className="text-accent font-black">{dish.price}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">{dish.description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        <Utensils className="mx-auto text-gray-300 mb-4" size={40} />
                                        <p className="text-gray-400 font-bold italic">{t.noMenuHighlights || "No menu highlights available yet."}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Reservation Card */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-32">
                            <div className="bg-white border border-gray-100 text-primary rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 overflow-hidden relative group">
                                <div className="relative z-10">
                                    <div className="mb-10 text-center">
                                        <h3 className="text-2xl font-black mb-3 tracking-tighter uppercase text-primary">
                                            {language === 'ar' ? "احجز طاولتك" : "Secure a Table"}
                                        </h3>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                            {language === 'ar' ? "تأكيد فوري وآمن" : "INSTANT SECURE CONFIRMATION"}
                                        </p>
                                    </div>

                                    <div className="space-y-6 mb-10">
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-accent">
                                                    <Phone size={18} />
                                                </div>
                                                <div className={language === 'ar' ? 'text-right' : ''}>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{t.contact}</p>
                                                    <p className="text-primary text-base font-bold" dir="ltr">{restaurant.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-accent">
                                                    <ShieldCheck size={18} />
                                                </div>
                                                <div className={language === 'ar' ? 'text-right' : ''}>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{t.guarantee}</p>
                                                    <p className="text-primary text-base font-bold">{t.noPrepayment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: '#000' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsBookingOpen(true)}
                                        className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 border border-transparent"
                                    >
                                        <Clock size={18} />
                                        {t.bookTable}
                                    </motion.button>

                                    <div className="mt-8 flex items-center justify-center gap-6">
                                        <button className="text-gray-300 hover:text-primary transition-colors">
                                            <Share2 size={20} />
                                        </button>
                                        <button
                                            onClick={handleToggleFavorite}
                                            className={`${isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-500'} transition-colors`}
                                        >
                                            <Heart size={20} className={isFavorite ? "fill-current" : ""} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                    {language === 'ar' ? "شريك موثوق لدى تيبل إيز" : "VERIFIED TABLEEASE PARTNER"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                restaurantId={restaurant.id}
                restaurantName={getLocalized(restaurant.name)}
                offerId={offerId}
            />
        </div>
    );
}
