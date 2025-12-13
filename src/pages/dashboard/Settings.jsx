import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, Lock, Globe, Moon, X, Check, User, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ title, children, onClose, onSave, loading }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10"
        >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">
                    {t.cancel || "Cancel"}
                </button>
                <button
                    onClick={onSave}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-secondary transition-colors flex items-center gap-2"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={18} />}
                    {t.saveChanges || "Save Changes"}
                </button>
            </div>
        </motion.div>
    </div>
);

export default function Settings() {
    const { t, toggleLanguage, language } = useLanguage();
    const { user, updateProfile } = useAuth();
    const [darkMode, setDarkMode] = useState(true);
    const [activeModal, setActiveModal] = useState(null); // null | 'notifications' | 'security' | 'profile'
    const [loading, setLoading] = useState(false);

    // Mock States for Modals
    const [notifSettings, setNotifSettings] = useState({ email: true, sms: false, promos: true });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    // Profile Edit State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: ''
    });

    // Sync profile data when user changes (e.g. init or after update)
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            if (activeModal === 'profile') {
                updateProfile(profileData);
            }
            setLoading(false);
            setActiveModal(null);
        }, 1500);
    };

    const closeModal = () => setActiveModal(null);

    return (
        <div className="space-y-8 relative">
            <h1 className="text-3xl font-heading font-bold">{t.settings}</h1>

            <div className="bg-primary border border-white/5 rounded-2xl overflow-hidden">
                {/* Account Section */}
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold text-lg">{t.account}</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {/* Person Information */}
                    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border-2 border-accent object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-accent text-white p-1 rounded-full border-2 border-primary">
                                    <User size={10} />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold">{t.personalInfo}</p>
                                <p className="text-sm text-gray-400">{user?.name} &bull; {user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveModal('profile')}
                            className="px-4 py-2 bg-secondary rounded-lg text-sm font-bold hover:bg-accent hover:text-white transition-colors"
                        >
                            {t.edit}
                        </button>
                    </div>
                </div>

                {/* Preferences Section Header */}
                <div className="p-6 border-b border-white/5 border-t border-white/5 bg-primary/50">
                    <h3 className="font-bold text-lg">{t.preferences}</h3>
                </div>

                <div className="divide-y divide-white/5">
                    {/* Language */}
                    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Globe size={20} />
                            </div>
                            <div>
                                <p className="font-bold">{t.language}</p>
                                <p className="text-sm text-gray-400">{language === 'en' ? 'English' : 'العربية'}</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleLanguage}
                            className="px-4 py-2 bg-secondary rounded-lg text-sm font-bold hover:bg-accent hover:text-white transition-colors"
                        >
                            {t.change}
                        </button>
                    </div>

                    {/* Theme */}
                    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Moon size={20} />
                            </div>
                            <div>
                                <p className="font-bold">{t.theme}</p>
                                <p className="text-sm text-gray-400">{darkMode ? t.darkMode : t.lightMode}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${darkMode ? 'bg-accent' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                <Bell size={20} />
                            </div>
                            <div>
                                <p className="font-bold">{t.notifications}</p>
                                <p className="text-sm text-gray-400">{t.emailSMS}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveModal('notifications')}
                            className="px-4 py-2 bg-secondary rounded-lg text-sm font-bold hover:bg-accent hover:text-white transition-colors"
                        >
                            {t.configure}
                        </button>
                    </div>

                    {/* Security */}
                    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <Lock size={20} />
                            </div>
                            <div>
                                <p className="font-bold">{t.security}</p>
                                <p className="text-sm text-gray-400">{t.lastChanged}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveModal('security')}
                            className="px-4 py-2 bg-secondary rounded-lg text-sm font-bold hover:bg-accent hover:text-white transition-colors"
                        >
                            {t.update}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals Handling */}
            <AnimatePresence>
                {/* Profile Modal */}
                {activeModal === 'profile' && (
                    <Modal
                        title={t.editProfile}
                        onClose={closeModal}
                        onSave={handleSave}
                        loading={loading}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <div className="relative group cursor-pointer">
                                    <img
                                        src={profileData.avatar || `https://ui-avatars.com/api/?name=${profileData.name}&background=random`}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Avatar URL"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">{t.fullName}</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-gray-800"
                                    value={profileData.name}
                                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">{t.email}</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-gray-800"
                                    value={profileData.email}
                                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">{t.phone}</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-gray-800"
                                    placeholder="+962 7X XXX XXXX"
                                    value={profileData.phone}
                                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </Modal>
                )}

                {activeModal === 'notifications' && (
                    <Modal
                        title={t.notificationPreferences}
                        onClose={closeModal}
                        onSave={handleSave}
                        loading={loading}
                    >
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 cursor-pointer text-gray-600">
                                <span className="font-medium">{t.emailNotifications}</span>
                                <input
                                    type="checkbox"
                                    checked={notifSettings.email}
                                    onChange={e => setNotifSettings({ ...notifSettings, email: e.target.checked })}
                                    className="w-5 h-5 accent-accent"
                                />
                            </label>
                            <label className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 cursor-pointer text-gray-600">
                                <span className="font-medium">{t.smsAlerts}</span>
                                <input
                                    type="checkbox"
                                    checked={notifSettings.sms}
                                    onChange={e => setNotifSettings({ ...notifSettings, sms: e.target.checked })}
                                    className="w-5 h-5 accent-accent"
                                />
                            </label>
                            <label className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 cursor-pointer text-gray-600">
                                <span className="font-medium">{t.promotionalOffers}</span>
                                <input
                                    type="checkbox"
                                    checked={notifSettings.promos}
                                    onChange={e => setNotifSettings({ ...notifSettings, promos: e.target.checked })}
                                    className="w-5 h-5 accent-accent"
                                />
                            </label>
                        </div>
                    </Modal>
                )}

                {activeModal === 'security' && (
                    <Modal
                        title={t.updatePassword}
                        onClose={closeModal}
                        onSave={handleSave}
                        loading={loading}
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">{t.currentPassword}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-gray-800"
                                    placeholder="Enter current password"
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">{t.newPassword}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-gray-800"
                                    placeholder="Enter new password"
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">{t.confirmPassword}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-gray-800"
                                    placeholder="Confirm new password"
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                />
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}
