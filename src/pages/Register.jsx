import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Store } from 'lucide-react';

export default function Register() {
    const { t } = useLanguage();
    const { register } = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState('user'); // 'user' or 'owner'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const ErrorMsg = ({ msg }) => (
        <AnimatePresence>
            {msg && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 px-1"
                >
                    {msg}
                </motion.p>
            )}
        </AnimatePresence>
    );

    const validatePassword = (password) => {
        // Strong Password: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        // Included all special characters
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return re.test(password);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        const errors = {};
        if (!formData.name.trim()) errors.name = t.fullName + " " + t.isRequired;

        if (!formData.email.trim()) {
            errors.email = t.email + " " + t.isRequired;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = t.invalidEmailFormat;
        }

        if (!formData.password) errors.password = t.password + " " + t.isRequired;
        if (!formData.confirmPassword) errors.confirmPassword = t.confirmPassword + " " + t.isRequired;

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setFieldErrors({ confirmPassword: t.passwordsDoNotMatch });
            return;
        }

        if (!validatePassword(formData.password)) {
            setFieldErrors({ password: t.passwordStrength });
            return;
        }

        setLoading(true);

        try {
            // Use the new register function from AuthContext
            const result = await register(
                formData.name,
                formData.email,
                formData.password,
                role
            );

            if (!result.success) {
                setError(result.message);
            } else {
                // Redirect to dashboard for restaurant owners or home for customers
                if (role === 'restaurant_owner') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream pt-24 pb-10 px-4 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 border border-white/50"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading font-black text-primary mb-2 tracking-tight uppercase">{t.createAccount}</h1>
                    <p className="text-gray-500 font-medium">{t.joinMessage}</p>
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-50 text-red-500 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest mt-4 border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Role Switcher */}
                <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
                    <button
                        onClick={() => setRole('customer')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${role === 'customer' ? 'bg-white text-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <User size={18} /> {t.loginAsDiner}
                    </button>
                    <button
                        onClick={() => setRole('restaurant_owner')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${role === 'restaurant_owner' ? 'bg-white text-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Store size={18} /> {t.loginAsPartner}
                    </button>
                </div>

                <form onSubmit={handleRegister} noValidate className="space-y-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t.fullName}</label>
                        <div className={`p-1 rounded-2xl border-2 transition-all ${fieldErrors.name ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                            <input
                                type="text"
                                className="w-full px-5 py-3 bg-transparent font-bold text-primary outline-none"
                                onChange={e => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                                }}
                            />
                        </div>
                        <ErrorMsg msg={fieldErrors.name} />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t.email}</label>
                        <div className={`p-1 rounded-2xl border-2 transition-all ${fieldErrors.email ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                            <input
                                type="email"
                                className="w-full px-5 py-3 bg-transparent font-bold text-primary outline-none"
                                onChange={e => {
                                    setFormData({ ...formData, email: e.target.value });
                                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                                }}
                                dir="ltr"
                            />
                        </div>
                        <ErrorMsg msg={fieldErrors.email} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t.password}</label>
                            <div className={`p-1 rounded-2xl border-2 transition-all ${fieldErrors.password ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                                <input
                                    type="password"
                                    className="w-full px-5 py-3 bg-transparent font-bold text-primary outline-none text-xs"
                                    onChange={e => {
                                        setFormData({ ...formData, password: e.target.value });
                                        if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                                    }}
                                    dir="ltr"
                                />
                            </div>
                            <ErrorMsg msg={fieldErrors.password} />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{t.confirmPassword}</label>
                            <div className={`p-1 rounded-2xl border-2 transition-all ${fieldErrors.confirmPassword ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                                <input
                                    type="password"
                                    className="w-full px-5 py-3 bg-transparent font-bold text-primary outline-none text-xs"
                                    onChange={e => {
                                        setFormData({ ...formData, confirmPassword: e.target.value });
                                        if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                                    }}
                                    dir="ltr"
                                />
                            </div>
                            <ErrorMsg msg={fieldErrors.confirmPassword} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-all shadow-lg shadow-primary/20 mt-4 flex justify-center"
                    >
                        {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : t.register}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-500 text-sm">
                    {t.alreadyHaveAccount} <Link to="/login" className="text-accent font-bold hover:underline">{t.signIn}</Link>
                </div>
            </motion.div>
        </div>
    );
}
