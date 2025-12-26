import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Shield } from 'lucide-react';

export default function TermsOfService() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-mesh py-32 selection:bg-accent/30">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-xl mb-8"
                    >
                        <Shield className="text-accent" size={16} />
                        <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">
                            Legal
                        </span>
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black font-heading text-primary mb-8 uppercase tracking-tighter leading-none">
                        {t.termsOfService}
                    </h1>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">
                            {t.lastUpdatedLabel}
                        </p>
                        <p className="text-primary font-black uppercase tracking-[0.1em] text-sm">
                            {t.january2025}
                        </p>
                    </div>
                </div>

                <div className="space-y-10">
                    {t.termsContent.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative bg-white/40 backdrop-blur-3xl border border-white/60 p-10 md:p-14 rounded-[3.5rem] hover:bg-white hover:shadow-2xl transition-all duration-700"
                        >
                            <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FileText size={80} />
                            </div>
                            <h2 className="text-3xl font-black text-primary mb-6 group-hover:text-accent transition-colors">
                                {section.title}
                            </h2>
                            <p className="text-gray-500 font-medium leading-relaxed text-lg whitespace-pre-line relative z-10">
                                {section.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-32 p-12 bg-primary rounded-[3.5rem] text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-accent/10 blur-[100px] rounded-full -translate-y-1/2" />
                    <h3 className="text-2xl font-black mb-4 relative z-10">{t.stillQuestions}</h3>
                    <p className="text-gray-400 mb-8 relative z-10 max-w-lg mx-auto">
                        {t.stillQuestionsDesc}
                    </p>
                    <a href="mailto:support@tableease.com">
                        <button className="px-10 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-highlight transition-all shadow-2xl shadow-accent/20 relative z-10">
                            {t.contactSupport}
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}
