import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Globe, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

import NotificationBell from './NotificationBell';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const [isScrolled, setIsScrolled] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();
    const { user } = useAuth();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Scroll listener for dynamic transparency
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-700 ease-in-out ${isHomePage
                ? (isScrolled ? "py-3 bg-primary/40 backdrop-blur-2xl shadow-2xl" : "py-6 bg-transparent")
                : "py-3 bg-primary shadow-xl"
                } text-white`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">

                {/* 1. Logo Section (Always at the start) */}
                <div className="z-50" dir="ltr">
                    <Link to="/" className="flex items-center gap-3 group relative">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <div className="absolute inset-[-6px] bg-accent/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
                            <div className="relative w-11 h-11 bg-gradient-to-br from-secondary to-black border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-accent/50 transition-all duration-500">
                                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 z-10" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 8L20 8L18 16L6 16L4 8Z" className="fill-white/10 stroke-accent" strokeWidth="1.5" strokeLinejoin="round" />
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        d="M10 12L12 14L16 10"
                                        className="stroke-white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </motion.div>

                        <div className="flex flex-col">
                            <div className="flex">
                                {"Table".split("").map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        whileHover={{ y: -2, color: "#C5A059" }}
                                        className="text-2xl font-black tracking-tight text-white"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                                <div className="flex relative items-center ml-1">
                                    {"Ease".split("").map((letter, i) => (
                                        <motion.span
                                            key={i}
                                            whileHover={{ y: -3, textShadow: "0 0 15px rgba(197, 160, 89, 0.4)" }}
                                            className="text-2xl font-black tracking-tight text-accent inline-block"
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="h-[1px] w-3 bg-accent/60"></span>
                                <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-extrabold whitespace-nowrap">
                                    {t.eliteTagline}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* 2. Desktop Navigation (Center) */}
                <div className="hidden lg:flex items-center gap-10 font-semibold tracking-wide">
                    <NavLink to="/">{t.home}</NavLink>
                    <NavLink to="/explore">{t.explore}</NavLink>
                    <NavLink to="/offers">{t.offers}</NavLink>
                    <NavLink to="/about">{t.about}</NavLink>
                </div>

                {/* 3. Actions Section (End) */}
                <div className="hidden md:flex items-center gap-6">
                    {user && user.role === 'customer' && <NotificationBell />}
                    <button
                        onClick={toggleLanguage}
                        className="p-2.5 hover:bg-white/5 rounded-2xl transition-all flex items-center gap-2.5 group border border-transparent hover:border-white/10"
                    >
                        <Globe size={18} className="text-accent group-hover:rotate-[30deg] transition-transform duration-500" />
                        <span className="text-xs font-black uppercase tracking-widest">{language === 'en' ? 'Arabic' : 'English'}</span>
                    </button>

                    {user ? (
                        // Smart routing based on role
                        user.role === 'customer' && user.email !== 'admin@tableease.com' ? (
                            <Link to="/me" className="px-6 py-3 bg-accent hover:bg-highlight text-white rounded-2xl font-black transition-all duration-300 shadow-xl shadow-accent/20 flex items-center gap-2 group">
                                <User size={18} className="group-hover:scale-110 transition-transform" /> {t.profile || 'Profile'}
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="px-6 py-3 bg-accent hover:bg-highlight text-white rounded-2xl font-black transition-all duration-300 shadow-xl shadow-accent/20 flex items-center gap-2 group">
                                <LayoutDashboard size={18} className="group-hover:rotate-12 transition-transform" /> {t.dashboard}
                            </Link>
                        )
                    ) : (
                        <Link to="/login" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl font-black transition-all duration-300 flex items-center gap-2 group hover:border-white/20">
                            <User size={18} className="text-accent group-hover:scale-110 transition-transform" /> {t.login}
                        </Link>
                    )}
                </div>

                {/* Mobile Controls */}
                <div className="flex items-center gap-3 lg:hidden">
                    {user && user.role === 'customer' && <NotificationBell />}
                    <button
                        onClick={toggleLanguage}
                        className="text-[10px] font-black border border-accent/40 px-2 py-1 rounded-lg text-accent uppercase"
                    >
                        {language === 'en' ? 'AR' : 'EN'}
                    </button>
                    <button
                        className="p-2 bg-white/5 rounded-xl text-white hover:text-accent transition-colors z-[60]"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

            </div>

            {/* Premium Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: language === 'ar' ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: language === 'ar' ? 100 : -100 }}
                        className="fixed inset-0 top-0 bg-primary z-50 lg:hidden flex flex-col p-8 pt-24"
                    >
                        <div className="flex flex-col gap-6 text-2xl font-heading font-bold">
                            <MobileLink to="/" onClick={() => setIsOpen(false)} icon="Home">{t.home}</MobileLink>
                            <MobileLink to="/explore" onClick={() => setIsOpen(false)} icon="Search">{t.explore}</MobileLink>
                            <MobileLink to="/offers" onClick={() => setIsOpen(false)} icon="Tag">{t.offers}</MobileLink>
                            <MobileLink to="/about" onClick={() => setIsOpen(false)} icon="Info">{t.about}</MobileLink>

                            <hr className="border-white/5 my-4" />

                            {user ? (
                                // Smart routing for mobile
                                user.role === 'customer' && user.email !== 'admin@tableease.com' ? (
                                    <Link
                                        to="/me"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 p-4 bg-accent rounded-2xl text-white shadow-xl"
                                    >
                                        <User size={24} /> {t.profile || 'Profile'}
                                    </Link>
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 p-4 bg-accent rounded-2xl text-white shadow-xl"
                                    >
                                        <LayoutDashboard size={24} /> {t.dashboard}
                                    </Link>
                                )
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl text-white border border-white/10"
                                >
                                    <User size={24} className="text-accent" /> {t.login}
                                </Link>
                            )}
                        </div>

                        <div className="mt-auto pt-10 border-t border-white/5 text-center text-gray-500 text-sm italic">
                            {t.footerDesc && t.footerDesc.substring(0, 50)}...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

const NavLink = ({ to, children }) => (
    <Link to={to} className="relative group p-1 transition-colors hover:text-accent">
        {children}
        <motion.span
            className="absolute -bottom-1 left-0 rtl:right-0 h-0.5 bg-accent w-0 group-hover:w-full transition-all duration-300"
        />
    </Link>
);

const MobileLink = ({ to, onClick, children, icon }) => (
    <Link to={to} onClick={onClick} className="flex items-center gap-4 hover:text-accent transition-colors group">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-accent/10 transition-colors">
            {/* Conditional icon if needed, or just text */}
            <span className="text-xl group-hover:scale-110 transition-transform">{children}</span>
        </div>
    </Link>
);
