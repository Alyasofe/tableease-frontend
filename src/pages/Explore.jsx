import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RestaurantCard, { RestaurantSkeleton } from '../components/RestaurantCard';
import { useLanguage } from '../context/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantContext';
import { Search, SlidersHorizontal, X, Compass } from 'lucide-react';

export default function Explore() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('search') || '';
    const showFeaturedOnly = searchParams.get('featured') === 'true';
    const [filter, setFilter] = useState('All');
    const [searchInput, setSearchInput] = useState(query);
    const [isSearchHovered, setIsSearchHovered] = useState(false);
    const { t, language } = useLanguage();
    const { restaurants, loading } = useRestaurants();

    // Sync search input with URL query
    useEffect(() => {
        setSearchInput(query);
    }, [query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchInput) params.set('search', searchInput);
        else params.delete('search');
        setSearchParams(params);
    };

    const clearSearch = () => {
        setSearchInput('');
        const params = new URLSearchParams(searchParams);
        params.delete('search');
        setSearchParams(params);
    };

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

    const filtered = transformedRestaurants.filter(r => {
        if (showFeaturedOnly && !r.isFeatured) return false;
        const matchesCuisine = filter === 'All' || r.cuisine === filter;

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

    const cuisines = ['All', 'Jordanian', 'Italian', 'Cafe', 'Levantine', 'International'];

    return (
        <div className="min-h-screen pt-40 pb-32 bg-[#F9FAFB] selection:bg-accent/30 font-inter relative overflow-x-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Mesh Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Editorial Header */}
                <div className="max-w-4xl mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px]">
                            {language === 'ar' ? "أرقى الوجهات" : "ELITE VENUES"}
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-8xl font-black font-heading text-primary tracking-tighter leading-[0.9] mb-8">
                        {t.exploreDining}<span className="text-accent">.</span>
                    </h1>

                    <p className="text-xl md:text-3xl font-light text-gray-400 max-w-2xl leading-relaxed italic">
                        "{t.discoverDesc}"
                    </p>
                </div>

                {/* Nav Bar: Filters + Expandable Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/60 shadow-sm relative pr-4">
                    {/* Categories / Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 w-full md:w-auto">
                        {cuisines.map(c => (
                            <button
                                key={c}
                                onClick={() => setFilter(c)}
                                className={`whitespace-nowrap px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all ${filter === c
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-gray-400 hover:text-primary hover:bg-gray-50'
                                    }`}
                            >
                                {t.cuisines[c] || c}
                            </button>
                        ))}
                    </div>

                    {/* Expandable Cinematic Search */}
                    <div
                        className="relative flex items-center justify-end"
                        onMouseEnter={() => setIsSearchHovered(true)}
                        onMouseLeave={() => !searchInput && setIsSearchHovered(false)}
                    >
                        <motion.form
                            onSubmit={handleSearchSubmit}
                            initial={false}
                            animate={{
                                width: isSearchHovered || searchInput ? '300px' : '56px',
                            }}
                            className={`flex items-center bg-white rounded-full border border-gray-100 shadow-sm overflow-hidden h-14 transition-shadow duration-500 ${isSearchHovered || searchInput ? 'px-5 border-accent/40 shadow-xl' : 'justify-center border-transparent'}`}
                        >
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                <Search
                                    size={20}
                                    className={`${isSearchHovered || searchInput ? 'text-accent' : 'text-gray-400'} transition-colors cursor-pointer`}
                                    onClick={() => !isSearchHovered && setIsSearchHovered(true)}
                                />
                            </div>

                            <AnimatePresence>
                                {(isSearchHovered || searchInput) && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="flex items-center flex-1 overflow-hidden"
                                    >
                                        <input
                                            type="text"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            placeholder={t.searchPlaceholder}
                                            className="ml-4 w-full bg-transparent outline-none text-sm font-medium text-primary placeholder:text-gray-300"
                                        />
                                        {searchInput && (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.form>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(query || filter !== 'All') && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-center gap-4 mb-12"
                    >
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mr-2">
                            <SlidersHorizontal size={14} className="text-accent" />
                            <span>{language === 'ar' ? "نتائج لـ:" : "Active Filters:"}</span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {filter !== 'All' && (
                                <button
                                    onClick={() => setFilter('All')}
                                    className="group flex items-center gap-3 px-5 py-2 bg-white border border-gray-100 rounded-full shadow-sm hover:border-accent hover:shadow-md transition-all animate-in fade-in slide-in-from-left-2"
                                >
                                    <span className="text-xs font-bold text-primary">{t.cuisines[filter] || filter}</span>
                                    <X size={12} className="text-gray-300 group-hover:text-accent group-hover:rotate-90 transition-all" />
                                </button>
                            )}

                            {query && (
                                <button
                                    onClick={clearSearch}
                                    className="group flex items-center gap-3 px-5 py-2 bg-white border border-gray-100 rounded-full shadow-sm hover:border-accent hover:shadow-md transition-all animate-in fade-in slide-in-from-left-2"
                                >
                                    <span className="text-xs font-bold text-primary italic">"{query}"</span>
                                    <X size={12} className="text-gray-300 group-hover:text-accent group-hover:rotate-90 transition-all" />
                                </button>
                            )}


                        </div>
                    </motion.div>
                )}

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map(i => <RestaurantSkeleton key={i} />)}
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filtered.map(item => (
                                <RestaurantCard key={item.id} data={item} />
                            ))}
                        </AnimatePresence>

                        {/* Enhanced Empty State */}
                        {filtered.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="col-span-full text-center py-40 border-2 border-dashed border-gray-100 rounded-[4rem] bg-white/50 backdrop-blur-sm"
                            >
                                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Compass className="w-10 h-10 text-accent" />
                                </div>
                                <h3 className="text-3xl font-black text-primary mb-4">{t.noResults}</h3>
                                <p className="text-gray-500 mb-12 font-medium max-w-sm mx-auto">
                                    {language === 'ar'
                                        ? "لم نجد أي نتائج تطابق معايير البحث الخاصة بك. حاول تعديل الفلاتر أو البحث عن شيء آخر."
                                        : "We couldn't find any venues matching your criteria. Try widening your search or changing the cuisine type."}
                                </p>
                                <button
                                    onClick={() => { setFilter('All'); clearSearch(); }}
                                    className="px-12 py-5 bg-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-all shadow-2xl shadow-primary/20"
                                >
                                    {language === 'ar' ? "استكشف كافة الأماكن" : "Discover All Venues"}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
