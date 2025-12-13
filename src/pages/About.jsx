import { useLanguage } from '../context/LanguageContext';

export default function About() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen pt-24 pb-12 bg-cream">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white rounded-2xl p-10 shadow-lg">
                    <h1 className="text-4xl font-bold font-heading text-primary mb-6">{t.aboutTitle}</h1>
                    <p className="text-lg text-gray-600 leading-loose mb-10">
                        {t.aboutContent}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <img
                            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80"
                            alt="Restaurant interior"
                            className="rounded-xl w-full h-64 object-cover"
                        />
                        <div className="flex flex-col justify-center">
                            <h2 className="text-2xl font-bold font-heading text-accent mb-4">{t.ourMission}</h2>
                            <p className="text-gray-600">{t.missionContent}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 mt-8">
                        <h3 className="text-xl font-bold mb-4">{t.contact}</h3>
                        <p>Email: info@tableease.jo</p>
                        <p>Phone: +962 6 555 5555</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
