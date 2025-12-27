import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

export default function Hero() {
    const { language, t } = useLanguage();

    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden bg-primary">
            {/* Background Video Engine */}
            <div className="absolute inset-0 z-0">
                {/* Advanced Cinematic Scrims */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-cream/40 z-10" />
                <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover scale-110 opacity-70 filter brightness-90 grayscale-[0.1]"
                >
                    <source src="/videos/about.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={`text-6xl md:text-8xl font-heading font-black text-white mb-8 leading-[1.1] ${language === 'ar' ? 'tracking-normal' : 'tracking-tight'}`}
                >
                    {t.heroTitle}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
                >
                    {t.heroSubtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center w-full px-6"
                >
                    <div className="relative w-full max-w-4xl group">
                        {/* Interactive Glow */}
                        <div className="absolute -inset-1 bg-accent/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative flex items-center bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/20 shadow-2xl p-2 transition-all group-focus-within:border-accent/50 group-focus-within:bg-white/15">
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent px-10 py-5 text-white placeholder:text-white/40 focus:outline-none text-xl font-medium rtl:text-right"
                            />

                            <Link
                                to={`/explore?search=${searchQuery}`}
                                className="shrink-0"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02, x: language === 'ar' ? -5 : 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-12 py-5 bg-accent text-white rounded-[1.5rem] flex items-center justify-center font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:bg-highlight transition-all border border-white/10"
                                >
                                    <Search className="w-4 h-4 mx-2" />
                                    <span>{t.searchBtn}</span>
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
