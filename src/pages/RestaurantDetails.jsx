import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Phone, Utensils, Award } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { useLanguage } from '../context/LanguageContext';

export default function RestaurantDetails() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const { language, t } = useLanguage();
    const getLocalized = (obj) => obj && (obj[language] || obj['en'] || obj);

    useEffect(() => {
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
        }
    }, [id]);

    if (!restaurant) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-cream pb-20">
            {/* Hero Image */}
            <div className="h-[50vh] relative">
                <img src={restaurant.image} alt={getLocalized(restaurant.name)} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white container mx-auto">
                    <span className="bg-accent px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                        {t.cuisines[restaurant.cuisine] || restaurant.cuisine}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">{getLocalized(restaurant.name)}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-200">
                        <div className="flex items-center gap-2">
                            <MapPin className="text-accent" size={20} />
                            <span>{getLocalized(restaurant.location)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="text-yellow-400 fill-yellow-400" size={20} />
                            <span className="font-bold text-white">{restaurant.rating} (500+ Reviews)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Utensils size={20} />
                            <span>{restaurant.priceRange}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold font-heading text-primary mb-4">{t.aboutExperience}</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">{getLocalized(restaurant.description)}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {restaurant.amenities && restaurant.amenities.map((amenity) => (
                                <div key={amenity} className="flex items-center gap-2 text-gray-500 bg-gray-50 p-3 rounded-lg">
                                    <Award size={16} className="text-accent" />
                                    <span className="text-sm font-medium">{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Menu Preview */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold font-heading text-primary mb-6">{t.popularDishes}</h2>
                        <div className="space-y-4">
                            {restaurant.menu && restaurant.menu.map((dish, i) => (
                                <div key={i} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    {dish.image && (
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-primary">{dish.name}</h4>
                                            <span className="font-bold text-accent">{dish.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2">{dish.description}</p>
                                    </div>
                                </div>
                            ))}
                            {(!restaurant.menu || restaurant.menu.length === 0) && (
                                <p className="text-gray-400 text-sm italic">No menu highlights added.</p>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 border border-accent text-accent rounded-xl font-semibold hover:bg-accent hover:text-white transition-all">
                            {t.viewMenu}
                        </button>
                    </div>
                </div>

                {/* Right Sidebar (Booking) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
                        <h3 className="text-xl font-bold font-heading text-primary mb-6">{t.makeReservation}</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-4 text-gray-600">
                                <Clock className="text-accent mt-1" size={20} />
                                <div>
                                    <p className="font-bold text-primary">{t.openingHours}</p>
                                    <p className="text-sm">{restaurant.openingHours}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 text-gray-600">
                                <Phone className="text-accent mt-1" size={20} />
                                <div>
                                    <p className="font-bold text-primary">{t.contact}</p>
                                    <p className="text-sm">{restaurant.phone}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1"
                        >
                            {t.bookTable}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">No prepayment needed</p>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                restaurantName={getLocalized(restaurant.name)}
            />
        </div>
    );
}
