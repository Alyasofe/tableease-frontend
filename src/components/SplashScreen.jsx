import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

// Golden floating particles component
const GoldenParticles = () => {
    const particles = useMemo(() =>
        Array.from({ length: 50 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 10 + 15,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.5 + 0.2,
        })), []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        background: `radial-gradient(circle, rgba(197,160,89,${particle.opacity}) 0%, transparent 70%)`,
                        boxShadow: `0 0 ${particle.size * 3}px rgba(197,160,89,${particle.opacity})`,
                    }}
                    animate={{
                        y: [0, -100, -200],
                        x: [0, Math.random() * 50 - 25],
                        opacity: [0, particle.opacity, 0],
                        scale: [0.5, 1, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};

// Rotating golden ring
const GoldenRing = ({ size, duration, delay, opacity = 0.3 }) => (
    <motion.div
        className="absolute rounded-full border"
        style={{
            width: size,
            height: size,
            borderColor: `rgba(197,160,89,${opacity})`,
            borderWidth: 1,
        }}
        initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
        animate={{
            rotate: 360,
            scale: [0.8, 1, 0.8],
            opacity: [0, opacity, 0],
        }}
        transition={{
            rotate: { duration, repeat: Infinity, ease: "linear" },
            scale: { duration: duration / 2, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 2, delay },
        }}
    />
);

// Pulse effect behind logo
const LogoPulse = () => (
    <>
        {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                    width: 200 + i * 100,
                    height: 200 + i * 100,
                    background: `radial-gradient(circle, rgba(197,160,89,${0.1 - i * 0.03}) 0%, transparent 70%)`,
                }}
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                }}
                transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        ))}
    </>
);

export default function SplashScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Preparing your experience');

    const loadingMessages = useMemo(() => [
        'Preparing your experience',
        'Discovering finest spots',
        'Setting the perfect table',
        'Almost ready',
    ], []);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 1.5;
            });
        }, 30);

        const textTimer = setInterval(() => {
            setLoadingText((prev) => {
                const currentIndex = loadingMessages.indexOf(prev);
                return loadingMessages[(currentIndex + 1) % loadingMessages.length];
            });
        }, 800);

        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => {
            clearInterval(timer);
            clearInterval(textTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete, loadingMessages]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #050505 100%)',
            }}
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                scale: 1.1,
                filter: "blur(10px)",
                transition: { duration: 0.6, ease: "easeInOut" }
            }}
        >
            {/* Animated mesh background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse at 20% 20%, rgba(197,160,89,0.08) 0%, transparent 50%),
                            radial-gradient(ellipse at 80% 80%, rgba(197,160,89,0.05) 0%, transparent 50%),
                            radial-gradient(ellipse at 50% 50%, rgba(197,160,89,0.03) 0%, transparent 70%)
                        `,
                    }}
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Golden particles */}
            <GoldenParticles />

            {/* Rotating rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <GoldenRing size={300} duration={20} delay={0} opacity={0.15} />
                <GoldenRing size={400} duration={25} delay={0.5} opacity={0.1} />
                <GoldenRing size={500} duration={30} delay={1} opacity={0.05} />
            </div>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Pulse effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <LogoPulse />
                </div>

                {/* Logo container with glow */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-8"
                >
                    {/* Golden glow behind text */}
                    <div
                        className="absolute inset-0 blur-3xl opacity-30"
                        style={{
                            background: 'radial-gradient(circle, rgba(197,160,89,0.6) 0%, transparent 70%)',
                            transform: 'scale(1.5)',
                        }}
                    />

                    {/* Main logo */}
                    <h1 dir="ltr" className="relative flex justify-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-bold tracking-tight">
                        <motion.span
                            className="text-white inline-block"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Table
                        </motion.span>
                        <motion.span
                            className="inline-block"
                            style={{
                                background: 'linear-gradient(135deg, #C5A059 0%, #D4AF37 50%, #C5A059 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 30px rgba(197,160,89,0.5))',
                            }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Ease
                        </motion.span>
                    </h1>
                </motion.div>

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex items-center gap-4 mb-12"
                >
                    <motion.div
                        className="h-px w-12 bg-gradient-to-r from-transparent to-accent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    />
                    <span className="text-accent/80 text-sm md:text-base tracking-[0.3em] uppercase font-light">
                        Your Table Awaits
                    </span>
                    <motion.div
                        className="h-px w-12 bg-gradient-to-l from-transparent to-accent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    />
                </motion.div>

                {/* Progress section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="flex flex-col items-center"
                >
                    {/* Progress bar container */}
                    <div className="relative w-64 sm:w-80 h-1 rounded-full overflow-hidden bg-white/5">
                        {/* Progress bar fill */}
                        <motion.div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                                background: 'linear-gradient(90deg, #C5A059 0%, #D4AF37 50%, #C5A059 100%)',
                                boxShadow: '0 0 20px rgba(197,160,89,0.6), 0 0 40px rgba(197,160,89,0.3)',
                            }}
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "easeOut" }}
                        />

                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 opacity-50"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            }}
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </div>

                    {/* Progress percentage */}
                    <motion.div
                        className="mt-6 flex items-center gap-3"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-accent/60"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: i * 0.2,
                                        repeat: Infinity,
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-white/40 text-xs tracking-widest uppercase">
                            {loadingText}
                        </span>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom decorative line */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.3), transparent)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            />

            {/* Corner accents */}
            <motion.div
                className="absolute top-8 left-8 w-16 h-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
            >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-accent/40 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent/40 to-transparent" />
            </motion.div>

            <motion.div
                className="absolute bottom-8 right-8 w-16 h-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
            >
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-accent/40 to-transparent" />
                <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-accent/40 to-transparent" />
            </motion.div>
        </motion.div>
    );
}
