import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRestaurants } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { Save, Upload, Plus, X, Trash2, Store, Image, MapPin, Clock, Phone, DollarSign, Utensils, Sparkles, FileText, Tag, Sparkles as SparklesIcon, Calendar as CalendarIcon, Edit3, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOffers } from '../../context/OfferContext';

export default function AdminDashboard() {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const { restaurants, loading, fetchRestaurants, updateRestaurant, deleteRestaurant, createRestaurant } = useRestaurants();
    const { offers, loading: offersLoading, fetchAdminOffers, addOffer: addNewOffer, updateOffer: saveOffer, deleteOffer: removeOffer } = useOffers();

    const [activeTab, setActiveTab] = useState('restaurants');
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [creatingRestaurant, setCreatingRestaurant] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [creatingOffer, setCreatingOffer] = useState(false);

    const [details, setDetails] = useState({
        nameEn: "",
        nameAr: "",
        cuisine: "Jordanian",
        descriptionEn: "",
        descriptionAr: "",
        priceRange: "$$",
        phone: "+962 79 000 0000",
        openingHours: "12:00 PM - 12:00 AM",
        isFeatured: false
    });

    const [offerDetails, setOfferDetails] = useState({
        title: "",
        titleAr: "",
        description: "",
        descriptionAr: "",
        discount: "",
        discountAr: "",
        restaurant: "",
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active: true
    });

    const [images, setImages] = useState(["https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80"]);
    const [amenities, setAmenities] = useState(['Wifi', 'Parking']);
    const [menu, setMenu] = useState([{ name: "", price: "", description: "" }]);
    const [location, setLocation] = useState("Rainbow Street, Amman");
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch all data when component mounts
    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchRestaurants();
            fetchAdminOffers();
        }
    }, [user, fetchRestaurants, fetchAdminOffers]);

    // Initialize restaurant form
    useEffect(() => {
        if (editingRestaurant) {
            setDetails({
                nameEn: editingRestaurant.name || "",
                nameAr: editingRestaurant.nameAr || "",
                cuisine: editingRestaurant.cuisineType || "Jordanian",
                descriptionEn: editingRestaurant.description || "",
                descriptionAr: editingRestaurant.descriptionAr || "",
                priceRange: editingRestaurant.priceRange || "$$",
                phone: editingRestaurant.phone || "+962 79 000 0000",
                openingHours: editingRestaurant.openingHours || "12:00 PM - 12:00 AM",
                isFeatured: editingRestaurant.isFeatured || false
            });

            if (editingRestaurant.imageUrl) setImages([editingRestaurant.imageUrl]);
            if (editingRestaurant.amenities) setAmenities(editingRestaurant.amenities);
            if (editingRestaurant.menu) setMenu(editingRestaurant.menu);

            if (editingRestaurant.address && editingRestaurant.city) {
                setLocation(`${editingRestaurant.address}, ${editingRestaurant.city}`);
            } else {
                setLocation(editingRestaurant.address || editingRestaurant.city || "");
            }
        } else if (creatingRestaurant) {
            setDetails({
                nameEn: "",
                nameAr: "",
                cuisine: "Jordanian",
                descriptionEn: "",
                descriptionAr: "",
                priceRange: "$$",
                phone: "+962 79 000 0000",
                openingHours: "12:00 PM - 12:00 AM",
                isFeatured: false
            });
            setImages(["https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80"]);
            setAmenities(['Wifi', 'Parking']);
            setMenu([{ name: "", price: "", description: "" }]);
            setLocation("Rainbow Street, Amman");
        }
    }, [editingRestaurant, creatingRestaurant]);

    // Initialize offer form
    useEffect(() => {
        if (editingOffer) {
            setOfferDetails({
                title: editingOffer.title || "",
                titleAr: editingOffer.titleAr || "",
                description: editingOffer.description || "",
                descriptionAr: editingOffer.descriptionAr || "",
                discount: editingOffer.discount || "",
                discountAr: editingOffer.discountAr || "",
                restaurant: editingOffer.restaurant?._id || editingOffer.restaurant || "",
                imageUrl: editingOffer.imageUrl || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
                expiryDate: editingOffer.expiryDate ? new Date(editingOffer.expiryDate).toISOString().split('T')[0] : "",
                active: editingOffer.active
            });
        } else if (creatingOffer) {
            setOfferDetails({
                title: "",
                titleAr: "",
                description: "",
                descriptionAr: "",
                discount: "",
                discountAr: "",
                restaurant: "",
                imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                active: true
            });
        }
    }, [editingOffer, creatingOffer]);

    const handleSaveOffer = async () => {
        // Broad validation for all required fields in the schema
        const requiredFields = ['title', 'titleAr', 'discount', 'discountAr', 'description', 'descriptionAr'];
        const missingFields = requiredFields.filter(field => !offerDetails[field]);

        if (missingFields.length > 0) {
            setToast({
                type: 'error',
                message: language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة للعرض.' : "Please fill in all required fields for the offer."
            });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        try {
            let result;
            if (editingOffer) {
                result = await saveOffer(editingOffer._id, offerDetails);
            } else {
                result = await addNewOffer(offerDetails);
            }

            if (result.success) {
                setToast({ type: 'success', message: editingOffer ? 'Offer updated successfully' : 'New offer created' });
                setEditingOffer(null);
                setCreatingOffer(false);
                fetchAdminOffers();
            } else {
                setToast({ type: 'error', message: result.message || 'Failed to save offer' });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'An error occurred while saving the offer' });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleDeleteOffer = async (id) => {
        if (window.confirm("Are you sure you want to delete this offer?")) {
            const result = await removeOffer(id);
            if (result.success) {
                setToast({ type: 'success', message: 'Offer deleted successfully' });
            } else {
                setToast({ type: 'error', message: 'Failed to delete offer' });
            }
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleSave = async () => {
        if (!details.nameEn || !details.nameAr) {
            setToast({ type: 'error', message: t.fillNames });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        const [address, city] = location.split(', ').length > 1 ?
            [location.split(', ')[0], location.split(', ')[1]] :
            [location, ""];

        let imageUrl = images[0] || "";
        if (!imageUrl || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
            imageUrl = editingRestaurant?.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
        }

        const restaurantData = {
            name: details.nameEn,
            nameAr: details.nameAr,
            description: details.descriptionEn,
            descriptionAr: details.descriptionAr,
            address,
            city,
            cuisineType: details.cuisine,
            phone: details.phone,
            imageUrl,
            priceRange: details.priceRange,
            amenities,
            menu,
            openingHours: details.openingHours,
            isFeatured: details.isFeatured
        };

        try {
            let result;
            if (editingRestaurant) {
                result = await updateRestaurant(editingRestaurant._id, restaurantData);
            } else {
                result = await createRestaurant(restaurantData);
            }

            if (result.success) {
                setToast({ type: 'success', message: editingRestaurant ? t.changesSaved : t.resCreated });
                setEditingRestaurant(null);
                setCreatingRestaurant(false);
            } else {
                setToast({ type: 'error', message: result.message || t.resUpdateFailed });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'An error occurred while saving' });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleDelete = async (restaurantId) => {
        if (window.confirm(t.deleteRestaurantConfirm)) {
            const result = await deleteRestaurant(restaurantId);
            if (result.success) {
                setToast({ type: 'success', message: 'Restaurant deleted successfully' });
                fetchRestaurants();
            } else {
                setToast({ type: 'error', message: result.message || 'Failed to delete restaurant' });
            }
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImages([reader.result]);
            reader.readAsDataURL(file);
            setToast({ type: 'info', message: 'Image preview loaded.' });
            setTimeout(() => setToast(null), 3000);
        }
    };

    const toggleFeatured = async (restaurant) => {
        try {
            const result = await updateRestaurant(restaurant._id, { isFeatured: !restaurant.isFeatured });
            if (result.success) {
                setToast({ type: 'success', message: 'Featured status updated' });
                fetchRestaurants();
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Failed to update featured status' });
        }
        setTimeout(() => setToast(null), 3000);
    };

    if (user && user.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">{t.accessDenied}</h2>
                    <p className="text-gray-400 mb-6">{t.noPermission}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="text-accent hover:underline"
                    >
                        {t.returnPrevious}
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black font-heading mb-2 tracking-tight uppercase">
                        {activeTab === 'restaurants' ? t.manageRestaurants : t.manageOffers}
                    </h1>
                    <p className="text-gray-400 font-medium italic">
                        {activeTab === 'restaurants' ? t.welcomeBackAdmin : "Manage platform-wide exclusive deals."}
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-primary/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 flex">
                        <button
                            onClick={() => setActiveTab('restaurants')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'restaurants' ? 'bg-accent text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Store size={18} />
                            {t.restaurantsTab}
                        </button>
                        <button
                            onClick={() => setActiveTab('offers')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'offers' ? 'bg-accent text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Tag size={18} />
                            {t.exclusiveOffersTab}
                        </button>
                    </div>

                    <button
                        onClick={() => activeTab === 'restaurants' ? setCreatingRestaurant(true) : setCreatingOffer(true)}
                        className="bg-accent hover:bg-highlight text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-accent/20"
                    >
                        <Plus size={20} />
                        {activeTab === 'restaurants' ? t.addNewRestaurant : t.addOffer}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-8 right-8 z-[100]"
                    >
                        <div className={`backdrop-blur-xl border ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 shadow-red-500/10' : 'bg-white/80 border-white/20 shadow-black/5'} shadow-2xl rounded-3xl p-5 pr-12 flex items-center gap-4 min-w-[320px]`}>
                            <div className={`${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-accent text-white'} rounded-2xl p-3 shadow-lg`}>
                                <Save size={20} />
                            </div>
                            <div>
                                <h4 className={`font-black uppercase tracking-widest text-[10px] ${toast.type === 'error' ? 'text-red-500' : 'text-accent'}`}>{toast.type === 'success' ? t.success : 'Error'}</h4>
                                <p className={`font-bold text-sm leading-tight ${toast.type === 'error' ? 'text-red-900' : 'text-primary'}`}>{toast.message}</p>
                            </div>
                            <button
                                onClick={() => setToast(null)}
                                className={`absolute top-4 right-4 ${toast.type === 'error' ? 'text-red-400 hover:text-red-600' : 'text-gray-300 hover:text-primary'} transition-colors`}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {activeTab === 'restaurants' ? (
                /* Restaurant List */
                <div className="bg-primary/30 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Store className="text-accent" />
                            {t.allRestaurants}
                        </h2>
                        <span className="bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-accent/20">
                            {restaurants?.length || 0} Total
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.isArray(restaurants) && restaurants.map((restaurant) => (
                            <motion.div
                                key={restaurant._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group bg-secondary/50 border border-white/10 rounded-[2rem] overflow-hidden transition-all hover:shadow-2xl hover:border-accent/30 hover:-translate-y-2"
                            >
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <img
                                        src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={() => toggleFeatured(restaurant)}
                                            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center shadow-lg ${restaurant.isFeatured ? 'bg-yellow-400 text-white' : 'bg-white/90 text-gray-400 hover:text-yellow-500'}`}
                                            title="Toggle Featured"
                                        >
                                            <Sparkles size={18} fill={restaurant.isFeatured ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            onClick={() => window.open(`/restaurant/${restaurant._id}`, '_blank')}
                                            className="w-10 h-10 bg-white/90 hover:bg-white rounded-xl text-primary transition-all flex items-center justify-center shadow-lg"
                                            title="View"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setEditingRestaurant(restaurant)}
                                            className="w-10 h-10 bg-white/90 hover:bg-white rounded-xl text-primary transition-all flex items-center justify-center shadow-lg"
                                            title="Edit"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(restaurant._id)}
                                            className="w-10 h-10 bg-white/90 hover:bg-red-500 hover:text-white rounded-xl text-primary transition-all flex items-center justify-center shadow-lg"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    {restaurant.isFeatured && (
                                        <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                            <SparklesIcon size={12} fill="currentColor" /> Featured
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-black text-xl text-white tracking-tight leading-tight mb-1">
                                                {language === 'ar' ? restaurant.nameAr || restaurant.name : restaurant.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                                <MapPin size={12} className="text-accent" /> {restaurant.city}
                                            </p>
                                        </div>
                                        <span className="text-accent font-black text-lg">{restaurant.priceRange}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed italic">
                                        {language === 'ar'
                                            ? (restaurant.descriptionAr || restaurant.description)
                                            : (restaurant.description || "")}
                                    </p>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black tracking-widest uppercase text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Utensils size={12} className="text-accent" />
                                            {t.cuisines[restaurant.cuisineType] || restaurant.cuisineType}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} className="text-accent" />
                                            {restaurant.openingHours?.split('-')[0] || "12 PM"}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {(!restaurants || restaurants.length === 0) && (
                            <div className="col-span-full text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                                <Store size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
                                <p className="text-gray-500 font-bold">{t.noRestaurants}</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Offers List */
                <div className="bg-primary/30 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Tag className="text-accent" />
                            {t.manageOffers}
                        </h2>
                        <span className="bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-accent/20">
                            {offers?.length || 0} Total
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.isArray(offers) && offers.map((offer) => (
                            <motion.div
                                key={offer._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-secondary/50 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all hover:shadow-2xl hover:border-accent/30"
                            >
                                <div className="bg-primary p-8 text-center relative overflow-hidden">
                                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                                        <button
                                            onClick={() => setEditingOffer(offer)}
                                            className="w-10 h-10 bg-white/10 hover:bg-white hover:text-primary rounded-xl text-white transition-all flex items-center justify-center backdrop-blur-md border border-white/10"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOffer(offer._id)}
                                            className="w-10 h-10 bg-white/10 hover:bg-red-500 hover:text-white rounded-xl text-white transition-all flex items-center justify-center backdrop-blur-md border border-white/10"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="relative z-10 py-4">
                                        {offer.restaurant && (
                                            <span className="inline-block bg-accent/20 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20 mb-3 backdrop-blur-sm">
                                                <Store size={12} className="inline mr-1 -mt-0.5" />
                                                {language === 'ar' ? offer.restaurant.nameAr || offer.restaurant.name : offer.restaurant.name}
                                            </span>
                                        )}
                                        <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-3 block">
                                            {offer.active ? 'Active Promotion' : 'Inactive'}
                                        </span>
                                        <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                                            {language === 'ar' ? offer.titleAr : offer.title}
                                        </h3>
                                        <p className="text-accent font-black text-5xl my-4 drop-shadow-2xl">
                                            {language === 'ar' ? offer.discountAr : offer.discount}
                                        </p>
                                    </div>
                                    <div className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                </div>

                                <div className="p-8 text-center">
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 h-12 line-clamp-2">
                                        {language === 'ar' ? offer.descriptionAr : offer.description}
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 border-t border-white/5 pt-6">
                                        <CalendarIcon size={14} className="text-accent" />
                                        {t.offerExpiry}: {new Date(offer.expiryDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {(!offers || offers.length === 0) && (
                            <div className="col-span-full text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 text-gray-500 font-bold">
                                <Tag size={48} className="mx-auto mb-4 opacity-20" />
                                {t.noResults}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Restaurant Form Modal */}
            {(editingRestaurant || creatingRestaurant) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-gradient-to-b from-primary to-secondary border border-white/10 rounded-[3rem] w-full max-w-5xl my-8 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                                    <Store size={28} className="text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
                                        {editingRestaurant ? t.editRestaurant : t.addNewRestaurant}
                                    </h2>
                                    <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em]">Listing Configuration</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setEditingRestaurant(null); setCreatingRestaurant(false); }}
                                className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-all flex items-center justify-center"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-10 max-h-[70vh] overflow-y-auto premium-scrollbar space-y-12">
                            {/* General Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-black uppercase tracking-widest text-accent flex items-center gap-2">
                                        <FileText size={18} /> {t.generalInfo}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Name (EN)</label>
                                                <input type="text" value={details.nameEn} onChange={e => setDetails({ ...details, nameEn: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Name (AR)</label>
                                                <input type="text" value={details.nameAr} onChange={e => setDetails({ ...details, nameAr: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none text-right" dir="rtl" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.cuisineType}</label>
                                                <select value={details.cuisine} onChange={e => setDetails({ ...details, cuisine: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none">
                                                    {Object.keys(t.cuisines).map(c => <option key={c} value={c}>{t.cuisines[c]}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.priceRange}</label>
                                                <div className="flex bg-primary/50 p-1.5 rounded-2xl border border-white/10">
                                                    {['$', '$$', '$$$', '$$$$'].map(p => (
                                                        <button key={p} onClick={() => setDetails({ ...details, priceRange: p })} className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${details.priceRange === p ? 'bg-accent text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>{p}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.phone}</label>
                                                <input type="text" value={details.phone} onChange={e => setDetails({ ...details, phone: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none" dir="ltr" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.openingHours}</label>
                                                <input type="text" value={details.openingHours} onChange={e => setDetails({ ...details, openingHours: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-black uppercase tracking-widest text-accent flex items-center gap-2">
                                        <Image size={18} /> {t.photos}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="relative group rounded-3xl overflow-hidden border border-white/10 h-48">
                                            <img src={images[0]} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => fileInputRef.current.click()} className="bg-white text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                                    <Upload size={16} /> Update Image
                                                </button>
                                            </div>
                                        </div>
                                        <input type="text" placeholder="Image URL" value={images[0]?.startsWith('data:') ? '' : images[0]} onChange={e => setImages([e.target.value])} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none" />
                                        <input ref={fileInputRef} type="file" onChange={handleImageUpload} className="hidden" />
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                        <FileText size={14} className="text-accent" /> Description (EN)
                                    </label>
                                    <textarea rows="4" value={details.descriptionEn} onChange={e => setDetails({ ...details, descriptionEn: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-3xl px-6 py-4 text-white focus:border-accent outline-none resize-none leading-relaxed" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2 justify-end">
                                        Description (AR) <FileText size={14} className="text-accent" />
                                    </label>
                                    <textarea rows="4" value={details.descriptionAr} onChange={e => setDetails({ ...details, descriptionAr: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-3xl px-6 py-4 text-white focus:border-accent outline-none resize-none text-right leading-relaxed" dir="rtl" />
                                </div>
                            </div>

                            {/* Features Section */}
                            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                                <div className="flex items-center gap-3 mb-8">
                                    <SparklesIcon className="text-accent" />
                                    <h3 className="text-xl font-black uppercase tracking-tight">Status & Settings</h3>
                                </div>
                                <label className="flex items-center justify-between p-6 rounded-2xl bg-primary/50 border border-white/10 cursor-pointer hover:border-accent/50 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${details.isFeatured ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-white/5 text-gray-500'}`}>
                                            <SparklesIcon size={24} fill={details.isFeatured ? "currentColor" : "none"} />
                                        </div>
                                        <div>
                                            <p className="font-black text-white uppercase tracking-widest text-sm">Featured Profile</p>
                                            <p className="text-xs text-gray-500">Pin this restaurant to the home page featured section.</p>
                                        </div>
                                    </div>
                                    <input type="checkbox" checked={details.isFeatured} onChange={e => setDetails({ ...details, isFeatured: e.target.checked })} className="w-6 h-6 rounded-lg accent-accent" />
                                </label>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-white/5">
                            <button onClick={() => { setEditingRestaurant(null); setCreatingRestaurant(false); }} className="px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-500 hover:text-white transition-all">Cancel</button>
                            <button onClick={handleSave} className="bg-accent hover:bg-highlight text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-accent/20 transition-all flex items-center gap-3">
                                <Save size={18} /> {editingRestaurant ? 'Update Listing' : 'Create Listing'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Offer Form Modal */}
            {(editingOffer || creatingOffer) && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-gradient-to-b from-primary to-secondary border border-white/10 rounded-[3rem] w-full max-w-4xl my-8 shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                                    <Tag size={28} className="text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
                                        {editingOffer ? t.editOffer : t.addOffer}
                                    </h2>
                                    <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em]">{t.exclusiveOffersTab}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setEditingOffer(null); setCreatingOffer(false); }}
                                className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-all flex items-center justify-center"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.offerTitle} (EN)</label>
                                    <input type="text" value={offerDetails.title} onChange={e => setOfferDetails({ ...offerDetails, title: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none" placeholder="e.g. Weekend Special" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.offerTitle} (AR)</label>
                                    <input type="text" value={offerDetails.titleAr} onChange={e => setOfferDetails({ ...offerDetails, titleAr: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none text-right" dir="rtl" placeholder="مثال: عرض نهاية الأسبوع" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.offerDiscount} (EN)</label>
                                    <input type="text" value={offerDetails.discount} onChange={e => setOfferDetails({ ...offerDetails, discount: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none" placeholder="e.g. 20% OFF" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.offerDiscount} (AR)</label>
                                    <input type="text" value={offerDetails.discountAr} onChange={e => setOfferDetails({ ...offerDetails, discountAr: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none text-right" dir="rtl" placeholder="مثال: خصم 20%" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">
                                    {language === 'ar' ? 'المطعم المرتبط بالعرض' : 'Associated Restaurant'}
                                </label>
                                <select
                                    value={offerDetails.restaurant}
                                    onChange={e => setOfferDetails({ ...offerDetails, restaurant: e.target.value })}
                                    className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none appearance-none"
                                >
                                    <option value="">{language === 'ar' ? 'اختر مطعماً (اختياري)' : 'Select a Restaurant (Optional)'}</option>
                                    {Array.isArray(restaurants) && restaurants.map(res => (
                                        <option key={res._id} value={res._id}>
                                            {language === 'ar' ? res.nameAr || res.name : res.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.offerExpiry}</label>
                                    <input type="date" value={offerDetails.expiryDate} onChange={e => setOfferDetails({ ...offerDetails, expiryDate: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.status}</label>
                                    <div className="flex bg-primary/50 p-1.5 rounded-2xl border border-white/10">
                                        <button onClick={() => setOfferDetails({ ...offerDetails, active: true })} className={`flex-1 py-2 rounded-xl font-black text-xs transition-all ${offerDetails.active ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-gray-500'}`}>{t.active}</button>
                                        <button onClick={() => setOfferDetails({ ...offerDetails, active: false })} className={`flex-1 py-2 rounded-xl font-black text-xs transition-all ${!offerDetails.active ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500'}`}>{t.inactive}</button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.descriptionLabel} (EN)</label>
                                    <textarea rows="3" value={offerDetails.description} onChange={e => setOfferDetails({ ...offerDetails, description: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none resize-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 text-right block">{t.descriptionLabel} (AR)</label>
                                    <textarea rows="3" value={offerDetails.descriptionAr} onChange={e => setOfferDetails({ ...offerDetails, descriptionAr: e.target.value })} className="w-full bg-primary/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none resize-none text-right" dir="rtl" />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-white/5">
                            <button onClick={() => { setEditingOffer(null); setCreatingOffer(false); }} className="px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-500 hover:text-white transition-all">Cancel</button>
                            <button onClick={handleSaveOffer} className="bg-accent hover:bg-highlight text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-accent/20 transition-all flex items-center gap-3">
                                <Save size={18} /> {editingOffer ? t.editOffer : t.addOffer}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}