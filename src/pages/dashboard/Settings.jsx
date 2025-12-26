import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, Lock, Globe, Moon, X, Check, User, Camera, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ title, children, onClose, onSave, loading }) => {
    const { t } = useLanguage();
    return (
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
                <div className="p-6 overflow-y-auto max-h-[70vh] premium-scrollbar">
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
};

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
        name: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: user?.avatar || ''
    });
    const [fieldErrors, setFieldErrors] = useState({});

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

    // Sync profile data when user changes (e.g. init or after update)
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (activeModal === 'profile') {
            const errors = {};
            if (!profileData.name.trim()) errors.name = t.isRequired;
            if (!profileData.email.trim()) {
                errors.email = t.isRequired;
            } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
                errors.email = t.invalidEmailFormat;
            }
            if (profileData.phone && !/^[0-9+ ]{8,15}$/.test(profileData.phone.replace(/\s/g, ''))) {
                errors.phone = t.invalidPhone;
            }

            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                return;
            }
        }

        setLoading(true);
        try {
            if (activeModal === 'profile') {
                const result = await updateProfile(profileData);
                if (result.success) {
                    setActiveModal(null);
                    setFieldErrors({});
                } else {
                    alert(result.message || t.error);
                }
            } else if (activeModal === 'security') {
                if (passwords.new !== passwords.confirm) {
                    alert("Passwords do not match");
                    setLoading(false);
                    return;
                }
                const result = await updateProfile({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                });
                if (result.success) {
                    setActiveModal(null);
                    setPasswords({ current: '', new: '', confirm: '' });
                } else {
                    alert(result.message || t.error);
                }
            } else {
                // Mock notification settings update
                setTimeout(() => {
                    setActiveModal(null);
                }, 1000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border-2 border-accent object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-accent text-white p-1 rounded-full border-2 border-primary">
                                    <User size={10} />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold">{t.personalInfo}</p>
                                <p className="text-sm text-gray-400">{user?.username} &bull; {user?.email}</p>
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
                        <div className="space-y-6">
                            {/* Live Preview with Status Ring */}
                            <div className="flex flex-col items-center justify-center space-y-3 py-2">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-accent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-accent to-blue-400 shadow-xl">
                                        <div className="w-full h-full rounded-full border-4 border-white overflow-hidden shadow-inner bg-gray-100">
                                            <img
                                                src={profileData.avatar || `https://ui-avatars.com/api/?name=${profileData.name}&background=random`}
                                                alt="Live Preview"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{t.livePreview}</p>
                            </div>

                            {/* Meaningful Symbolic Avatar Picker */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-tight">
                                    <User size={14} className="text-accent" /> {t.chooseSymbolicAvatar}
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/50 rounded-3xl border border-gray-100">
                                    {[
                                        { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=b6e3f4', role: t.roleAdmin },
                                        { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Manager&backgroundColor=ffdfbf', role: t.roleManager },
                                        { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Chef&backgroundColor=d1d4f9', role: t.roleChef },
                                        { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Staff&backgroundColor=c0aede', role: t.roleStaff },
                                        { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Owner&backgroundColor=b6e3f4', role: t.roleOwner },
                                        { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Luna&backgroundColor=ffdfbf', role: t.roleSupervisor },
                                        { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Support&backgroundColor=d1d4f9', role: t.roleConcierge },
                                        { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Security&backgroundColor=c0aede', role: t.roleModerator }
                                    ].map((avatar) => (
                                        <button
                                            key={avatar.url}
                                            type="button"
                                            onClick={() => setProfileData({ ...profileData, avatar: avatar.url })}
                                            className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-500 group ${profileData.avatar === avatar.url ? 'bg-white shadow-xl shadow-accent/10 border-2 border-accent scale-105 z-10' : 'border-2 border-transparent hover:bg-white/50'}`}
                                        >
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center p-1">
                                                <img src={avatar.url} alt={avatar.role} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                                            </div>
                                            <span className={`text-[9px] font-bold uppercase text-center leading-tight ${profileData.avatar === avatar.url ? 'text-accent' : 'text-gray-400'}`}>
                                                {avatar.role}
                                            </span>
                                            {profileData.avatar === avatar.url && (
                                                <div className="absolute top-2 right-2 bg-accent text-white p-0.5 rounded-full shadow-sm">
                                                    <Check size={8} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-tight">
                                    <Camera size={14} className="text-accent" /> {t.customPhotoUrl}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t.avatarPlaceholder}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none text-gray-800 text-sm transition-all shadow-inner"
                                    value={profileData.avatar && !profileData.avatar.includes('dicebear') ? profileData.avatar : ''}
                                    onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">{t.fullName}</label>
                                <div className={`p-1 rounded-2xl border-2 transition-all ${fieldErrors.name ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40 shadow-inner bg-gray-50/50'}`}>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-transparent font-bold text-primary outline-none text-sm"
                                        value={profileData.name}
                                        onChange={e => {
                                            setProfileData({ ...profileData, name: e.target.value });
                                            if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                                        }}
                                    />
                                </div>
                                <ErrorMsg msg={fieldErrors.name} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">{t.email}</label>
                                <div className={`p-1 rounded-2xl border-2 transition-all ${fieldErrors.email ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40 shadow-inner bg-gray-50/50'}`}>
                                    <input
                                        type="email"
                                        className="w-full px-5 py-3 bg-transparent font-bold text-primary outline-none text-sm"
                                        value={profileData.email}
                                        onChange={e => {
                                            setProfileData({ ...profileData, email: e.target.value });
                                            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                                        }}
                                        dir="ltr"
                                    />
                                </div>
                                <ErrorMsg msg={fieldErrors.email} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">{t.phone}</label>
                                <div className={`p-1 rounded-2xl border-2 transition-all ${fieldErrors.phone ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40 shadow-inner bg-gray-50/50'}`}>
                                    <input
                                        type="tel"
                                        className="w-full px-5 py-3 bg-transparent font-bold text-primary outline-none text-sm"
                                        placeholder="+962 7X XXX XXXX"
                                        value={profileData.phone}
                                        onChange={e => {
                                            setProfileData({ ...profileData, phone: e.target.value });
                                            if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                                        }}
                                        dir="ltr"
                                    />
                                </div>
                                <ErrorMsg msg={fieldErrors.phone} />
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
                                    placeholder={t.currentPassPlaceholder}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">{t.newPassword}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-gray-800"
                                    placeholder={t.newPassPlaceholder}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">{t.confirmPassword}</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-gray-800"
                                    placeholder={t.confirmPassPlaceholder}
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
