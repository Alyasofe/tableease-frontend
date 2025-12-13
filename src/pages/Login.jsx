import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Store, User } from 'lucide-react';

export default function Login() {
    const { t } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState('user'); // 'user' or 'owner'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulation
        setTimeout(() => {
            login(formData.email, formData.password, role);
            setLoading(false);
            if (role === 'owner') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream pt-20 pb-10 px-4 relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-white/50 relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">Table<span className="text-accent">Ease</span></h1>
                    <p className="text-gray-500">{t.loginSubtitle}</p>
                </div>

                {/* Role Switcher */}
                <div className="bg-gray-100 p-1 rounded-xl flex mb-8">
                    <button
                        onClick={() => setRole('user')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${role === 'user' ? 'bg-white text-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <User size={18} /> {t.loginAsDiner || "Diner"}
                    </button>
                    <button
                        onClick={() => setRole('owner')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${role === 'owner' ? 'bg-white text-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Store size={18} /> {t.loginAsPartner || "Restaurant"}
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t.email}</label>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:bg-white transition-all outline-none"
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t.password}</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:bg-white transition-all outline-none"
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            dir="ltr"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                {t.signIn}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    {t.noAccount} <Link to="/register" className="text-accent font-bold hover:underline">{t.register}</Link>
                </div>
            </motion.div>
        </div>
    );
}
