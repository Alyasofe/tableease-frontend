import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
    const { language, t } = useLanguage();

    const SocialIcon = ({ icon: Icon, href }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-accent hover:border-accent hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-500 transform hover:-translate-y-1"
        >
            <Icon size={18} />
        </a>
    );

    return (
        <footer className="bg-primary text-white pt-20 pb-10 border-t border-white/5" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className={`flex flex-col items-start ${language === 'ar' ? 'gap-8' : 'gap-6'}`}>
                        <div className="flex items-center gap-2 text-2xl font-black tracking-tight w-fit" dir="ltr">
                            <span className="text-white">Table</span>
                            <span className="text-accent">Ease</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base opacity-80">
                            {t.footerDesc}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white/90 border-b border-accent/20 pb-2 inline-block">{t.quickLinks}</h3>
                        <ul className={`space-y-3 ${language === 'ar' ? 'md:space-y-4' : ''} text-gray-400 font-medium`}>
                            <li><Link to="/" className="hover:text-accent transition-colors flex items-center gap-2"> {t.home}</Link></li>
                            <li><Link to="/about" className="hover:text-accent transition-colors flex items-center gap-2"> {t.about}</Link></li>
                            <li><Link to="/explore" className="hover:text-accent transition-colors flex items-center gap-2"> {t.explore}</Link></li>
                            <li><Link to="/offers" className="hover:text-accent transition-colors flex items-center gap-2"> {t.offers}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white/90 border-b border-accent/20 pb-2 inline-block">{t.support}</h3>
                        <ul className="space-y-3 text-gray-400 font-medium">
                            <li><Link to="/help" className="hover:text-accent transition-colors">{t.helpCenter}</Link></li>
                            <li><Link to="/terms" className="hover:text-accent transition-colors">{t.termsOfService}</Link></li>
                            <li><Link to="/privacy" className="hover:text-accent transition-colors">{t.privacyPolicy}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white/90 border-b border-accent/20 pb-2 inline-block">{t.newsletter}</h3>
                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">{t.subscribe}</p>
                        <div className="flex bg-white/5 backdrop-blur-md rounded-xl p-1.5 border border-white/10 focus-within:border-accent/50 transition-all">
                            <input
                                type="email"
                                placeholder={t.email}
                                className="bg-transparent px-4 py-2 w-full focus:outline-none text-sm placeholder:text-gray-600"
                            />
                            <button
                                onClick={() => alert(t.newsletterSuccess)}
                                className="bg-accent px-6 py-2 rounded-lg hover:bg-highlight transition-all text-sm font-bold shadow-lg shadow-accent/20"
                            >
                                {t.join}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} {t.rights}</p>
                    <div className="flex items-center gap-4">
                        <SocialIcon icon={Instagram} href="#" />
                        <SocialIcon icon={Twitter} href="#" />
                        <SocialIcon icon={Linkedin} href="#" />
                        <SocialIcon icon={Facebook} href="#" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
