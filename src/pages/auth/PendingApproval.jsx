import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Clock, ShieldCheck, Mail, ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PendingApproval() {
    const { t, language } = useLanguage();
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-highlight/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-2xl w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 md:p-20 text-center shadow-2xl"
            >
                <div className="relative w-24 h-24 mx-auto mb-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-dashed border-accent/30 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-accent">
                        <Clock size={40} />
                    </div>
                </div>

                <span className="inline-block px-6 py-2 rounded-full bg-accent/10 text-accent font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                    {t.waitSystemReview || 'Application Received'}
                </span>

                <h1 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-8 leading-tight">
                    {t.pendingApprovalTitle}
                </h1>

                <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-lg mx-auto opacity-80">
                    {t.pendingApprovalDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent">
                            <ShieldCheck size={24} />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                            {language === 'ar' ? 'مراجعة أمنية' : 'Security Review'}
                        </p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent">
                            <Mail size={24} />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                            {t.smsNotificationDesc || 'Email Notification'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <ArrowLeft size={16} />
                        {t.backToHome}
                    </button>
                    <button
                        onClick={async () => {
                            await logout();
                            navigate('/');
                        }}
                        className="w-full sm:w-auto px-10 py-5 bg-white/5 text-gray-400 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3"
                    >
                        <LogOut size={16} />
                        {t.logout}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
