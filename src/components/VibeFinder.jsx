import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    X, ChevronRight, ChevronLeft, Users,
    DollarSign, Utensils, Clock, MapPin,
    Sparkles, Coffee, Briefcase, User,
    VolumeX, Gem, Trash2, Search, Heart, Star, Music, Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useRestaurants } from '../context/RestaurantContext';

export default function VibeFinder() {
    const { language, t } = useLanguage();
    const { restaurants } = useRestaurants();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState([]);
    const [isCalculating, setIsCalculating] = useState(false);

    const uniqueCities = useMemo(() => {
        const cities = new Set(restaurants.map(r => r.city).filter(c => {
            // Filter out empty, short strings, and numeric/coordinate strings
            if (!c || c.trim().length < 2) return false;
            if (/[\d\.]+/.test(c)) return false; // Rejects "35.820..."
            return true;
        }));
        return Array.from(cities).slice(0, 5);
    }, [restaurants]);

    const cityImages = {
        "Amman": "https://images.unsplash.com/photo-1596627006687-f27303c73fc5?w=500&q=80",
        "Aqaba": "https://images.unsplash.com/photo-1590089415225-401cd6f9ad52?w=500&q=80",
        "Irbid": "https://images.unsplash.com/photo-1627734807936-4e5540306d1d?w=500&q=80",
        "Salt": "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80",
        "Zarqa": "https://images.unsplash.com/photo-1578589318274-0466c0531500?w=500&q=80",
        "default": "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=500&q=80"
    };

    const questions = useMemo(() => {
        const cityOptions = uniqueCities.map(city => ({
            id: city,
            label: city,
            icon: MapPin,
            image: cityImages[city] || cityImages.default
        }));

        return [
            {
                id: 'mood',
                title: language === 'ar' ? "كيف هو مودك اليوم؟" : "What's your mood?",
                options: [
                    { id: 'chill', label: language === 'ar' ? "رايق وهادي" : "Chill & Quiet", icon: VolumeX, image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&q=80" },
                    { id: 'lively', label: language === 'ar' ? "نشيط وحيوي" : "Lively & Fun", icon: Zap, image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&q=80" },
                    { id: 'fancy', label: language === 'ar' ? "كشخة (فاخر)" : "Fancy & Chic", icon: Gem, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80" },
                    { id: 'work', label: language === 'ar' ? "تركيز وعمل" : "Focused Work", icon: Briefcase, image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&q=80" },
                ]
            },
            {
                id: 'category',
                title: language === 'ar' ? "شو نفسك تاكل/تشرب؟" : "Cravings?",
                options: [
                    { id: 'food', label: language === 'ar' ? "وجبة دسمة" : "Full Meal", icon: Utensils, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80" },
                    { id: 'coffee', label: language === 'ar' ? "قهوة وحلى" : "Coffee & Sweets", icon: Coffee, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
                ]
            },
            {
                id: 'region',
                title: language === 'ar' ? "وين حابب تروح؟" : "Preferred Area?",
                options: [
                    ...cityOptions,
                    { id: 'any', label: language === 'ar' ? "وين ما كان" : "Anywhere", icon: Sparkles, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80" },
                ]
            }
        ];
    }, [language, uniqueCities]);

    const handleAnswer = (questionId, optionId) => {
        const newAnswers = { ...answers, [questionId]: optionId };
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setIsCalculating(true);
            setTimeout(() => {
                calculateResults(newAnswers);
                setIsCalculating(false);
                setStep(step + 1);
            }, 1500); // Cinematic delay for "Thinking"
        }
    };

    const calculateResults = (finalAnswers) => {
        // Smart Scoring Algorithm
        let scored = restaurants.map(r => {
            let score = 0;
            const searchStr = `${r.city || ''} ${r.address || ''} ${r.nameAr || ''} ${r.name || ''} ${r.cuisineType || ''} ${r.description || ''}`.toLowerCase();

            // 1. Category Score (Essential) - 50 Points
            if (finalAnswers.category === 'food' && r.type !== 'cafe') score += 50;
            if (finalAnswers.category === 'coffee' && r.type === 'cafe') score += 50;

            // 2. Mood Score (Vibe matching) - 30 Points
            if (finalAnswers.mood === 'chill' && (searchStr.includes('quiet') || searchStr.includes('cozy') || searchStr.includes('هادئ'))) score += 30;
            if (finalAnswers.mood === 'lively' && (searchStr.includes('music') || searchStr.includes('busy') || searchStr.includes('crowded'))) score += 30;
            if (finalAnswers.mood === 'fancy' && (r.priceRange === '$$$' || r.priceRange === '$$$$')) score += 30;
            if (finalAnswers.mood === 'work' && (searchStr.includes('wifi') || searchStr.includes('quiet') || r.type === 'cafe')) score += 30;

            // 3. Region Score - 20 Points
            const region = finalAnswers.region;
            if (region !== 'any') {
                // Exact city match (Primary)
                if (r.city && r.city.toLowerCase() === region.toLowerCase()) {
                    score += 20;
                }
                // Fallback fuzzy search (Secondary)
                else if (searchStr.includes(region.toLowerCase())) {
                    score += 15;
                }
            } else {
                score += 10; // Bonus for flexibility
            }

            // 4. Rating Bonus (0-10 Points)
            score += (r.rating || 0) * 2;

            return { ...r, score };
        });

        // Sort by score desc
        scored.sort((a, b) => b.score - a.score);

        // Enhance results with a "Why we picked this" reason
        const topResults = scored.slice(0, 3).map(r => ({
            ...r,
            matchReason: getMatchReason(r, finalAnswers, language)
        }));

        setResults(topResults);
    };

    const getMatchReason = (restaurant, answers, lang) => {
        if (answers.mood === 'fancy') return lang === 'ar' ? "خيار مثالي لتجربة فاخرة وأنيقة." : "Perfect for a fancy and elegant experience.";
        if (answers.mood === 'work') return lang === 'ar' ? "مكان هادئ ومناسب للتركيز والعمل." : "Quiet spot, great for focus and work.";
        if (answers.mood === 'chill') return lang === 'ar' ? "أجواء مريحة وهادئة للاستمتاع." : "Cozy vibes to relax and enjoy.";
        if (restaurant.rating > 4.5) return lang === 'ar' ? "أحد أعلى الأماكن تقييماً في المدينة!" : "One of the highest rated spots in town!";
        return lang === 'ar' ? "يطابق تفضيلاتك بشكل ممتاز." : "Matches your preferences perfectly.";
    };

    const reset = () => {
        setStep(0);
        setAnswers({});
        setResults([]);
        setIsCalculating(false);
    };

    return (
        <>
            {/* Premium AI Assistant Trigger */}
            <div
                className={`fixed bottom-10 ${language === 'ar' ? 'left-10' : 'right-10'} z-[90]`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
                <div className="relative group">
                    <div className="absolute inset-0 bg-accent/40 blur-xl rounded-full group-hover:bg-accent/60 transition-all duration-500" />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="relative flex items-center gap-3 pl-3 pr-5 py-3 bg-primary text-white border border-white/10 rounded-full shadow-2xl overflow-hidden"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-highlight flex items-center justify-center relative">
                            <Sparkles size={20} className="text-white animate-pulse" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-black uppercase tracking-widest text-accent">AI Genius</span>
                            <span className="text-sm font-bold">{language === 'ar' ? "شو جوّك اليوم؟" : "Find My Vibe"}</span>
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Immersive Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/95 backdrop-blur-xl"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => { setIsOpen(false); reset(); }}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-full max-w-6xl">
                            {isCalculating ? (
                                <motion.div
                                    className="flex flex-col items-center justify-center text-center text-white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="w-24 h-24 mb-8 relative">
                                        <motion.div
                                            className="absolute inset-0 border-4 border-accent/30 rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <motion.div
                                            className="absolute inset-0 border-t-4 border-accent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <Sparkles className="absolute inset-0 m-auto text-accent" size={32} />
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-heading font-bold mb-2">
                                        {language === 'ar' ? "جاري تحليل ذوقك..." : "Analyzing your vibe..."}
                                    </h3>
                                    <p className="text-white/50">
                                        {language === 'ar' ? "نبحث في أفضل الأماكن في الأردن" : "Scanning Jordan's finest venues"}
                                    </p>
                                </motion.div>
                            ) : step < questions.length ? (
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    className="flex flex-col items-center"
                                >
                                    {/* Progress */}
                                    <div className="w-full max-w-md h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-accent"
                                            initial={{ width: `${(step / questions.length) * 100}%` }}
                                            animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                                        />
                                    </div>

                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-12 text-center font-heading">
                                        {questions[step].title}
                                    </h3>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
                                        {questions[step].options.map((option) => (
                                            <motion.button
                                                key={option.id}
                                                whileHover={{ scale: 1.02, y: -5 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleAnswer(questions[step].id, option.id)}
                                                className="group relative h-48 md:h-64 rounded-[2rem] overflow-hidden border border-white/10"
                                            >
                                                {/* Background Image */}
                                                <div className="absolute inset-0">
                                                    <img
                                                        src={option.image}
                                                        alt={option.label}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                                </div>

                                                {/* Content */}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 text-white border border-white/20 group-hover:scale-110 group-hover:bg-accent group-hover:border-accent transition-all">
                                                        <option.icon size={24} />
                                                    </div>
                                                    <span className="text-white font-bold text-lg md:text-xl tracking-tight group-hover:text-amber-100 transition-colors">
                                                        {option.label}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>

                                    {step > 0 && (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="mt-8 text-white/40 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                                        >
                                            <ChevronLeft size={16} /> {t.back}
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                // Results Step
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full"
                                >
                                    <div className="text-center mb-12">
                                        <h3 className="text-3xl md:text-5xl font-black text-white mb-2 font-heading">
                                            {language === 'ar' ? "لقينا جوّك!" : "Vibe Matched!"}
                                        </h3>
                                        <p className="text-white/60 text-lg">
                                            {language === 'ar' ? "بناءً على اختياراتك، بنرشحلك هالأماكن" : "Based on your mood, we recommend these spots"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                        {results.map((venue, idx) => (
                                            <motion.div
                                                key={venue.id || idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/10 transition-colors group"
                                            >
                                                {/* Image */}
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={venue.image_url || venue.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"}
                                                        alt={venue.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80";
                                                        }}
                                                    />
                                                    <div className="absolute top-4 right-4 bg-accent text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                                        {Math.min(100, Math.round((venue.score / 110) * 100))}% Match
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-white font-bold text-xl truncate pr-4">
                                                            {language === 'ar' ? (venue.name_ar || venue.name) : venue.name}
                                                        </h4>
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex text-accent text-xs">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={10} fill={i < Math.floor(venue.rating) ? "currentColor" : "none"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-accent/80 text-sm italic mb-4 flex items-center gap-2">
                                                        <Sparkles size={12} />
                                                        {venue.matchReason}
                                                    </p>

                                                    <Link
                                                        to={`/restaurant/${venue.id || venue._id}`}
                                                        className="block w-full py-3 bg-white text-primary text-center rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-accent hover:text-white transition-all"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {language === 'ar' ? "عرض التفاصيل" : "View Details"}
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {results.length === 0 && (
                                            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white/40">
                                                    <X size={32} />
                                                </div>
                                                <h4 className="text-white text-xl font-bold mb-2">
                                                    {language === 'ar' ? "ما لقينا شي يطابق كل الشروط" : "No exact matches found"}
                                                </h4>
                                                <p className="text-white/40 mb-6">
                                                    {language === 'ar' ? "جرب تغيير بعض الخيارات" : "Try adjusting your filters slightly"}
                                                </p>
                                                <button onClick={reset} className="text-accent hover:text-white font-bold underline">
                                                    {language === 'ar' ? "إعادة البحث" : "Start Over"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <button
                                            onClick={reset}
                                            className="px-8 py-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white transition-all text-sm font-bold uppercase tracking-widest"
                                        >
                                            {language === 'ar' ? "بحث جديد" : "Start New Search"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}


