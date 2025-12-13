import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h2 className="text-2xl font-bold font-heading mb-4">Table<span className="text-accent">Ease</span></h2>
                        <p className="text-gray-400 leading-relaxed">
                            {t.footerDesc}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">{t.quickLinks}</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-accent transition-colors">{t.home}</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">{t.about}</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">{t.explore}</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">{t.contact}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">{t.support}</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">{t.newsletter}</h3>
                        <p className="text-gray-400 mb-4 text-sm">{t.subscribe}</p>
                        <div className="flex bg-white/10 rounded-lg p-1">
                            <input type="email" placeholder={t.email} className="bg-transparent px-4 py-2 w-full focus:outline-none text-sm" />
                            <button
                                onClick={() => alert(t.newsletterSuccess)}
                                className="bg-accent px-4 py-2 rounded-md hover:bg-highlight transition-colors text-sm font-semibold whitespace-nowrap"
                            >
                                {t.join}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} {t.rights}
                </div>
            </div>
        </footer>
    );
}
