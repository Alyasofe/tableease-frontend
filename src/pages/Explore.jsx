import { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { useLanguage } from '../context/LanguageContext';
import { useSearchParams } from 'react-router-dom';

export default function Explore() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('search') || '';
    const [filter, setFilter] = useState('All');
    const { t, language } = useLanguage();
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
                rating: 5.0, // New restaurants start high!
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
            // If nothing saved, maybe we can keep it empty or show a placeholder?
            // User asked specifically to remove defaults and show added. 
            setRestaurants([]);
        }
    }, []);

    const filtered = restaurants.filter(r => {
        const matchesCuisine = filter === 'All' || r.cuisine === filter;

        // Helper to safely get string values for search
        const nameEn = r.name?.en || "";
        const nameAr = r.name?.ar || "";
        const descEn = r.description?.en || "";
        const descAr = r.description?.ar || "";

        const q = query.toLowerCase();

        const matchesSearch =
            nameEn.toLowerCase().includes(q) ||
            nameAr.toLowerCase().includes(q) ||
            descEn.toLowerCase().includes(q) ||
            descAr.toLowerCase().includes(q);

        return matchesCuisine && matchesSearch;
    });

    const cuisines = ['All', 'Jordanian', 'Italian', 'Cafe', 'Levantine'];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-cream">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold font-heading text-primary mb-8">{t.exploreDining}</h1>

                <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
                    {cuisines.map(c => (
                        <button
                            key={c}
                            onClick={() => setFilter(c)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${filter === c ? 'bg-accent text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {t.cuisines[c] || c}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filtered.map(item => (
                        <RestaurantCard key={item.id} data={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
