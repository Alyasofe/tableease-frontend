import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Globe, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();
    const { user } = useAuth();

    return (
        <nav className="fixed w-full z-50 bg-primary/95 backdrop-blur-md text-white shadow-lg" dir="ltr">
            <div className={`container mx-auto px-6 py-4 flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 hover:text-accent transition-colors font-semibold"
                    >
                        <Globe size={18} />
                        <span>{language === 'en' ? 'العربية' : 'English'}</span>
                    </button>

                    {user ? (
                        <Link to="/dashboard" className="px-5 py-2 bg-accent hover:bg-highlight rounded-full transition-all duration-300 shadow-md hover:shadow-accent/50 flex items-center gap-2">
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                    ) : (
                        <Link to="/login" className="px-5 py-2 bg-accent hover:bg-highlight rounded-full transition-all duration-300 shadow-md hover:shadow-accent/50 flex items-center gap-2">
                            <User size={18} /> {t.login}
                        </Link>
                    )}
                </div>

                {/* Links (Centered or aligned based on preference, here sticking to original layout but reversed via flex-row-reverse parent if needed, but actually let's manage order manually for full RTL support inside flex) */}

                <div className={`hidden md:flex items-center space-x-8 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                    <NavLink to="/">{t.home}</NavLink>
                    <NavLink to="/explore">{t.explore}</NavLink>
                    <NavLink to="/offers">{t.offers}</NavLink>
                    <NavLink to="/about">{t.about}</NavLink>
                </div>

                {/* Logo */}
                <Link to="/" className="text-2xl font-heading font-bold tracking-wider hover:text-accent transition-colors">
                    Table<span className="text-accent">Ease</span>
                </Link>

                {/* Mobile Menu Button - shows on left in RTL if we don't adjust, but standard is fine */}
                <div className="flex items-center gap-4 md:hidden">
                    <button
                        onClick={toggleLanguage}
                        className="text-sm font-bold border border-white/30 px-2 py-1 rounded"
                    >
                        {language === 'en' ? 'AR' : 'EN'}
                    </button>
                    <button className="text-white hover:text-accent" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-primary absolute w-full pb-6 shadow-xl border-t border-white/10"
                >
                    <div className="flex flex-col items-center space-y-4 pt-4">
                        <MobileLink to="/" onClick={() => setIsOpen(false)}>{t.home}</MobileLink>
                        <MobileLink to="/explore" onClick={() => setIsOpen(false)}>{t.explore}</MobileLink>
                        <MobileLink to="/offers" onClick={() => setIsOpen(false)}>{t.offers}</MobileLink>
                        {user ? (
                            <MobileLink to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</MobileLink>
                        ) : (
                            <MobileLink to="/login" onClick={() => setIsOpen(false)}>{t.login}</MobileLink>
                        )}
                    </div>
                </motion.div>
            )}
        </nav>
    );
}

const NavLink = ({ to, children }) => (
    <Link to={to} className="relative group font-medium text-sm tracking-wide">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
    </Link>
);

const MobileLink = ({ to, onClick, children }) => (
    <Link to={to} onClick={onClick} className="text-lg font-medium hover:text-accent transition-colors">
        {children}
    </Link>
);
