import { useLanguage } from '../../context/LanguageContext';
import { useBookings } from '../../context/BookingContext';
import { Check, X, Clock, Calendar, Filter, Trash2, User, Users, Phone, MessageSquare, Megaphone, TrendingUp, Zap } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

import { useToast } from '../../context/ToastContext';

export default function BookingsManager() {
    const { t, language } = useLanguage();
    const { bookings, updateStatus, updateBooking, clearBookings } = useBookings();
    const { addToast } = useToast();
    const [updating, setUpdating] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const handleUpdateStatus = async (bookingId, newStatus) => {
        setUpdating(bookingId);
        try {
            const result = await updateStatus(bookingId, newStatus);
            if (result) {
                addToast(
                    language === 'ar' ? 'تم تحديث الحالة بنجاح ✨' : 'Status updated successfully ✨',
                    'success'
                );

                const booking = bookings.find(b => b.id === bookingId);
                // Existing WhatsApp logic
                if (booking && booking.phone) {
                    let msg = "";
                    if (newStatus === 'confirmed') {
                        msg = t.whatsappConfirmMsg?.replace('{restaurant}', booking.restaurantName || "TableEase") || "Booking Confirmed";
                    } else if (newStatus === 'rejected') {
                        msg = t.whatsappRejectMsg?.replace('{restaurant}', booking.restaurantName || "TableEase") || "Booking Rejected";
                    }

                    if (msg) {
                        try {
                            const url = `https://wa.me/${booking.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(msg)}`;
                            const newWindow = window.open(url, '_blank');
                            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                                addToast(language === 'ar' ? 'تم حظر النافذة المنبثقة للواتساب' : 'WhatsApp popup blocked', 'info');
                            }
                        } catch (e) {
                            console.error("WhatsApp error", e);
                        }
                    }
                }
            } else {
                addToast(
                    language === 'ar' ? 'فشل التحديث - تحقق من الصلاحيات' : 'Update failed - Check permissions',
                    'error'
                );
            }
        } catch (error) {
            console.error("Failed to update booking status:", error);
            addToast('Error: ' + error.message, 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateNotes = async (bookingId, notes) => {
        await updateBooking(bookingId, { internal_notes: notes });
    };

    const filteredBookings = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return (bookings || []).filter(booking => {
            const bDate = new Date(booking.date);
            bDate.setHours(0, 0, 0, 0);

            if (activeFilter === 'today') return bDate.getTime() === today.getTime();
            if (activeFilter === 'tomorrow') return bDate.getTime() === tomorrow.getTime();
            if (activeFilter === 'pending') return booking.status === 'pending';
            return true;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [bookings, activeFilter]);

    const stats = useMemo(() => {
        const total = bookings?.length || 0;
        const pending = bookings?.filter(b => b.status === 'pending').length || 0;
        const confirmedToday = bookings?.filter(b => {
            const bDate = new Date(b.date);
            const today = new Date();
            return b.status === 'confirmed' && bDate.toDateString() === today.toDateString();
        }).length || 0;
        return { total, pending, confirmedToday };
    }, [bookings]);

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            rejected: "bg-red-500/10 text-red-500 border-red-500/20",
        };

        const icons = {
            pending: <Clock size={12} className="opacity-70" />,
            confirmed: <Check size={12} className="opacity-70" />,
            rejected: <X size={12} className="opacity-70" />,
        };

        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
                {icons[status]}
                {t[status] || status}
            </span>
        );
    };

    const FilterBtn = ({ id, label }) => (
        <button
            onClick={() => setActiveFilter(id)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === id
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Strategy Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.stats?.totalBookings || 'Total Requests'}</p>
                        <h4 className="text-2xl font-black text-white">{stats.total}</h4>
                    </div>
                </div>
                <div className="bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <Zap size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.stats?.pendingRequests || 'Action Required'}</p>
                        <h4 className="text-2xl font-black text-white">{stats.pending}</h4>
                    </div>
                </div>
                <div className="bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.stats?.confirmedToday || 'Guests Today'}</p>
                        <h4 className="text-2xl font-black text-white">{stats.confirmedToday}</h4>
                    </div>
                </div>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-black uppercase tracking-tight text-white mb-2">{t.bookingsManagement}</h1>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <FilterBtn id="all" label={t.allBookings} />
                        <FilterBtn id="pending" label={t.pending || 'Action Needed'} />
                        <FilterBtn id="today" label={t.today} />
                        <FilterBtn id="tomorrow" label={t.tomorrow} />
                    </div>
                </div>

                {bookings?.length > 0 && (
                    <button
                        onClick={() => { if (window.confirm(t.deleteHistoryConfirm)) clearBookings(); }}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <Trash2 size={14} />
                        {t.clearHistory}
                    </button>
                )}
            </div>

            {/* Main Table Content */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <thead>
                            <tr className="bg-white/5 text-gray-500 border-b border-white/10">
                                <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em]">{t.fullName}</th>
                                <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em]">{t.dateTime}</th>
                                <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em]">{t.guests}</th>
                                <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em]">{t.status}</th>
                                <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em] text-right">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-white text-lg tracking-tight uppercase">{booking.userName || booking.name}</h5>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-gray-500 font-bold" dir="ltr">{booking.phone}</span>
                                                    {booking.special_requests && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" title={booking.special_requests}></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-white font-black text-sm uppercase">
                                                <Calendar size={14} className="text-accent" />
                                                {new Date(booking.date).toLocaleDateString(language === 'ar' ? 'ar-JO' : 'en-US', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 font-bold text-xs">
                                                <Clock size={14} />
                                                {booking.time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl text-white font-black">
                                            <Users size={16} className="text-accent" />
                                            {booking.guests}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center justify-end gap-3">
                                            {booking.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                        disabled={updating === booking.id}
                                                        className="h-12 px-6 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                                                    >
                                                        {updating === booking.id ? (
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Check size={16} />
                                                                {language === 'ar' ? 'قبول وتواصل' : 'Accept & Notify'}
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                                                        disabled={updating === booking.id}
                                                        className="h-12 w-12 rounded-2xl bg-white/5 text-gray-500 hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-all"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => window.open(`https://wa.me/${booking.phone}`, '_blank')}
                                                    className="h-12 px-6 rounded-2xl bg-white/5 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all border border-white/5 hover:border-white/10"
                                                >
                                                    <MessageSquare size={16} />
                                                    {language === 'ar' ? 'متابعة واتساب' : 'WhatsApp Client'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                        <div className="py-32 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-700">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-600 uppercase tracking-widest">{t.noBookingsFound}</h3>
                            <p className="text-gray-700 text-sm mt-2">{language === 'ar' ? 'لا يوجد طلبات في هذا القسم حالياً' : 'No reservations in this category yet.'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Strategy Tip */}
            <div className="bg-accent/5 border border-accent/10 p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-accent flex items-center justify-center text-white shrink-0 rotate-3">
                    <Megaphone size={32} />
                </div>
                <div>
                    <h5 className="text-lg font-black text-white uppercase tracking-tight mb-1">{language === 'ar' ? 'نصيحة ذكية للنمو' : 'Smart Growth Tip'}</h5>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {language === 'ar'
                            ? 'المطاعم التي ترد على الحجوزات في أقل من ٥ دقائق تزيد فرص ولادة زبلاء دائمين بنسبة ٤٠٪. استخدم أزرار التواصل السريع لترك انطباع رائع!'
                            : 'Venues that respond to requests in under 5 minutes increase customer loyalty by 40%. Use quick actions to wow your guests!'}
                    </p>
                </div>
                <button
                    onClick={() => window.location.href = '/dashboard/offers'}
                    className="md:ml-auto bg-white text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap hover:bg-accent hover:text-white transition-all shadow-xl"
                >
                    {language === 'ar' ? 'إنشاء حملة لجذب الزبائن' : 'Boost with an Offer'}
                </button>
            </div>
        </div>
    );
}
