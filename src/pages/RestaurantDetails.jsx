import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, MapPin, Clock, Phone, Utensils, Award, ChefHat, Sparkles, Languages, Info, ShieldCheck, Heart } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurants } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RestaurantDetails() {
    const { id } = useParams();
    const { user, isAuthenticated, toggleFavorite } = useAuth();
    const { addToast } = useToast();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const offerId = queryParams.get('offerId');

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const { language, t } = useLanguage();
    const { fetchRestaurantById } = useRestaurants();

    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    const getLocalized = (obj) => obj && (obj[language] || obj['en'] || obj);

    const isFavorite = user?.favorites?.includes(id) || user?.favorites?.includes(restaurant?._id) || user?.favorites?.includes(restaurant?.id);

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            addToast(language === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first', 'error');
            return;
        }
        if (isToggling) return;
        setIsToggling(true);
        const newStatus = !isFavorite;
        await toggleFavorite(restaurant?._id || restaurant?.id || id);
        addToast(
            newStatus
                ? (language === 'ar' ? 'تمت الإضافة للمفضلة ✨' : 'Added to favorites ✨')
                : (language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites'),
            newStatus ? 'success' : 'info'
        );
        setIsToggling(false);
    };

    useEffect(() => {
        if (id && id !== 'my-restaurant') {
            fetch(`http://localhost:5001/api/restaurants/${id}/visit`, { method: 'POST' })
                .catch(err => console.error("Visits error:", err));
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
                            _id: restaurantData._id,
                            id: restaurantData._id,
                            name: {
                                en: restaurantData.name,
                                ar: restaurantData.nameAr || restaurantData.name
                            },
                            image: restaurantData.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
                            cuisine: restaurantData.cuisineType || "International",
                            rating: restaurantData.rating || 5.0,
                            location: {
                                en: restaurantData.city || "Amman",
                                ar: restaurantData.city || "عمان"
                            },
                            priceRange: restaurantData.priceRange || "$$",
                            description: {
                                en: restaurantData.description || "Welcome to our restaurant.",
                                ar: restaurantData.descriptionAr || "أهلاً بك في مطعمنا."
                            },
                            amenities: restaurantData.amenities || ['Wifi', 'Parking'],
                            menu: restaurantData.menu || [],
                            phone: restaurantData.phone || "+962 79 000 0000",
                            openingHours: restaurantData.openingHours || "12:00 PM - 12:00 AM"
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
            <div className="h-screen flex items-center justify-center bg-mesh">
                <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-mesh px-6 text-center">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-8">
                    <Utensils className="text-accent" size={40} />
                </div>
                <h2 className="text-3xl font-black text-primary mb-4 tracking-tight">{t.restaurantNotFound}</h2>
                <button
                    onClick={() => window.history.back()}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all">
                    {t.back}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mesh pb-32 selection:bg-accent/30" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Cinematic Hero */}
            <div className="h-[60vh] md:h-[75vh] relative overflow-hidden group">
                <motion.img
                    style={{ y: y1 }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={restaurant.image}
                    alt={getLocalized(restaurant.name)}
                    className="w-full h-full object-cover"
                />

                {/* Advanced Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/30 to-transparent"></div>
                <div className="absolute inset-0 bg-black/40 lg:opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>

                <div className="absolute bottom-0 inset-x-0 pb-20 pt-32">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <span className="bg-accent/90 backdrop-blur-md text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl">
                                    {t.cuisines[restaurant.cuisine] || restaurant.cuisine}
                                </span>
                                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                                    <Star className="text-accent fill-accent" size={14} />
                                    <span className="text-white font-black text-sm">{restaurant.rating}</span>
                                </div>

                                {/* Favorite Button */}
                                {isAuthenticated && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleToggleFavorite}
                                        disabled={isToggling}
                                        className={`px-4 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border transition-all duration-300 ${isFavorite
                                            ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30'
                                            : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
                                        <span className="text-xs font-black uppercase">
                                            {isFavorite ? 'Saved' : 'Save'}
                                        </span>
                                    </motion.button>
                                )}
                            </div>
                            <h1 className={`text-5xl md:text-8xl font-black text-white mb-8 drop-shadow-2xl ${language === 'ar' ? 'tracking-normal leading-tight' : 'tracking-tighter uppercase leading-[0.85]'}`}>
                                {getLocalized(restaurant.name)}
                            </h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl text-white/80 font-bold uppercase tracking-widest text-xs">
                                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                                    <MapPin className="text-accent" size={20} />
                                    <span>{getLocalized(restaurant.location)}</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5" dir="ltr">
                                    <Clock className="text-accent" size={20} />
                                    <span>{restaurant.openingHours}</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                                    <Languages className="text-accent" size={20} />
                                    <span className={language === 'ar' ? 'tracking-normal' : ''}>{language === 'ar' ? t.arabic : t.english} {t.available}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* About Card */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/80 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 border border-white shadow-2xl overflow-hidden relative"
                        >
                            <div className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-64 h-64 bg-accent/5 blur-[100px] rounded-full`}></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                                        <Info className="text-white" size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black font-heading text-primary tracking-tight">{t.aboutExperience}</h2>
                                </div>
                                <p className="text-xl text-gray-600 leading-relaxed mb-12 font-medium italic">
                                    "{getLocalized(restaurant.description)}"
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {restaurant.amenities && restaurant.amenities.map((amenity, idx) => (
                                        <motion.div
                                            key={amenity}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-gray-50/50 border border-transparent hover:border-accent/30 hover:bg-white transition-all duration-500"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                                <Award size={24} />
                                            </div>
                                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest text-center">{amenity}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        {/* Menu Highlights Card */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 border border-white shadow-2xl"
                        >
                            <div className="flex justify-between items-end mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                                        <ChefHat className="text-white" size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black font-heading text-primary tracking-tight">{t.popularDishes}</h2>
                                </div>
                                <button className="hidden md:block text-accent font-black uppercase tracking-[0.2em] text-xs pb-1 border-b-2 border-accent/20 hover:border-accent transition-all">
                                    {t.fullMenu}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {restaurant.menu && restaurant.menu.map((dish, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group flex gap-8 p-5 rounded-[2.5rem] bg-white/40 backdrop-blur-md hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-white/60 hover:border-accent/20"
                                    >
                                        {dish.image && (
                                            <div className="w-32 h-32 bg-gray-100 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-xl border-4 border-white transform group-hover:scale-105 group-hover:rotate-2 transition-all duration-700">
                                                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1 py-2">
                                            <div className="flex justify-between items-start gap-4 mb-3">
                                                <h4 className="text-xl font-black text-primary leading-tight group-hover:text-accent transition-colors">
                                                    {dish.name}
                                                </h4>
                                                <span className={`shrink-0 font-black text-accent bg-accent/5 px-4 py-1.5 rounded-xl text-xs border border-accent/10 shadow-sm ${language === 'ar' ? '' : 'uppercase tracking-widest'}`}>
                                                    {dish.price}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium italic">
                                                {dish.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {(!restaurant.menu || restaurant.menu.length === 0) && (
                                <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                                    <Utensils className="mx-auto text-gray-300 mb-4" size={40} />
                                    <p className="text-gray-400 text-lg font-bold italic">{t.noMenuHighlights}</p>
                                </div>
                            )}

                            <button className="w-full mt-12 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm hover:bg-black transition-all shadow-2xl shadow-primary/20">
                                {t.viewMenu}
                            </button>
                        </motion.section>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary rounded-[3.5rem] p-10 md:p-12 shadow-3xl sticky top-24 border border-white/5 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[120px] rounded-full pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-10 text-accent">
                                    <Sparkles size={20} />
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em]">{t.makeReservation}</h3>
                                </div>

                                <div className="space-y-10 mb-12">
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 border border-white/5">
                                            <Phone size={24} />
                                        </div>
                                        <div className={language === 'ar' ? 'text-right' : ''}>
                                            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">{t.contact}</p>
                                            <p className="text-white text-lg font-bold" dir="ltr">{restaurant.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 border border-white/5">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div className={language === 'ar' ? 'text-right' : ''}>
                                            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">{t.guarantee}</p>
                                            <p className="text-white text-lg font-bold">{t.noPrepayment}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="w-full bg-accent text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-highlight transition-all shadow-3xl shadow-accent/40 transform hover:scale-[1.02] active:scale-95"
                                >
                                    {t.bookTable}
                                </button>

                                <p className="text-center mt-8 text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                                    Direct Booking via TableEase
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                restaurantId={restaurant.id}
                restaurantName={getLocalized(restaurant.name)}
                offerId={offerId}
            />
        </div >
    );
}