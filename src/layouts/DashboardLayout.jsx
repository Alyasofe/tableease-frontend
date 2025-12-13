import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Store, Calendar, Settings, LogOut, Home } from 'lucide-react';

export default function DashboardLayout() {
    const { t, language } = useLanguage();
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const SidebarItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all mb-2 font-medium ${isActive(to)
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-secondary flex text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Sidebar */}
            <aside className="w-64 bg-primary border-r border-white/5 hidden md:flex flex-col fixed h-full z-20">
                <div className="p-8">
                    <h2 className="text-2xl font-bold font-heading">Table<span className="text-accent">Ease</span></h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Connect</p>
                </div>

                <nav className="flex-1 px-4">
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label={t.overview} />
                    <SidebarItem to="/dashboard/restaurant" icon={Store} label={t.myRestaurant} />
                    <SidebarItem to="/dashboard/bookings" icon={Calendar} label={t.bookings} />
                    <SidebarItem to="/dashboard/settings" icon={Settings} label={t.settings} />

                    <div className="my-4 border-t border-white/5"></div>

                    <Link
                        to="/"
                        className="flex items-center gap-3 px-6 py-4 rounded-xl transition-all mb-2 font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                        <Home size={20} />
                        <span>{t.homePage}</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-4 mb-2 bg-white/5 rounded-xl">
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                            className="w-10 h-10 rounded-full border-2 border-accent object-cover"
                            alt="Profile"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name || "User"}</p>
                            <p className="text-xs text-accent/80 font-medium truncate">{user?.email || "guest@example.com"}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all mb-2 font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                        <LogOut size={20} />
                        <span>{t.logout}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 p-8 ${language === 'ar' ? 'md:mr-64' : 'md:ml-64'} overflow-y-auto`}>
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
