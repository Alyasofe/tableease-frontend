import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Hero() {
    const { t } = useLanguage();

    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-primary">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80")' }} // Updated generic image
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-cream z-1"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight"
                >
                    {t.heroTitle}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
                >
                    {t.heroSubtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col md:flex-row gap-4 justify-center items-center"
                >
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 rounded-full text-primary focus:outline-none focus:ring-4 focus:ring-accent/30 shadow-2xl"
                        />
                        <Link to={`/explore?search=${searchQuery}`} className={`absolute top-2 bottom-2 px-6 bg-accent hover:bg-highlight text-white rounded-full transition-all flex items-center justify-center ${document.dir === 'rtl' ? 'left-2' : 'right-2'}`}>
                            {t.searchBtn}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
