import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ShieldAlert, Fingerprint } from 'lucide-react';

export default function PrivacyPolicy() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-mesh py-32 selection:bg-accent/30">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-xl mb-8"
                    >
                        <ShieldAlert className="text-accent" size={16} />
                        <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">
                            Privacy
                        </span>
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black font-heading text-primary mb-8 uppercase tracking-tighter leading-none">
                        {t.privacyPolicy}
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

                <div className="grid grid-cols-1 gap-10">
                    {t.privacyContent.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-white/40 backdrop-blur-3xl border border-white/60 p-10 md:p-14 rounded-[3.5rem] hover:bg-white hover:shadow-2xl transition-all duration-700 hover:border-accent/10"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 rounded-[1.8rem] bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shrink-0">
                                    <Fingerprint size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-primary mb-6 group-hover:text-accent transition-colors">
                                        {section.title}
                                    </h2>
                                    <p className="text-gray-500 font-medium leading-relaxed text-lg whitespace-pre-line">
                                        {section.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 p-12 rounded-[3.5rem] bg-gray-50/50 border border-dashed border-gray-200 text-center">
                    <p className="text-gray-400 font-medium italic mb-4">
                        "{t.privacyQuote}"
                    </p>
                    <p className="text-primary font-black uppercase tracking-widest text-xs">{t.privacyTeam}</p>
                </div>
            </div>
        </div>
    );
}
