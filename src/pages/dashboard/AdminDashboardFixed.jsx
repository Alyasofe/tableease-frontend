import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRestaurants } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { Save, Upload, Plus, X, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const { restaurants, loading, fetchRestaurants, updateRestaurant, deleteRestaurant, createRestaurant } = useRestaurants();
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [creatingRestaurant, setCreatingRestaurant] = useState(false);
    const [details, setDetails] = useState({
        nameEn: "",
        nameAr: "",
        cuisine: "Jordanian",
        descriptionEn: "",
        descriptionAr: "",
        priceRange: "$$",
        phone: "+962 79 000 0000",
        openingHours: "12:00 PM - 12:00 AM"
    });
    const [images, setImages] = useState([
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80"
    ]);
    const [amenities, setAmenities] = useState(['Wifi', 'Parking']);
    const [menu, setMenu] = useState([
        { name: "", price: "", description: "" }
    ]);
    const [location, setLocation] = useState("Rainbow Street, Amman");
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch all restaurants when component mounts
    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchRestaurants();
        }
    }, [user, fetchRestaurants]);

    // Initialize form when editing or creating
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
                openingHours: editingRestaurant.openingHours || "12:00 PM - 12:00 AM"
            });

            if (editingRestaurant.imageUrl) {
                setImages([editingRestaurant.imageUrl]);
            }

            if (editingRestaurant.amenities) {
                setAmenities(editingRestaurant.amenities);
            }

            if (editingRestaurant.menu) {
                setMenu(editingRestaurant.menu);
            }

            // Set location from address and city
            if (editingRestaurant.address && editingRestaurant.city) {
                setLocation(`${editingRestaurant.address}, ${editingRestaurant.city}`);
            } else if (editingRestaurant.address) {
                setLocation(editingRestaurant.address);
            } else if (editingRestaurant.city) {
                setLocation(editingRestaurant.city);
            }
        } else if (creatingRestaurant) {
            // Reset form for new restaurant
            setDetails({
                nameEn: "",
                nameAr: "",
                cuisine: "Jordanian",
                descriptionEn: "",
                descriptionAr: "",
                priceRange: "$$",
                phone: "+962 79 000 0000",
                openingHours: "12:00 PM - 12:00 AM"
            });
            setImages(["https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80"]);
            setAmenities(['Wifi', 'Parking']);
            setMenu([{ name: "", price: "", description: "" }]);
            setLocation("Rainbow Street, Amman");
        }
    }, [editingRestaurant, creatingRestaurant]);

    const handleSave = async () => {
        if (!details.nameEn || !details.nameAr) {
            setToast({ type: 'error', message: "Please fill in at least the Restaurant Names (AR & EN)." });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        // Prepare restaurant data
        const [address, city] = location.split(', ').length > 1 ?
            [location.split(', ')[0], location.split(', ')[1]] :
            [location, ""];

        // Handle image data - preserve existing image if no new image was uploaded
        // For now, we'll use a default image URL to prevent database issues
        // In production, you would upload to a cloud service and use the returned URL
        let imageUrl = images[0];

        // FIXED: Image handling logic
        // If we're editing and the image is a data URL (preview), keep the existing image
        if (editingRestaurant && imageUrl && imageUrl.startsWith('data:image')) {
            imageUrl = editingRestaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
        } else if (editingRestaurant && (!imageUrl || imageUrl === "")) {
            // If no image is selected, keep the existing one
            imageUrl = editingRestaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
        } else if (!editingRestaurant && imageUrl && imageUrl.startsWith('data:image')) {
            // For new restaurants with preview images, use a default image
            // In a real app, you would upload to cloud storage and get a proper URL
            imageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";

            // Show a warning to the user
            setToast({
                type: 'warning',
                message: 'Using default image. In production, uploaded images would be stored in cloud storage.'
            });
            setTimeout(() => setToast(null), 3000);
        }

        const restaurantData = {
            name: details.nameEn,
            nameAr: details.nameAr,
            description: details.descriptionEn,
            descriptionAr: details.descriptionAr,
            address: address,
            city: city,
            cuisineType: details.cuisine,
            phone: details.phone,
            imageUrl: imageUrl,
            priceRange: details.priceRange,
            amenities: amenities,
            menu: menu,
            openingHours: details.openingHours
        };

        try {
            let result;
            if (editingRestaurant) {
                // Update existing restaurant
                result = await updateRestaurant(editingRestaurant._id, restaurantData);
            } else {
                // Create new restaurant
                result = await createRestaurant(restaurantData);
            }

            if (result.success) {
                setToast({ type: 'success', message: editingRestaurant ? t.changesSaved : t.resCreated });
                setEditingRestaurant(null);
                setCreatingRestaurant(false);
                // The RestaurantContext now handles refreshing the restaurant list
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
            try {
                const result = await deleteRestaurant(restaurantId);
                if (result.success) {
                    setToast({ type: 'success', message: 'Restaurant deleted successfully' });
                    fetchRestaurants(); // Refresh the list
                } else {
                    setToast({ type: 'error', message: result.message || 'Failed to delete restaurant' });
                }
            } catch (error) {
                setToast({ type: 'error', message: 'An error occurred while deleting' });
            } finally {
                setTimeout(() => setToast(null), 3000);
            }
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // For now, we'll use a placeholder approach since we don't have cloud storage
            // In a real implementation, you would upload to a service like Cloudinary, AWS S3, etc.

            // Show preview immediately using FileReader
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages([reader.result]);
            };
            reader.readAsDataURL(file);

            // Set a default image URL for the actual restaurant data
            // This prevents issues with large base64 strings in the database
            // In production, you would replace this with the actual uploaded image URL
            setToast({
                type: 'info',
                message: 'Image preview loaded. In production, this would be uploaded to cloud storage.'
            });
            setTimeout(() => setToast(null), 3000);
        }
    };

    const removeImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const toggleAmenity = (amenity) => {
        setAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const addMenuItem = () => {
        setMenu([...menu, { name: "", price: "", description: "" }]);
    };

    const updateMenuItem = (index, field, value) => {
        const newMenu = [...menu];
        newMenu[index][field] = value;
        setMenu(newMenu);
    };

    const removeMenuItem = (index) => {
        setMenu(menu.filter((_, i) => i !== index));
    };

    if (user && user.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-gray-400 mb-6">You do not have permission to access the admin dashboard.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="text-accent hover:underline"
                    >
                        Return to Previous Page
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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-heading font-bold">{t.adminDashboard}</h1>
                <button
                    onClick={() => setCreatingRestaurant(true)}
                    className="flex items-center gap-2 bg-accent hover:bg-highlight text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <Plus size={18} />
                    {t.addNewRestaurant}
                </button>
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className={`bg-white border-l-4 ${toast.type === 'error' ? 'border-red-500' : 'border-green-500'} shadow-2xl rounded-lg p-4 pr-8 flex items-center gap-3 min-w-[300px]`}>
                        <div className={`${toast.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-full p-2`}>
                            <Save size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{toast.type === 'success' ? t.success : 'Error'}</h4>
                            <p className="text-gray-600 text-sm">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Close</span>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Restaurant List */}
            <div className="bg-primary border border-white/5 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6">{t.allRestaurants}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants && restaurants.map((restaurant) => (
                        <div key={restaurant._id} className="bg-secondary border border-white/10 rounded-xl overflow-hidden transition-all hover:shadow-lg">
                            <div className="h-40 bg-gray-200 relative">
                                <img
                                    src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => window.open(`/restaurant/${restaurant._id}`, '_blank')}
                                        className="bg-white/80 hover:bg-white p-2 rounded-full text-gray-800 transition-all"
                                        title="View"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setEditingRestaurant(restaurant)}
                                        className="bg-white/80 hover:bg-white p-2 rounded-full text-gray-800 transition-all"
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(restaurant._id)}
                                        className="bg-white/80 hover:bg-red-500 hover:text-white p-2 rounded-full text-gray-800 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{restaurant.name}</h3>
                                    <span className="text-accent font-bold">{restaurant.priceRange}</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">{restaurant.description?.substring(0, 60)}...</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{restaurant.city}</span>
                                    <span className="bg-accent/20 text-accent px-2 py-1 rounded-full">{restaurant.cuisineType}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!restaurants || restaurants.length === 0) && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            {t.noRestaurants}
                        </div>
                    )}
                </div>
            </div>

            {/* Restaurant Form Modal */}
            {(editingRestaurant || creatingRestaurant) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-primary border border-white/5 rounded-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">{editingRestaurant ? t.editRestaurant : t.addNewRestaurant}</h2>
                                <button
                                    onClick={() => {
                                        setEditingRestaurant(null);
                                        setCreatingRestaurant(false);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* General Info */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-secondary border border-white/10 p-6 rounded-2xl space-y-6">
                                        <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">{t.generalInfo}</h3>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">{t.restaurantName} (EN)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Sufra Restaurant"
                                                    value={details.nameEn}
                                                    onChange={e => setDetails({ ...details, nameEn: e.target.value })}
                                                    className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">{t.restaurantName} (AR)</label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: مطعم سفرة"
                                                    value={details.nameAr}
                                                    onChange={e => setDetails({ ...details, nameAr: e.target.value })}
                                                    className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none text-right"
                                                    dir="rtl"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">{t.cuisineType}</label>
                                                <select
                                                    value={details.cuisine}
                                                    onChange={e => setDetails({ ...details, cuisine: e.target.value })}
                                                    className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                                >
                                                    <option value="Jordanian">Jordanian</option>
                                                    <option value="Italian">Italian</option>
                                                    <option value="International">International</option>
                                                    <option value="Levantine">Levantine</option>
                                                    <option value="Cafe">Cafe</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">{t.priceRange}</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {["$", "$$", "$$$", "$$$$"].map((range) => (
                                                        <button
                                                            key={range}
                                                            onClick={() => setDetails({ ...details, priceRange: range })}
                                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${details.priceRange === range
                                                                ? 'bg-accent text-white shadow-lg border border-accent'
                                                                : 'bg-primary border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                                                }`}
                                                        >
                                                            {range}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">{t.phone}</label>
                                                <input
                                                    type="text"
                                                    value={details.phone}
                                                    onChange={e => setDetails({ ...details, phone: e.target.value })}
                                                    className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                                    dir="ltr"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">{t.openingHours}</label>
                                                <input
                                                    type="text"
                                                    value={details.openingHours}
                                                    onChange={e => setDetails({ ...details, openingHours: e.target.value })}
                                                    className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                                    placeholder="e.g. 12:00 PM - 12:00 AM"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">{t.description} (EN)</label>
                                            <textarea
                                                rows="3"
                                                value={details.descriptionEn}
                                                onChange={e => setDetails({ ...details, descriptionEn: e.target.value })}
                                                className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">{t.description} (AR)</label>
                                            <textarea
                                                rows="3"
                                                value={details.descriptionAr}
                                                onChange={e => setDetails({ ...details, descriptionAr: e.target.value })}
                                                className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none text-right"
                                                dir="rtl"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="bg-secondary border border-white/10 p-6 rounded-2xl">
                                        <h3 className="text-xl font-bold mb-4">{t.amenities}</h3>

                                        {/* Active Amenities (Tags) */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {amenities.map(amenity => (
                                                <span key={amenity} className="flex items-center gap-2 bg-accent/20 border border-accent text-accent px-3 py-1.5 rounded-full text-sm font-medium">
                                                    {amenity}
                                                    <button
                                                        onClick={() => toggleAmenity(amenity)}
                                                        className="hover:bg-accent/20 rounded-full p-0.5"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                            {amenities.length === 0 && <span className="text-gray-500 text-sm italic py-2">No amenities selected. Add some below!</span>}
                                        </div>

                                        {/* Add Custom Amenity */}
                                        <div className="flex gap-2 mb-6">
                                            <input
                                                type="text"
                                                placeholder="Add custom amenity"
                                                className="flex-1 bg-primary border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none text-sm"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = e.target.value.trim();
                                                        if (val && !amenities.includes(val)) {
                                                            toggleAmenity(val);
                                                            e.target.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    const input = e.target.previousSibling;
                                                    const val = input.value.trim();
                                                    if (val && !amenities.includes(val)) {
                                                        toggleAmenity(val);
                                                        input.value = '';
                                                    }
                                                }}
                                                className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg transition-colors"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        {/* Suggestions */}
                                        <div>
                                            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-bold">Suggested</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['Wifi', 'Parking', 'Outdoor Seating', 'Live Music', 'Valet', 'Wheelchair Accessible', 'Family Friendly', 'Shisha', 'Sea View'].map(amenity => (
                                                    !amenities.includes(amenity) && (
                                                        <button
                                                            key={amenity}
                                                            onClick={() => toggleAmenity(amenity)}
                                                            className="px-3 py-1.5 rounded-lg border border-white/10 bg-primary text-gray-400 hover:text-white hover:border-white/20 text-sm transition-all"
                                                        >
                                                            + {amenity}
                                                        </button>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Highlights */}
                                    <div className="bg-secondary border border-white/10 p-6 rounded-2xl">
                                        <h3 className="text-xl font-bold mb-4">{t.popularDishes}</h3>
                                        <div className="space-y-4">
                                            {menu.map((item, index) => (
                                                <div key={index} className="flex gap-4 items-start bg-primary p-4 rounded-xl">
                                                    <div className="flex-1 space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Dish Name"
                                                            value={item.name}
                                                            onChange={e => updateMenuItem(index, 'name', e.target.value)}
                                                            className="w-full bg-transparent border-b border-white/10 focus:border-accent outline-none text-sm pb-1 text-white"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Dish Description"
                                                            value={item.description}
                                                            onChange={e => updateMenuItem(index, 'description', e.target.value)}
                                                            className="w-full bg-transparent border-b border-white/10 focus:border-accent outline-none text-xs pb-1 text-gray-400"
                                                        />
                                                    </div>
                                                    <div className="w-24">
                                                        <input
                                                            type="text"
                                                            placeholder="Price"
                                                            value={item.price}
                                                            onChange={e => updateMenuItem(index, 'price', e.target.value)}
                                                            className="w-full bg-transparent border-b border-white/10 focus:border-accent outline-none text-sm pb-1 text-accent font-bold text-right"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeMenuItem(index)}
                                                        className="text-red-400 hover:text-red-500 mt-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={addMenuItem}
                                                className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-accent transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} /> {t.addDish}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar: Images & Location */}
                                <div className="space-y-8">
                                    <div className="bg-secondary border border-white/10 p-6 rounded-2xl">
                                        <h3 className="text-xl font-bold mb-4">{t.photos}</h3>
                                        <div className="mb-4">
                                            <img
                                                src={images[0]}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg mb-4"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="flex-1 bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-highlight cursor-pointer"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="bg-accent hover:bg-highlight text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    <Upload size={18} />
                                                    {t.upload}
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">Select an image file to upload (JPG, PNG, GIF)</p>
                                            {images[0] && images[0].startsWith('data:image') && (
                                                <div className="mt-2 p-2 bg-blue-900/20 border border-blue-700 rounded-lg">
                                                    <p className="text-xs text-blue-400">Preview loaded. Actual restaurant will use a standard image URL.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-secondary border border-white/10 p-6 rounded-2xl">
                                        <h3 className="text-xl font-bold mb-4">{t.location}</h3>
                                        <div className="mb-4">
                                            <label className="block text-gray-400 text-sm mb-2">Address</label>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                                placeholder="e.g. Rainbow Street, Amman"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setEditingRestaurant(null);
                                        setCreatingRestaurant(false);
                                    }}
                                    className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-accent hover:bg-highlight text-white px-6 py-3 rounded-xl font-bold transition-all"
                                >
                                    <Save size={18} />
                                    {editingRestaurant ? t.updateRestaurant : t.createRestaurant}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}