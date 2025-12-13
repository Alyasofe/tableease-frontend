import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 2; // Adjust speed here
            });
        }, 40);

        const completeTimer = setTimeout(() => {
            onComplete();
        }, 2500); // 2.5 seconds total duration

        return () => {
            clearInterval(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            {/* Background Video/Cinematic Effect */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{ scale: 1.1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="w-full h-full bg-cover bg-center opacity-30"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-6 flex flex-col items-center"
                >
                    <h1 className="text-6xl md:text-8xl font-heading font-bold text-white tracking-tight">
                        Table<span className="text-accent">Ease</span>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-300 text-lg md:text-xl mt-4 tracking-widest uppercase font-light"
                    >
                        Jordan's Finest Dining
                    </motion.p>
                </motion.div>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-accent shadow-[0_0_15px_rgba(65,90,119,0.8)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                <motion.p
                    className="text-gray-500 text-xs mt-4 font-mono"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    LOADING EXPERIENCE...
                </motion.p>
            </div>
        </motion.div>
    );
}
