import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQItem = ({ q, a, index }) => {
    const [isOpen, setIsOpen] = useState(index === 0);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] hover:bg-white transition-all text-start group"
            >
                <div className="flex gap-6 items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-accent text-white rotate-12' : 'bg-accent/10 text-accent group-hover:rotate-6'}`}>
                        <span className="text-xl font-black">?</span>
                    </div>
                    <span className="text-xl font-black text-primary group-hover:text-accent transition-colors leading-tight">{q}</span>
                </div>
                <div className={`w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-accent/10' : ''}`}>
                    <ChevronDown className={`text-accent transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} size={20} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-10 pt-4 text-gray-500 font-medium leading-relaxed text-lg bg-white/20 rounded-b-[2.5rem] mt-[-2rem] z-[-1] relative">
                            <div className="pt-8">
                                {a}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function HelpCenter() {
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
                        <HelpCircle className="text-accent" size={16} />
                        <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">
                            {t.support}
                        </span>
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black font-heading text-primary mb-8 uppercase tracking-tighter leading-none">
                        {t.helpCenter}
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-accent/30" />
                        <p className="text-xl text-gray-500 font-bold italic">{t.faqTitle}</p>
                        <div className="h-px w-12 bg-accent/30" />
                    </div>
                </div>

                <div className="space-y-4">
                    {t.faqs.map((faq, i) => (
                        <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
                    ))}
                </div>

                <div className="mt-32 pt-12 border-t border-gray-100/50 text-center">
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                        {t.lastUpdatedLabel}
                    </p>
                    <p className="text-primary font-black uppercase tracking-[0.1em] text-sm">
                        {t.january2025}
                    </p>
                </div>
            </div>
        </div>
    );
}
