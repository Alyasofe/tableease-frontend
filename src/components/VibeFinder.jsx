import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    X, ChevronRight, ChevronLeft, Users,
    DollarSign, Utensils, Clock, MapPin,
    Sparkles, Coffee, Briefcase, User,
    VolumeX, Gem, Trash2, Search
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

    const questions = [
        {
            id: 'withWho',
            title: language === 'ar' ? "مع مين طالع؟" : "Who are you with?",
            options: [
                { id: 'alone', label: language === 'ar' ? "لوحدي" : "Alone", icon: User },
                { id: 'family', label: language === 'ar' ? "عائلة" : "Family", icon: Users },
                { id: 'friends', label: language === 'ar' ? "أصدقاء" : "Friends", icon: Sparkles },
                { id: 'business', label: language === 'ar' ? "عمل" : "Business", icon: Briefcase },
            ]
        },
        {
            id: 'budget',
            title: language === 'ar' ? "الميزانية المتوقعة؟" : "Expected budget?",
            options: [
                { id: 'budget', label: language === 'ar' ? "اقتصادية" : "Budget", icon: DollarSign, level: 1 },
                { id: 'moderate', label: language === 'ar' ? "متوسطة" : "Moderate", icon: DollarSign, level: 2 },
                { id: 'luxury', label: language === 'ar' ? "فاخرة" : "Luxury", icon: Gem, level: 4 },
            ]
        },
        {
            id: 'category',
            title: language === 'ar' ? "شو الجو اللي بتدور عليه؟" : "What's the vibe?",
            options: [
                { id: 'food', label: language === 'ar' ? "أكل" : "Food", icon: Utensils },
                { id: 'coffee', label: language === 'ar' ? "قهوة" : "Coffee", icon: Coffee },
                { id: 'quiet', label: language === 'ar' ? "جلسة هادئة" : "Quiet Session", icon: VolumeX },
            ]
        },
        {
            id: 'region',
            title: language === 'ar' ? "أي منطقة بتفضل؟" : "Preferred region?",
            options: [
                { id: 'west', label: language === 'ar' ? "غرب عمان" : "West Amman", icon: MapPin },
                { id: 'abdoun', label: language === 'ar' ? "عبدون / السويفية" : "Abdoun / Sweifieh", icon: MapPin },
                { id: 'downtown', label: language === 'ar' ? "وسط البلد" : "Downtown", icon: MapPin },
                { id: 'webdeh', label: language === 'ar' ? "اللويبدة / الرينبو" : "Webdeh / Rainbow", icon: MapPin },
                { id: 'north', label: language === 'ar' ? "شمال عمان" : "North Amman", icon: MapPin },
                { id: 'any', label: language === 'ar' ? "أي مكان" : "Anywhere", icon: Sparkles },
            ]
        }
    ];

    const handleAnswer = (questionId, optionId) => {
        const newAnswers = { ...answers, [questionId]: optionId };
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            calculateResults(newAnswers);
            setStep(step + 1); // Move to results step
        }
    };

    const calculateResults = (finalAnswers) => {
        let filtered = [...restaurants];

        // 1. Filter by category (Food vs Coffee)
        if (finalAnswers.category === 'food') {
            filtered = filtered.filter(r => r.type === 'restaurant' || r.cuisineType !== 'Cafe');
        } else if (finalAnswers.category === 'coffee') {
            filtered = filtered.filter(r => r.type === 'cafe' || r.cuisineType === 'Cafe');
        }

        // 2. Filter by Budget
        if (finalAnswers.budget === 'budget') {
            filtered = filtered.filter(r => r.priceRange === '$' || r.priceRange === '$$');
        } else if (finalAnswers.budget === 'luxury') {
            filtered = filtered.filter(r => r.priceRange === '$$$' || r.priceRange === '$$$$');
        }

        // 3. Filter by Region (Heuristic string matching)
        if (finalAnswers.region !== 'any') {
            const regionKeyword = finalAnswers.region;
            filtered = filtered.filter(r => {
                const searchStr = `${r.city || ''} ${r.address || ''} ${r.nameAr || ''} ${r.name || ''}`.toLowerCase();
                if (regionKeyword === 'west') return searchStr.includes('west') || searchStr.includes('غرب');
                if (regionKeyword === 'abdoun') return searchStr.includes('abdoun') || searchStr.includes('sweifieh') || searchStr.includes('عبدون') || searchStr.includes('سويفية');
                if (regionKeyword === 'downtown') return searchStr.includes('downtown') || searchStr.includes('وسط البلد') || searchStr.includes('بلد');
                if (regionKeyword === 'webdeh') return searchStr.includes('webdeh') || searchStr.includes('rainbow') || searchStr.includes('لويبدة') || searchStr.includes('رينبو');
                if (regionKeyword === 'north') return searchStr.includes('north') || searchStr.includes('شمال');
                return true;
            });
        }

        // Sort by rating
        filtered.sort((a, b) => b.rating - a.rating);
        setResults(filtered.slice(0, 3));
    };

    const reset = () => {
        setStep(0);
        setAnswers({});
        setResults([]);
    };

    return (
        <>
            {/* Premium AI Assistant Trigger */}
            <div
                className={`fixed bottom-10 ${language === 'ar' ? 'left-10' : 'right-10'} z-[90]`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
                <div className="relative">
                    {/* Ambient Glow behind the pill */}
                    <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />

                    <motion.button
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="relative flex items-center gap-4 pl-4 pr-6 py-3 bg-primary/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] group hover:border-accent/50 transition-all duration-500 overflow-hidden"
                    >
                        {/* Animated Icon Core */}
                        <div className="relative w-11 h-11 bg-accent rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                            />
                            <svg viewBox="0 0 24 24" className="w-6 h-6 relative z-10 group-hover:scale-125 transition-transform fill-current">
                                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                            </svg>
                        </div>

                        {/* Label Content */}
                        <div className="flex flex-col items-start leading-none gap-1">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">AI Genius</span>
                            </div>
                            <span className="text-white text-sm font-black tracking-tight">
                                {language === 'ar' ? "شو جوّك اليوم؟" : "What's the vibe?"}
                            </span>
                        </div>

                        {/* Interactive Shine Effect */}
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full skew-x-12"
                        />
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-primary/95 backdrop-blur-2xl"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => { setIsOpen(false); reset(); }}
                            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={40} />
                        </button>

                        <div className="w-full max-w-4xl">
                            {step < questions.length ? (
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="text-center"
                                >
                                    <span className="text-accent font-black uppercase tracking-widest text-sm mb-6 block">
                                        {language === 'ar' ? `السؤال ${step + 1} من ${questions.length}` : `Question ${step + 1} of ${questions.length}`}
                                    </span>
                                    <h3 className="text-4xl md:text-7xl font-black text-white mb-16 font-heading tracking-tighter leading-none">
                                        {questions[step].title}
                                    </h3>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                                        {questions[step].options.map((option) => (
                                            <motion.button
                                                key={option.id}
                                                whileHover={{ scale: 1.05, y: -10 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleAnswer(questions[step].id, option.id)}
                                                className="group relative h-48 md:h-64 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:bg-accent hover:border-accent transition-all duration-500 overflow-hidden"
                                            >
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                    <option.icon className="text-white" size={32} />
                                                </div>
                                                <span className="text-white font-black text-lg md:text-xl uppercase tracking-tight">
                                                    {option.label}
                                                </span>

                                                {/* Corner Decoration */}
                                                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/20"></div>
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Back Button */}
                                    {step > 0 && (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="mt-16 text-white/40 hover:text-white flex items-center gap-2 mx-auto font-black uppercase tracking-widest text-xs"
                                        >
                                            <ChevronLeft size={16} /> {t.back}
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                // Results Step
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="mb-12">
                                        <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-accent/30">
                                            <Sparkles className="text-accent" size={48} />
                                        </div>
                                        <h3 className="text-5xl md:text-7xl font-black text-white mb-4 font-heading tracking-tight leading-none">
                                            {language === 'ar' ? "لقد وجدنا طلبك!" : "Magic Matches Found!"}
                                        </h3>
                                        <p className="text-xl text-white/50 font-medium">
                                            {language === 'ar' ? "هذه أفضل 3 خيارات تناسب ذوقك تماماً" : "Hand-picked gems based on your mood."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                                        {results.length > 0 ? (
                                            results.map((venue, idx) => (
                                                <motion.div
                                                    key={venue._id}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="group relative bg-white/5 border border-white/10 rounded-[3rem] p-6 hover:bg-white/10 transition-all duration-500 overflow-hidden"
                                                >
                                                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6">
                                                        <img
                                                            src={venue.imageUrl || venue.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop"}
                                                            alt={venue.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        />
                                                    </div>
                                                    <h4 className="text-2xl font-black text-white mb-3 truncate px-2">
                                                        {language === 'ar' ? (venue.nameAr || venue.name) : venue.name}
                                                    </h4>
                                                    <div className="flex items-center justify-center gap-4 text-xs font-black text-white/40 uppercase tracking-widest mb-8">
                                                        <span className="flex items-center gap-1.5"><Star size={14} className="text-accent fill-current" /> {venue.rating}</span>
                                                        <span>•</span>
                                                        <span>{venue.priceRange}</span>
                                                    </div>
                                                    <Link
                                                        to={`/restaurant/${venue._id || venue.id}`}
                                                        className="block w-full py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-primary transition-all"
                                                    >
                                                        {t.viewDetails}
                                                    </Link>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-20">
                                                <h4 className="text-2xl font-bold text-white/20">{t.noResults}</h4>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <button
                                            onClick={reset}
                                            className="px-10 py-4 border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                        >
                                            {language === 'ar' ? "إعادة المحاولة" : "Try Again"}
                                        </button>
                                        <button
                                            onClick={() => { setIsOpen(false); reset(); }}
                                            className="px-10 py-4 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all shadow-2xl"
                                        >
                                            {language === 'ar' ? "إغلاق" : "Close"}
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

function Star({ size, className, fill }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={fill || "currentColor"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
