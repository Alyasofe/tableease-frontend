import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users, ChevronRight, Lock, Check, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm';

export default function BookingModal({ isOpen, onClose, restaurantName }) {
    const [step, setStep] = useState(1);
    const { addBooking } = useBookings();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: 2,
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (isOpen && user) {
            // Pre-fill data if user is logged in
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [isOpen, user]);

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setStep(3); // Go to Payment
    };

    const handlePaymentSuccess = () => {
        // Add to global context
        addBooking({
            ...formData,
            restaurantName,
            status: 'pending', // Set to pending for Admin approval
            paymentStatus: 'paid'
        });
        setStep(4); // Success Step
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="bg-primary p-6 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-heading font-bold">{t.completeReservation}</h3>
                            <p className="text-accent text-sm">{restaurantName}</p>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Stepper Indicator */}
                    <div className="flex w-full h-1 bg-gray-100">
                        <div className={`h-full bg-accent transition-all duration-300 ${step >= 1 ? 'w-1/4' : 'w-0'}`} />
                        <div className={`h-full bg-accent transition-all duration-300 ${step >= 2 ? 'w-1/4' : 'w-0'}`} />
                        <div className={`h-full bg-accent transition-all duration-300 ${step >= 3 ? 'w-1/4' : 'w-0'}`} />
                        <div className={`h-full bg-yellow-500 transition-all duration-300 ${step === 4 ? 'w-1/4' : 'w-0'}`} />
                    </div>

                    <div className="p-8">
                        {!isAuthenticated ? (
                            <div className="text-center py-6">
                                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                                    <Lock size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-2">{t.loginTitle}</h3>
                                <p className="text-gray-500 mb-8">{t.loginToBook}</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                    >
                                        {t.close || "Cancel"}
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
                                    >
                                        {t.signIn}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {step === 1 && (
                                    <form onSubmit={handleDetailsSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.selectDate}</label>
                                            <div className="relative">
                                                <Calendar className={`absolute top-3 text-gray-400 ${document.dir === 'rtl' ? 'left-3' : 'left-3'}`} size={18} />
                                                <input
                                                    type="date"
                                                    required
                                                    className="w-full px-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.time}</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                                                    <select
                                                        required
                                                        className="w-full px-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none bg-white"
                                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                    >
                                                        <option value="">--:--</option>
                                                        <option value="18:00">6:00 PM</option>
                                                        <option value="19:00">7:00 PM</option>
                                                        <option value="20:00">8:00 PM</option>
                                                        <option value="21:00">9:00 PM</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.guests}</label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        defaultValue={2}
                                                        required
                                                        className="w-full px-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                            {t.continue} <ChevronRight size={16} />
                                        </button>
                                    </form>
                                )}

                                {step === 2 && (
                                    <form onSubmit={handleContactSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder={t.fullName}
                                                required
                                                defaultValue={formData.name}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <input
                                                type="email"
                                                placeholder={t.email}
                                                required
                                                defaultValue={formData.email}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                            <input
                                                type="tel"
                                                placeholder={t.phone}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(1)} className="w-1/3 py-4 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors">
                                                {t.back}
                                            </button>
                                            <button type="submit" className="w-2/3 bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                                {t.continue} <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-4">
                                            <h4 className="text-lg font-bold">{t.payment}</h4>
                                            <p className="text-sm text-gray-500">{t.paymentDesc}</p>
                                        </div>
                                        <PaymentForm amount={10} onSuccess={handlePaymentSuccess} />
                                        <button onClick={() => setStep(2)} className="w-full text-gray-400 text-sm mt-4 hover:text-gray-600">
                                            {t.back}
                                        </button>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="text-center py-8">
                                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 animate-pulse">
                                            <Clock size={48} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-primary mb-2">{t.bookingRequestReceived}</h3>
                                        <p className="text-gray-500 mb-6 px-4">
                                            {t.bookingPendingMsg}
                                        </p>

                                        <button onClick={onClose} className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary w-full">
                                            {t.done || "Done"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
