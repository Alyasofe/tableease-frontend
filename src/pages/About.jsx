import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Building2, Eye, Handshake, Zap, TrendingUp, Award, ChevronRight, Globe, Layers } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

// Counter Component for Stats
const StatCounter = ({ value, label, icon: Icon, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const cleanVal = value.toString().replace(/[^0-9]/g, '');
            const end = parseInt(cleanVal);
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center p-8 bg-white/30 backdrop-blur-3xl rounded-[3rem] border border-white/40 shadow-xl hover:bg-white/50 transition-all duration-700 relative overflow-hidden group"
        >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-inner">
                <Icon size={30} />
            </div>
            <div className="text-5xl font-black text-primary tracking-tighter mb-2">
                {count}{value.toString().includes('+') ? '+' : ''}
            </div>
            <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] text-center">
                {label}
            </p>
        </motion.div>
    );
};

export default function About() {
    const { language, t } = useLanguage();
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const springScroll = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={targetRef} className="min-h-screen bg-[#F9FAFB] selection:bg-accent/30 overflow-x-hidden font-inter" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Editorial Scroll Progress Mask */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-accent z-[100] origin-left"
                style={{ scaleX: springScroll }}
            />

            {/* Simplified Professional Header */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-mesh">
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px]">
                                {language === 'ar' ? "من نحن" : "ABOUT US"}
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-[9rem] font-black font-heading text-primary tracking-tighter leading-[0.85] mb-12">
                            {t.aboutTitle}<span className="text-accent">.</span>
                        </h1>

                        <p className="text-2xl md:text-5xl font-light text-gray-400 max-w-3xl leading-tight italic">
                            "{t.aboutTagline}"
                        </p>
                    </motion.div>
                </div>

                {/* Abstract Background Element */}
                <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full" />
                </div>
            </section>

            {/* Premium Impact Grid */}
            <section className="container mx-auto px-6 relative z-40 mb-64">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCounter value="32k+" label={t.statsAbout.bookings} icon={TrendingUp} delay={0.1} />
                    <StatCounter value="145+" label={t.statsAbout.venues} icon={Building2} delay={0.2} />
                    <StatCounter value="88k+" label={t.statsAbout.users} icon={Users} delay={0.3} />
                    <StatCounter value="Jordan" label={t.statsAbout.cities} icon={Globe} delay={0.4} />
                </div>
            </section>

            {/* Architectural Content: The Why */}
            <section className="container mx-auto px-6 max-w-7xl mb-64">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-7 space-y-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <h2 className="text-5xl md:text-8xl font-black text-primary font-heading tracking-tighter leading-[0.9]">
                                {t.whyTableEase}
                            </h2>
                            <div className="h-2 w-32 bg-accent rounded-full" />
                            <p className="text-2xl md:text-4xl text-gray-400 font-medium leading-tight">
                                {t.aboutDescription.split('.')[0]}.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {t.painPoints.map((point, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-xl group hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-8 group-hover:bg-red-500 group-hover:text-white transition-all">
                                        <Zap size={24} />
                                    </div>
                                    <h4 className="text-2xl font-black text-primary group-hover:text-accent transition-colors">{point}</h4>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="relative aspect-[4/6] rounded-[4rem] overflow-hidden shadow-[0_80px_100px_rgba(0,0,0,0.1)] group"
                        >
                            <div className="absolute inset-0 bg-primary/20 z-10 group-hover:bg-transparent transition-all duration-700" />
                            <img
                                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                                alt="Innovation"
                            />
                            {/* Glass Accent Card */}
                            <div className="absolute bottom-10 left-10 right-10 p-10 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 z-20">
                                <Award className="text-accent mb-4" size={32} />
                                <div className="text-white font-black text-2xl mb-2 tracking-tight">The Gold Standard</div>
                                <p className="text-white/60 text-sm leading-relaxed">{t.statusContent}</p>
                            </div>
                        </motion.div>
                        {/* Decorative Geometry */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[80px] rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                    </div>
                </div>
            </section>

            {/* Asymmetric Offerings Grid */}
            <section className="bg-primary pt-48 pb-64 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#F9FAFB] to-transparent" />
                <div className="container mx-auto px-6 max-w-7xl relative z-20">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Diners Card - Floating Aesthetic */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex-1 bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-16 rounded-[4.5rem] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 text-white"><Users size={200} /></div>
                            <h3 className="text-5xl font-black font-heading text-white mb-16 leading-tight max-w-sm">
                                {t.featuresDiner.title}
                            </h3>
                            <div className="space-y-10">
                                {t.featuresDiner.list.map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 group/item">
                                        <div className="w-3 h-3 rounded-full bg-accent group-hover/item:scale-150 transition-transform" />
                                        <span className="text-2xl font-medium text-white/50 group-hover/item:text-white transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Restaurants Card - Architectural Contrast */}
                        <motion.div
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex-1 bg-white p-20 rounded-[4.5rem] shadow-[0_100px_80px_rgba(0,0,0,0.1)] relative overflow-hidden"
                        >
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full" />
                            <h3 className="text-5xl font-black font-heading text-primary mb-16 leading-tight max-w-sm">
                                {t.featuresRestaurant.title}
                            </h3>
                            <div className="grid gap-12">
                                {t.featuresRestaurant.list.map((item, i) => (
                                    <div key={i} className="flex gap-8 group/res">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 group-hover/res:bg-accent group-hover/res:text-white transition-all">
                                            <Layers size={24} />
                                        </div>
                                        <span className="text-2xl font-medium text-gray-500 group-hover/res:text-primary transition-colors">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Elite Partnership & Vision */}
            <section className="container mx-auto px-6 max-w-7xl -mt-32 relative z-30 mb-64">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-accent p-20 rounded-[4rem] text-white shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-10"><Eye size={120} /></div>
                        <h3 className="text-4xl font-black font-heading mb-10">{t.ourVision}</h3>
                        <p className="text-3xl font-black leading-[1.3] text-white/90 italic tracking-tight uppercase">
                            "{t.visionContent}"
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white p-20 rounded-[4rem] border border-gray-100 shadow-2xl relative overflow-hidden"
                    >
                        <Handshake className="text-accent mb-10" size={60} />
                        <h3 className="text-4xl font-black font-heading text-primary mb-10">{t.partnership}</h3>
                        <p className="text-2xl font-medium text-gray-400 leading-relaxed">
                            {t.partnershipContent}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* The Ultimate CTA Strip */}
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative bg-primary rounded-[5rem] p-24 md:p-32 text-center overflow-hidden shadow-[0_100px_100px_rgba(0,0,0,0.2)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary opacity-50" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/10 blur-[200px] rounded-full animate-pulse" />
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="inline-block mb-12"
                        >
                            <Sparkles className="text-accent/30" size={80} />
                        </motion.div>

                        <h3 className="text-6xl md:text-[8rem] font-black text-white mb-10 tracking-tighter leading-none">
                            {t.aboutStatus}<span className="text-accent">.</span>
                        </h3>

                        <p className="text-2xl md:text-3xl font-light text-white/40 mb-20 max-w-3xl mx-auto leading-tight italic">
                            {t.statusContent}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 justify-center">
                            <Link to="/explore" className="group relative px-20 py-8 bg-accent text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] overflow-hidden transition-all hover:scale-105 shadow-[0_20px_50px_rgba(197,160,89,0.3)]">
                                <span className="relative z-10 flex items-center gap-3">
                                    {t.exploreRest}
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                            </Link>

                            <Link to="/register" className="group px-20 py-8 bg-white/5 border border-white/20 backdrop-blur-md text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] transition-all hover:bg-white/10 hover:scale-105">
                                {t.joinAsRest}
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="py-32 flex flex-col items-center gap-10">
                    <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="h-px w-20 bg-gray-400" />
                        <span className="text-xs font-black uppercase tracking-[0.8em] text-gray-500">{t.tagline}</span>
                        <span className="h-px w-20 bg-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
