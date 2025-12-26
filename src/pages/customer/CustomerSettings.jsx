import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
    User, Mail, Phone, MapPin, Globe, Moon, Sun,
    Bell, Lock, ChevronRight, LogOut, Check, X,
    Camera, Shield, Tag
} from 'lucide-react';

export default function CustomerSettings() {
    const { t, language, toggleLanguage } = useLanguage();
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();

    // State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        city: user?.city || ''
    });
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        offers: true
    });
    const [darkMode, setDarkMode] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isManagingPrivacy, setIsManagingPrivacy] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showActivity: true,
        marketingCookies: false
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const result = await updateProfile(profileData);
            if (result.success) {
                setMessage({ type: 'success', text: t.changesSaved || 'Changes saved!' });
                setIsEditingProfile(false);
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: t.errorOccurred || 'An error occurred' });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: t.fileTooLarge || 'Image must be less than 2MB' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            setSaving(true);
            try {
                const result = await updateProfile({ avatar: reader.result });
                if (result.success) {
                    setMessage({ type: 'success', text: t.avatarUpdated || 'Profile picture updated!' });
                } else {
                    setMessage({ type: 'error', text: result.message });
                }
            } catch (err) {
                setMessage({ type: 'error', text: t.errorOccurred || 'An error occurred' });
            }
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        };
        reader.readAsDataURL(file);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: t.passwordsDoNotMatch || 'Passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setMessage({ type: 'error', text: t.passwordTooShort || 'Password must be at least 8 characters' });
            return;
        }

        setSaving(true);
        try {
            const result = await updateProfile({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (result.success) {
                setMessage({ type: 'success', text: t.passwordUpdated || 'Password updated successfully!' });
                setIsChangingPassword(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: t.errorOccurred || 'An error occurred' });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const SettingCard = ({ icon: Icon, iconColor, title, subtitle, action, onClick }) => (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-accent/20 transition-all"
        >
            <div className={`p-3 rounded-xl flex-shrink-0 ${iconColor || 'bg-gray-100'}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-primary">{title}</h3>
                {subtitle && <p className="text-sm text-gray-400 truncate">{subtitle}</p>}
            </div>
            <div className="flex-shrink-0 w-14 flex justify-end">
                {action || <ChevronRight size={20} className="text-gray-300" />}
            </div>
        </motion.div>
    );

    const Toggle = ({ enabled, onChange }) => (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onChange();
            }}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 flex-shrink-0 ${enabled ? 'bg-accent shadow-inner' : 'bg-gray-200'} focus:ring-2 focus:ring-accent/20 outline-none`}
        >
            <motion.div
                animate={{ x: enabled ? (language === 'ar' ? -26 : 26) : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 start-1 w-6 h-6 bg-white rounded-full shadow-lg pointer-events-none"
            />
        </button>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-6 space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gray-100 rounded-2xl">
                    <User className="text-primary" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-heading text-primary">{t.accountSettings || 'Account Settings'}</h1>
                    <p className="text-gray-500 text-sm">{t.manageYourAccount || 'Manage your account preferences'}</p>
                </div>
            </div>

            {/* Success/Error Message */}
            <AnimatePresence mode="wait">
                {message.text && (
                    <motion.div
                        key="message"
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                            {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
                            <span className="font-bold text-sm">{message.text}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Section */}
            <section className="space-y-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">{t.profile || 'Profile'}</h2>

                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                        <div className="relative">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=D4A574&color=fff&size=100`}
                                alt="Profile"
                                className="w-20 h-20 rounded-2xl object-cover border-3 border-accent/20 flex-shrink-0"
                            />
                            <div className="absolute -bottom-1 -right-1">
                                <label className="p-1.5 bg-accent rounded-lg text-white shadow-lg hover:bg-accent/90 transition-colors cursor-pointer flex items-center justify-center">
                                    <Camera size={14} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        disabled={saving}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary">{user?.username || 'User'}</h3>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-xs font-bold rounded-lg">
                                {t.roleCustomer || 'Customer'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                            className={`px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-bold text-primary transition-colors border border-gray-100 ${language === 'ar' ? 'mr-auto' : 'ml-auto'}`}
                        >
                            {isEditingProfile ? (t.cancel || 'Cancel') : (t.edit || 'Edit')}
                        </button>
                    </div>

                    {/* Edit Form */}
                    {isEditingProfile && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="pt-8 border-t border-gray-50 mt-5 space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">{t.fullName || 'Full Name'}</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={profileData.username}
                                            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                            className="w-full ps-11 pe-4 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold text-primary transition-all"
                                            placeholder={t.fullName}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">{t.phone || 'Phone Number'}</label>
                                    <div className="relative group" dir="ltr">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full ps-11 pe-4 py-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-bold text-primary transition-all text-left"
                                            placeholder="07XXXXXXXX"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="px-10 py-4 bg-accent hover:bg-highlight text-white rounded-2xl font-black transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group"
                                >
                                    {saving ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <Check size={20} className="group-hover:scale-110 transition-transform" />
                                            {t.saveChanges || 'Save Changes'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Preferences Section */}
            <section className="space-y-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">{t.preferences || 'Preferences'}</h2>

                <div className="space-y-3">
                    {/* Language */}
                    <SettingCard
                        icon={Globe}
                        iconColor="bg-blue-500"
                        title={t.language || 'Language'}
                        subtitle={language === 'ar' ? 'العربية' : 'English'}
                        action={
                            <button
                                onClick={toggleLanguage}
                                className={`px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-bold text-primary transition-colors border border-gray-100 ${language === 'ar' ? 'mr-auto' : 'ml-auto'}`}
                            >
                                {t.change || 'Change'}
                            </button>
                        }
                    />

                    {/* Dark Mode */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500 flex-shrink-0">
                                {darkMode ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-white" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-primary">{t.darkMode || 'Dark Mode'}</h3>
                                <p className="text-sm text-gray-400">{darkMode ? (t.enabled || 'Enabled') : (t.disabled || 'Disabled')}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-14 flex justify-end">
                            <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Notifications Section */}
            <section className="space-y-4">
                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-2">{t.notifications || 'Notifications'}</h2>

                <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden divide-y divide-gray-50 shadow-sm">
                    {/* Email Notifications */}
                    <div className="p-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-emerald-200/50">
                                <Mail size={22} />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-primary">{t.emailNotifications || 'Email Notifications'}</h3>
                                <p className="text-xs text-gray-400 font-medium">{t.receiveEmailUpdates || 'Receive updates via email'}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-14 flex justify-end">
                            <Toggle
                                enabled={notifications.email}
                                onChange={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                            />
                        </div>
                    </div>

                    {/* SMS Alerts */}
                    <div className="p-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-orange-200/50">
                                <Bell size={22} />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-primary">{t.smsAlerts || 'SMS Alerts'}</h3>
                                <p className="text-xs text-gray-400 font-medium">{t.receiveSmsAlerts || 'Get alerted via SMS'}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-14 flex justify-end">
                            <Toggle
                                enabled={notifications.sms}
                                onChange={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}
                            />
                        </div>
                    </div>

                    {/* Promotional Offers */}
                    <div className="p-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-pink-500 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-pink-200/50">
                                <Tag size={22} />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-primary">{t.promotionalOffers || 'Promotional Offers'}</h3>
                                <p className="text-xs text-gray-400 font-medium">{t.receiveOffers || 'Special deals and discounts'}</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-14 flex justify-end">
                            <Toggle
                                enabled={notifications.offers}
                                onChange={() => setNotifications(prev => ({ ...prev, offers: !prev.offers }))}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="space-y-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">{t.security || 'Security'}</h2>

                <SettingCard
                    icon={Lock}
                    iconColor="bg-red-500"
                    title={t.updatePassword || 'Update Password'}
                    subtitle={t.lastChanged || 'Last changed recently'}
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                />

                {isChangingPassword && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm space-y-4"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t.currentPassword || 'Current Password'}</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-accent outline-none font-bold text-xs"
                                    dir="ltr"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t.newPassword || 'New Password'}</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-accent outline-none font-bold text-xs"
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t.confirmPassword || 'Confirm Password'}</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-accent outline-none font-bold text-xs"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleUpdatePassword}
                                disabled={saving}
                                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/10 flex items-center justify-center gap-2"
                            >
                                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : t.updatePassword}
                            </button>
                        </div>
                    </motion.div>
                )}

                <SettingCard
                    icon={Shield}
                    iconColor="bg-indigo-500"
                    title={t.privacySettings || 'Privacy Settings'}
                    subtitle={t.managePrivacy || 'Control your data'}
                    onClick={() => setIsManagingPrivacy(!isManagingPrivacy)}
                />

                {isManagingPrivacy && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-[2rem] border border-indigo-100 overflow-hidden divide-y divide-gray-50 shadow-sm"
                    >
                        <div className="p-5 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-primary text-sm">{t.publicProfile || 'Public Profile'}</h3>
                                <p className="text-[10px] text-gray-400 font-medium">{t.allowDiscovery || 'Allow others to find your profile'}</p>
                            </div>
                            <Toggle enabled={privacy.profileVisible} onChange={() => setPrivacy(p => ({ ...p, profileVisible: !p.profileVisible }))} />
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-primary text-sm">{t.activityStatus || 'Activity Status'}</h3>
                                <p className="text-[10px] text-gray-400 font-medium">{t.showOnlineStatus || 'Show when you are active'}</p>
                            </div>
                            <Toggle enabled={privacy.showActivity} onChange={() => setPrivacy(p => ({ ...p, showActivity: !p.showActivity }))} />
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-primary text-sm">{t.marketingCookies || 'Marketing Cookies'}</h3>
                                <p className="text-[10px] text-gray-400 font-medium">{t.personalizedAds || 'Receive personalized advertisements'}</p>
                            </div>
                            <Toggle enabled={privacy.marketingCookies} onChange={() => setPrivacy(p => ({ ...p, marketingCookies: !p.marketingCookies }))} />
                        </div>
                    </motion.div>
                )}
            </section>

            {/* Logout Section */}
            <section className="pt-4">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors"
                >
                    <LogOut size={20} />
                    {t.logout || 'Sign Out'}
                </button>
            </section>

            {/* Bottom spacing */}
            <div className="h-8"></div>
        </motion.div>
    );
}
