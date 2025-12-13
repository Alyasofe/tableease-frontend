import { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Save, Upload, Plus, X, Trash2 } from 'lucide-react';

export default function RestaurantManager() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // State for form fields
    const [details, setDetails] = useState(() => {
        const saved = localStorage.getItem('restaurant_details');
        return saved ? JSON.parse(saved) : {
            nameEn: "",
            nameAr: "",
            cuisine: "Jordanian",
            descriptionEn: "",
            descriptionAr: "",
            priceRange: "$$",
            phone: "+962 79 000 0000",
            openingHours: "12:00 PM - 12:00 AM"
        };
    });

    const [images, setImages] = useState(() => {
        const saved = localStorage.getItem('restaurant_images');
        return saved ? JSON.parse(saved) : [
            "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80"
        ];
    });

    const [amenities, setAmenities] = useState(() => {
        const saved = localStorage.getItem('restaurant_amenities');
        return saved ? JSON.parse(saved) : ['Wifi', 'Parking'];
    });

    const [menu, setMenu] = useState(() => {
        const saved = localStorage.getItem('restaurant_menu');
        return saved ? JSON.parse(saved) : [
            { name: "Mansaf", price: "12.00 JD", description: "Traditional Jordanian dish", image: null },
            { name: "Musakhan Rolls", price: "5.00 JD", description: "Chicken with sumac and onions", image: null }
        ];
    });

    const [offers, setOffers] = useState(() => {
        const saved = localStorage.getItem('restaurant_offers');
        return saved ? JSON.parse(saved) : [];
    });

    const [capacities, setCapacities] = useState(() => {
        const saved = localStorage.getItem('restaurant_capacities');
        return saved ? JSON.parse(saved) : { main: 40, terrace: 20 };
    });
    const [location, setLocation] = useState(() => {
        return localStorage.getItem('restaurant_location') || "Rainbow Street, Amman";
    });

    const [toast, setToast] = useState(null);

    const handleSave = () => {
        if (!details.nameEn || !details.nameAr) {
            setToast({ type: 'error', message: "Please fill in at least the Restaurant Names (AR & EN)." });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        setLoading(true);
        // Simulate API / DB Save
        setTimeout(() => {
            localStorage.setItem('restaurant_details', JSON.stringify(details));
            localStorage.setItem('restaurant_capacities', JSON.stringify(capacities));
            localStorage.setItem('restaurant_location', location);
            localStorage.setItem('restaurant_images', JSON.stringify(images));
            localStorage.setItem('restaurant_amenities', JSON.stringify(amenities));
            localStorage.setItem('restaurant_menu', JSON.stringify(menu));
            localStorage.setItem('restaurant_offers', JSON.stringify(offers));
            setLoading(false);
            setToast({ type: 'success', message: t.changesSaved });
            setTimeout(() => setToast(null), 3000);
        }, 1500);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
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

    const handleMenuImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newMenu = [...menu];
                newMenu[index].image = reader.result;
                setMenu(newMenu);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeMenuItem = (index) => {
        setMenu(menu.filter((_, i) => i !== index));
    };

    // Offers Logic
    const addOffer = () => {
        setOffers([...offers, { id: Date.now(), title: "", description: "", discount: "", active: true }]);
    };

    const updateOffer = (index, field, value) => {
        const newOffers = [...offers];
        newOffers[index][field] = value;
        setOffers(newOffers);
    };

    const removeOffer = (index) => {
        setOffers(offers.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-heading font-bold">{t.manageRestaurant}</h1>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-accent hover:bg-highlight text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-70"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Save size={18} />
                    )}
                    {loading ? "Saving..." : t.saveChanges}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-primary border border-white/5 p-8 rounded-2xl space-y-6">
                        <h3 className="text-xl font-bold mb-4 border-b border-white/5 pb-4">{t.generalInfo}</h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">{t.nameEn}</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sufra Restaurant"
                                    value={details.nameEn}
                                    onChange={e => setDetails({ ...details, nameEn: e.target.value })}
                                    className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">{t.nameAr}</label>
                                <input
                                    type="text"
                                    placeholder="مثال: مطعم سفرة"
                                    value={details.nameAr}
                                    onChange={e => setDetails({ ...details, nameAr: e.target.value })}
                                    className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none text-right"
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
                                    className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                >
                                    <option>Jordanian</option>
                                    <option>Italian</option>
                                    <option>International</option>
                                    <option>Levantine</option>
                                    <option>Cafe</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">{t.priceRange}</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { val: '$', label: t.priceLevels.budget },
                                        { val: '$$', label: t.priceLevels.casual },
                                        { val: '$$$', label: t.priceLevels.upscale },
                                        { val: '$$$$', label: t.priceLevels.luxury }
                                    ].map((option) => (
                                        <button
                                            key={option.val}
                                            onClick={() => setDetails({ ...details, priceRange: option.val })}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${details.priceRange === option.val
                                                ? 'bg-accent text-white shadow-lg border border-accent'
                                                : 'bg-secondary border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                                }`}
                                        >
                                            {option.label}
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
                                    className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">{t.openingHours}</label>
                                <div className="flex items-center gap-2 bg-secondary border border-white/10 rounded-lg px-4 py-2">
                                    <input
                                        type="time"
                                        className="bg-transparent text-white outline-none w-full appearance-none"
                                        onChange={(e) => {
                                            const open = e.target.value;
                                            const close = details.openingHours.split(' - ')[1] || "12:00 AM";
                                            // Simple formatter, real app would use date-fns/moment
                                            setDetails({ ...details, openingHours: `${open} - ${close}` });
                                        }}
                                    />
                                    <span className="text-gray-400">to</span>
                                    <input
                                        type="time"
                                        className="bg-transparent text-white outline-none w-full appearance-none"
                                        onChange={(e) => {
                                            const open = details.openingHours.split(' - ')[0] || "12:00 PM";
                                            const close = e.target.value;
                                            setDetails({ ...details, openingHours: `${open} - ${close}` });
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 pl-1">Current: {details.openingHours}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">{t.descEn}</label>
                            <textarea
                                rows="3"
                                value={details.descriptionEn}
                                onChange={e => setDetails({ ...details, descriptionEn: e.target.value })}
                                className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">{t.descAr}</label>
                            <textarea
                                rows="3"
                                value={details.descriptionAr}
                                onChange={e => setDetails({ ...details, descriptionAr: e.target.value })}
                                className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none text-right"
                                dir="rtl"
                            ></textarea>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-primary border border-white/5 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4">{t.amenities}</h3>

                        {/* Active Amenities (Tags) */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {amenities.map(amenity => (
                                <span key={amenity} className="flex items-center gap-2 bg-accent/20 border border-accent text-accent px-3 py-1.5 rounded-full text-sm font-medium animate-in zoom-in duration-200">
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
                                placeholder={t.addDish || "Add custom amenity"}
                                className="flex-1 bg-secondary border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = e.target.value.trim();
                                        if (val && !amenities.includes(val)) {
                                            setAmenities([...amenities, val]);
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
                                        setAmenities([...amenities, val]);
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
                                            onClick={() => setAmenities(prev => [...prev, amenity])}
                                            className="px-3 py-1.5 rounded-lg border border-white/5 bg-secondary text-gray-400 hover:text-white hover:border-white/20 text-sm transition-all"
                                        >
                                            + {amenity}
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Menu Highlights */}
                    <div className="bg-primary border border-white/5 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4">{t.popularDishes}</h3>
                        <div className="space-y-4">
                            {menu.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start bg-secondary p-4 rounded-xl">
                                    {/* Dish Image Upload */}
                                    <div className="w-20 h-20 bg-white/5 rounded-lg border border-dashed border-white/20 flex-shrink-0 relative overflow-hidden group">
                                        {item.image ? (
                                            <img src={item.image} alt="Dish" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <Upload size={16} />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={(e) => handleMenuImageUpload(index, e)}
                                        />
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            placeholder={t.dishName}
                                            value={item.name}
                                            onChange={e => updateMenuItem(index, 'name', e.target.value)}
                                            className="w-full bg-transparent border-b border-white/10 focus:border-accent outline-none text-sm pb-1 text-white"
                                        />
                                        <input
                                            type="text"
                                            placeholder={t.dishDesc}
                                            value={item.description}
                                            onChange={e => updateMenuItem(index, 'description', e.target.value)}
                                            className="w-full bg-transparent border-b border-white/10 focus:border-accent outline-none text-xs pb-1 text-gray-400"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <input
                                            type="text"
                                            placeholder={t.price}
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

                    {/* Tables & Capacity */}
                    <div className="bg-primary border border-white/5 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4">{t.seatingCapacity}</h3>
                        <div className="flex items-center justify-between bg-secondary p-4 rounded-xl mb-2">
                            <span>{t.mainHall}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCapacities(prev => ({ ...prev, main: Math.max(0, prev.main - 1) }))}
                                    className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">{capacities.main}</span>
                                <button
                                    onClick={() => setCapacities(prev => ({ ...prev, main: prev.main + 1 }))}
                                    className="w-8 h-8 rounded bg-accent flex items-center justify-center hover:bg-highlight transition-all"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-secondary p-4 rounded-xl">
                            <span>{t.terrace}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCapacities(prev => ({ ...prev, terrace: Math.max(0, prev.terrace - 1) }))}
                                    className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">{capacities.terrace}</span>
                                <button
                                    onClick={() => setCapacities(prev => ({ ...prev, terrace: prev.terrace + 1 }))}
                                    className="w-8 h-8 rounded bg-accent flex items-center justify-center hover:bg-highlight transition-all"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Manage Offers */}
                    <div className="bg-primary border border-white/5 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4">Special Offers</h3>
                        <div className="space-y-4">
                            {offers.map((offer, index) => (
                                <div key={index} className="bg-secondary p-4 rounded-xl border border-white/5 relative">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Offer Title (e.g. Taco Tuesday)"
                                            value={offer.title}
                                            onChange={e => updateOffer(index, 'title', e.target.value)}
                                            className="bg-transparent border-b border-white/10 focus:border-accent outline-none text-white font-bold"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Discount (e.g. 20% OFF)"
                                            value={offer.discount}
                                            onChange={e => updateOffer(index, 'discount', e.target.value)}
                                            className="bg-transparent border-b border-white/10 focus:border-accent outline-none text-accent font-bold"
                                        />
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-400">Active</label>
                                            <input
                                                type="checkbox"
                                                checked={offer.active}
                                                onChange={e => updateOffer(index, 'active', e.target.checked)}
                                                className="accent-accent w-4 h-4"
                                            />
                                        </div>
                                    </div>
                                    <textarea
                                        placeholder="Offer details..."
                                        rows="2"
                                        value={offer.description}
                                        onChange={e => updateOffer(index, 'description', e.target.value)}
                                        className="w-full bg-transparent border border-white/10 rounded-lg p-2 text-sm text-gray-300 focus:border-accent outline-none"
                                    ></textarea>
                                    <button
                                        onClick={() => removeOffer(index)}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addOffer}
                                className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-accent transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add New Offer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Images & Location */}
                <div className="space-y-8">
                    <div className="bg-primary border border-white/5 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4">{t.photos}</h3>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {images.map((img, i) => (
                                <div key={i} className="relative group h-24">
                                    <img src={img} className="rounded-lg w-full h-full object-cover" alt={`Restaurant ${i}`} />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-secondary border border-dashed border-white/20 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:border-accent transition-all h-24"
                            >
                                <Plus />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    <div className="bg-primary border border-white/5 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4">{t.location}</h3>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-2">{t.addressCity}</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent outline-none"
                                placeholder="e.g. Rainbow Street, Amman"
                            />
                        </div>
                        <div className="h-48 bg-gray-700 rounded-lg overflow-hidden relative border border-white/10">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                title="map"
                                scrolling="no"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                className="opacity-80 hover:opacity-100 transition-opacity"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className={`bg-white border-l-4 ${toast.type === 'error' ? 'border-red-500' : 'border-green-500'} shadow-2xl rounded-lg p-4 pr-8 flex items-center gap-3 min-w-[300px]`}>
                        <div className={`${toast.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-full p-2`}>
                            <Save size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{t.success}</h4>
                            <p className="text-gray-600 text-sm">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Close</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
