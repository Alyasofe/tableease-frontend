import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Home, Heart, Bell, User, Search, LogOut, ChevronLeft } from 'lucide-react';

export default function CustomerLayout() {
    const { t, language } = useLanguage();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    // Bottom Navigation Items
    const navItems = [
        { path: '/', icon: Home, label: t.explore || 'Explore' },
        { path: '/me/favorites', icon: Heart, label: t.favorites || 'Favorites' },
        { path: '/me/notifications', icon: Bell, label: t.notifications || 'Alerts' },
        { path: '/me', icon: User, label: t.profile || 'Profile' },
    ];

    return (
        <div className="min-h-screen bg-cream" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Top App Bar */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
            >
                <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 md:px-8 py-3 grid grid-cols-3 items-center">
                    {/* Left Section: Back Button */}
                    <div className="flex items-center">
                        {location.pathname !== '/me' && (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all active:scale-90 group"
                            >
                                <ChevronLeft size={20} className={`text-primary transition-transform group-hover:-translate-x-0.5 ${language === 'ar' ? 'rotate-180 group-hover:translate-x-0.5' : ''}`} />
                            </button>
                        )}
                    </div>

                    {/* Middle Section: Logo (Perfectly Centered) */}
                    <div className="flex justify-center">
                        <Link to="/" className="flex items-center gap-1.5 group" dir="ltr">
                            <span className="text-xl font-black font-heading text-primary group-hover:text-accent transition-colors">Table</span>
                            <span className="text-xl font-black font-heading text-accent group-hover:text-primary transition-colors">Ease</span>
                        </Link>
                    </div>

                    {/* Right Section: User Avatar */}
                    <div className="flex justify-end">
                        <Link to="/me" className="relative group p-0.5 rounded-full border-2 border-transparent hover:border-accent transition-all">
                            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-white">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=D4A574&color=1a1a2e`}
                                    alt="Profile"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Main Content - Responsive width */}
            <main className="pt-16 pb-24 md:pb-8 px-4 md:px-8 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
                <Outlet />
            </main>

            {/* Bottom Navigation - Mobile First */}
            <motion.nav
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden"
            >
                <div className="max-w-lg mx-auto px-2 py-2 flex items-center justify-around">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${active
                                    ? 'bg-accent/10 text-accent'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="relative"
                                >
                                    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                                    {/* Notification badge example */}
                                    {item.path === '/me/notifications' && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </motion.div>
                                <span className={`text-[10px] font-bold uppercase tracking-wide ${active ? 'text-accent' : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </motion.nav>

            {/* Desktop Side Navigation (Optional - for larger screens) */}
            <aside className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`p-3 rounded-xl transition-all group relative ${active
                                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-primary'
                                    }`}
                            >
                                <Icon size={20} />
                                {/* Tooltip */}
                                <span className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-primary text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                        onClick={handleLogout}
                        className="p-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all group relative"
                    >
                        <LogOut size={20} />
                        {/* Tooltip */}
                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                            {t.logout || 'Sign Out'}
                        </span>
                    </button>
                </div>
            </aside>
        </div>
    );
}
