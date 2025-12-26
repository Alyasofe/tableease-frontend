import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users, ChevronRight, Lock, Check, Smartphone, Tag, Percent } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useOffers } from '../context/OfferContext';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentForm from './PaymentForm';

export default function BookingModal({ isOpen, onClose, restaurantId, restaurantName, offerId }) {
    const [step, setStep] = useState(1);
    const { addBooking } = useBookings();
    const { user, isAuthenticated } = useAuth();
    const { offers, fetchOffers } = useOffers();
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const { id } = useParams(); // Get restaurant ID from URL params

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: 2,
        name: '',
        email: '',
        phone: ''
    });

    const [appliedOffer, setAppliedOffer] = useState(null);
    const [bookingResult, setBookingResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const BASE_DEPOSIT = 10;

    useEffect(() => {
        if (isOpen) {
            fetchOffers(); // Refresh offers when modal opens
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    name: user.username || '',
                    email: user.email || ''
                }));
            }
            setErrors({});
            setAppliedOffer(null);
        }
    }, [isOpen, user, fetchOffers]);

    // Find applicable offer for this restaurant
    useEffect(() => {
        if (isOpen && offers.length > 0 && offerId) {
            const currentResId = restaurantId || id;
            const resOffer = offers.find(o =>
                o._id === offerId &&
                (o.restaurant?._id === currentResId || o.restaurant === currentResId) &&
                o.active
            );
            if (resOffer) {
                setAppliedOffer(resOffer);
            }
        }
    }, [isOpen, offers, restaurantId, id, offerId]);

    const calculateTotal = () => {
        if (!appliedOffer) return BASE_DEPOSIT;

        // Extract percentage if present (e.g. "20% OFF")
        const discountMatch = appliedOffer.discount.match(/(\d+)%/);
        if (discountMatch) {
            const percentage = parseInt(discountMatch[1]);
            return BASE_DEPOSIT * (1 - percentage / 100);
        }

        // Fallback: Fixed reduction or just return base if complex string
        return BASE_DEPOSIT;
    };

    const validateField = (name, value) => {
        let error = '';
        if (!value || (typeof value === 'string' && !value.trim())) {
            error = t.isRequired;
        } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            error = t.invalidEmailFormat;
        } else if (name === 'phone' && !/^[0-9+]{8,15}$/.test(value.replace(/\s/g, ''))) {
            error = t.invalidPhone;
        }
        return error;
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        const newErrors = {
            date: validateField('date', formData.date),
            time: validateField('time', formData.time),
            guests: validateField('guests', formData.guests)
        };

        setErrors(newErrors);
        if (Object.values(newErrors).every(err => !err)) {
            setStep(2);
        }
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        const newErrors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            phone: validateField('phone', formData.phone)
        };

        setErrors(newErrors);
        if (Object.values(newErrors).every(err => !err)) {
            setStep(3);
        }
    };

    const handlePaymentSuccess = async () => {
        setLoading(true);
        const bookingDate = new Date(formData.date);

        const bookingData = {
            restaurant: restaurantId || id,
            user: user.id || user._id,
            date: bookingDate,
            time: formData.time,
            guests: parseInt(formData.guests),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            specialRequests: '',
            status: 'pending',
            paymentStatus: 'paid',
            appliedOffer: appliedOffer?._id
        };

        try {
            const result = await addBooking(bookingData);
            if (result.success) {
                setBookingResult('success');
                setStep(4);
            } else {
                setBookingResult('error');
                setErrors({ submit: result.message });
                setStep(4);
            }
        } catch (error) {
            setBookingResult('error');
            setStep(4);
        } finally {
            setLoading(false);
        }
    };

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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
                    className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                    {/* Header */}
                    <div className="bg-primary p-6 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-heading font-black tracking-tight uppercase">{t.completeReservation}</h3>
                            <p className="text-accent text-xs font-bold uppercase tracking-widest mt-1 opacity-80">{restaurantName}</p>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Stepper Indicator */}
                    <div className="flex w-full h-1 bg-gray-100">
                        {[1, 2, 3, 4].map(s => (
                            <div
                                key={s}
                                className={`h-full flex-1 transition-all duration-500 ${step >= s ? (s === 4 ? 'bg-green-500' : 'bg-accent') : 'bg-gray-100'}`}
                            />
                        ))}
                    </div>

                    <div className="p-8 max-h-[80vh] overflow-y-auto premium-scrollbar">
                        {!isAuthenticated ? (
                            <div className="text-center py-6">
                                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                                    <Lock size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-primary mb-2 uppercase tracking-tight">{t.loginTitle}</h3>
                                <p className="text-gray-500 mb-8 font-medium">{t.loginToBook}</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                                    >
                                        {t.close}
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="flex-1 bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-primary/20"
                                    >
                                        {t.signIn}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {step === 1 && (
                                    <form onSubmit={handleDetailsSubmit} noValidate className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{t.selectDate}</label>
                                            <div className={`relative p-1 rounded-2xl border-2 transition-all ${errors.date ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                                                <Calendar className={`absolute top-4 text-gray-400 ${language === 'ar' ? 'right-4' : 'left-4'}`} size={18} />
                                                <input
                                                    type="date"
                                                    required
                                                    className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-transparent font-bold text-primary outline-none`}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, date: e.target.value });
                                                        if (errors.date) setErrors({ ...errors, date: '' });
                                                    }}
                                                />
                                            </div>
                                            <ErrorMsg msg={errors.date} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{t.time}</label>
                                                <div className={`relative p-1 rounded-2xl border-2 transition-all ${errors.time ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                                                    <Clock className={`absolute top-4 text-gray-400 ${language === 'ar' ? 'right-4' : 'left-4'}`} size={18} />
                                                    <select
                                                        required
                                                        className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-transparent font-bold text-primary outline-none cursor-pointer appearance-none`}
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, time: e.target.value });
                                                            if (errors.time) setErrors({ ...errors, time: '' });
                                                        }}
                                                    >
                                                        <option value="">--:--</option>
                                                        <option value="18:00">6:00 PM</option>
                                                        <option value="19:00">7:00 PM</option>
                                                        <option value="20:00">8:00 PM</option>
                                                        <option value="21:00">9:00 PM</option>
                                                    </select>
                                                </div>
                                                <ErrorMsg msg={errors.time} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{t.guests}</label>
                                                <div className={`relative p-1 rounded-2xl border-2 transition-all ${errors.guests ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                                                    <Users className={`absolute top-4 text-gray-400 ${language === 'ar' ? 'right-4' : 'left-4'}`} size={18} />
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        defaultValue={2}
                                                        className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-transparent font-bold text-primary outline-none`}
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, guests: e.target.value });
                                                            if (errors.guests) setErrors({ ...errors, guests: '' });
                                                        }}
                                                    />
                                                </div>
                                                <ErrorMsg msg={errors.guests} />
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group">
                                            {t.continue}
                                            <ChevronRight size={18} className={`transition-transform duration-500 group-hover:translate-x-2 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
                                        </button>
                                    </form>
                                )}

                                {step === 2 && (
                                    <form onSubmit={handleContactSubmit} noValidate className="space-y-6">
                                        <div className="space-y-6">
                                            <div className="group">
                                                <div className={`p-1 rounded-2xl border-2 transition-all ${errors.name ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                                                    <input
                                                        type="text"
                                                        placeholder={t.fullName}
                                                        value={formData.name}
                                                        className="w-full px-5 py-3 bg-transparent font-bold text-primary outline-none"
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, name: e.target.value });
                                                            if (errors.name) setErrors({ ...errors, name: '' });
                                                        }}
                                                    />
                                                </div>
                                                <ErrorMsg msg={errors.name} />
                                            </div>

                                            <div className="group">
                                                <div className={`p-1 rounded-2xl border-2 transition-all ${errors.email ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                                                    <input
                                                        type="email"
                                                        placeholder={t.email}
                                                        value={formData.email}
                                                        className="w-full px-5 py-3 bg-transparent font-bold text-primary outline-none"
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, email: e.target.value });
                                                            if (errors.email) setErrors({ ...errors, email: '' });
                                                        }}
                                                    />
                                                </div>
                                                <ErrorMsg msg={errors.email} />
                                            </div>

                                            <div className="group">
                                                <div className={`relative p-1 rounded-2xl border-2 transition-all ${errors.phone ? 'border-red-500/50 bg-red-50/10' : 'border-gray-50 focus-within:border-accent/40'}`}>
                                                    <Smartphone className={`absolute top-4 text-gray-400 ${language === 'ar' ? 'right-4' : 'left-4'}`} size={18} />
                                                    <input
                                                        type="tel"
                                                        dir="ltr"
                                                        placeholder={t.phone}
                                                        className={`w-full ${language === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} py-3 bg-transparent font-bold text-primary outline-none`}
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, phone: e.target.value });
                                                            if (errors.phone) setErrors({ ...errors, phone: '' });
                                                        }}
                                                    />
                                                </div>
                                                <ErrorMsg msg={errors.phone} />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(1)} className="w-1/3 py-5 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-primary hover:bg-gray-50 rounded-2xl transition-all">
                                                {t.back}
                                            </button>
                                            <button type="submit" className="w-2/3 bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group">
                                                {t.continue}
                                                <ChevronRight size={18} className={`transition-transform duration-500 group-hover:translate-x-2 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-6">
                                            <h4 className="text-xl font-black text-primary uppercase tracking-tight mb-2">{t.payment}</h4>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.paymentDesc}</p>
                                        </div>

                                        {appliedOffer && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-accent/5 border border-accent/20 rounded-2xl p-5 flex items-center gap-4 mb-4"
                                            >
                                                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg">
                                                    <Percent size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-accent uppercase tracking-widest">{t.appliedOffer}</p>
                                                    <h5 className="text-primary font-black">{language === 'ar' ? appliedOffer.titleAr : appliedOffer.title}</h5>
                                                </div>
                                                <div className="text-right">
                                                    <span className="bg-accent text-white px-3 py-1 rounded-lg text-xs font-black">
                                                        {language === 'ar' ? appliedOffer.discountAr : appliedOffer.discount}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="bg-gray-50 rounded-2xl p-6 space-y-3 mb-8">
                                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                                <span>{t.originalDeposit}</span>
                                                <span className="line-through">{BASE_DEPOSIT} JOD</span>
                                            </div>
                                            {appliedOffer && (
                                                <div className="flex justify-between text-sm font-black text-green-600">
                                                    <span>{t.discountValue}</span>
                                                    <span>-{BASE_DEPOSIT - calculateTotal()} JOD</span>
                                                </div>
                                            )}
                                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                                <span className="text-primary font-black uppercase tracking-widest text-xs">{t.totalToPay}</span>
                                                <span className="text-2xl font-black text-primary">{calculateTotal()} JOD</span>
                                            </div>
                                        </div>

                                        <PaymentForm amount={calculateTotal()} onSuccess={handlePaymentSuccess} />

                                        <button onClick={() => setStep(2)} className="w-full py-4 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-primary transition-colors">
                                            {t.back}
                                        </button>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="py-2">
                                        {bookingResult === 'success' ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="relative"
                                            >
                                                {/* Ticket Body */}
                                                <div className="bg-primary rounded-[2.5rem] p-1 shadow-2xl relative overflow-hidden">
                                                    {/* Top Section */}
                                                    <div className="bg-white rounded-t-[2.2rem] p-8 pb-4 text-center">
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", damping: 10, delay: 0.2 }}
                                                            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-2xl shadow-green-500/30"
                                                        >
                                                            <Check size={40} strokeWidth={3} />
                                                        </motion.div>
                                                        <h3 className="text-3xl font-black text-primary uppercase tracking-tight mb-2">
                                                            {language === 'ar' ? "تم الحجز بنجاح!" : "Booking Success!"}
                                                        </h3>
                                                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{restaurantName}</p>
                                                    </div>

                                                    {/* Tear Effect (Line) */}
                                                    <div className="flex items-center justify-between px-1 relative h-6 bg-white">
                                                        <div className="w-6 h-6 bg-primary rounded-full absolute -left-3" />
                                                        <div className="flex-1 border-t-2 border-dashed border-gray-100 mx-4" />
                                                        <div className="w-6 h-6 bg-primary rounded-full absolute -right-3" />
                                                    </div>

                                                    {/* Bottom Section */}
                                                    <div className="bg-white rounded-b-[2.2rem] p-8 pt-4">
                                                        <div className="grid grid-cols-3 gap-4 mb-8">
                                                            <div className="text-center">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.date}</p>
                                                                <p className="text-primary font-bold text-sm">{formData.date}</p>
                                                            </div>
                                                            <div className="text-center border-x border-gray-100">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.time}</p>
                                                                <p className="text-primary font-bold text-sm tracking-tight">{formData.time}</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.guests}</p>
                                                                <p className="text-primary font-bold text-sm">{formData.guests}</p>
                                                            </div>
                                                        </div>

                                                        {appliedOffer && (
                                                            <div className="bg-accent/5 rounded-2xl p-4 border border-accent/20 mb-8 flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
                                                                        <Percent size={14} />
                                                                    </div>
                                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                                                        {language === 'ar' ? appliedOffer.titleAr : appliedOffer.title}
                                                                    </span>
                                                                </div>
                                                                <span className="text-accent font-black text-xs">
                                                                    {language === 'ar' ? appliedOffer.discountAr : appliedOffer.discount}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="w-24 h-24 bg-gray-50 rounded-2xl mx-auto mb-8 flex items-center justify-center border-2 border-dashed border-gray-200">
                                                            <Smartphone className="text-gray-300" size={32} />
                                                        </div>

                                                        <p className="text-center text-gray-500 text-[10px] font-bold mb-8 uppercase tracking-[0.2em]">
                                                            {language === 'ar' ? "صور الشاشة لتأكيد حجزك" : "Screenshot this to save your reservation"}
                                                        </p>

                                                        <button onClick={onClose} className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-primary/20">
                                                            {t.done || "Done"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                                                    <X size={48} />
                                                </div>
                                                <h3 className="text-2xl font-bold text-red-600 mb-2">{t.bookingFailed}</h3>
                                                <p className="text-gray-500 mb-6 px-4">
                                                    {errors.submit === "No suitable tables available for this time and guest count."
                                                        ? t.noSuitableTablesFound
                                                        : (errors.submit || t.bookingError)}
                                                </p>
                                                <button onClick={onClose} className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary w-full">
                                                    {t.done || "Done"}
                                                </button>
                                            </div>
                                        )}
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