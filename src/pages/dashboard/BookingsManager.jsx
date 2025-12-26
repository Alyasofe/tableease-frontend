import { useLanguage } from '../../context/LanguageContext';
import { useBookings } from '../../context/BookingContext';
import { Check, X, Clock, Calendar, Filter, Trash2, User, Users, Phone } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function BookingsManager() {
    const { t, language } = useLanguage();
    const { bookings, updateStatus, clearBookings } = useBookings();
    const [updating, setUpdating] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const handleUpdateStatus = async (bookingId, newStatus) => {
        setUpdating(bookingId);
        try {
            const result = await updateStatus(bookingId, newStatus);
            if (result) {
                const booking = bookings.find(b => b.id === bookingId);
                if (booking) {
                    let msg = "";
                    if (newStatus === 'confirmed') {
                        msg = t.whatsappConfirmMsg?.replace('{restaurant}', booking.restaurantName || "TableEase") || "Booking Confirmed";
                    } else if (newStatus === 'rejected') {
                        msg = t.whatsappRejectMsg?.replace('{restaurant}', booking.restaurantName || "TableEase") || "Booking Rejected";
                    }

                    if (msg) {
                        window.open(`https://wa.me/${booking.phone}?text=${encodeURIComponent(msg)}`, '_blank');
                    }
                }
            }
        } catch (error) {
            console.error("Failed to update booking status:", error);
        } finally {
            setUpdating(false);
        }
    };

    const filteredBookings = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return bookings.filter(booking => {
            const bDate = new Date(booking.date);
            bDate.setHours(0, 0, 0, 0);

            if (activeFilter === 'today') return bDate.getTime() === today.getTime();
            if (activeFilter === 'tomorrow') return bDate.getTime() === tomorrow.getTime();
            if (activeFilter === 'thisWeek') return bDate >= today && bDate <= nextWeek;
            return true;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [bookings, activeFilter]);

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
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
                ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-black uppercase tracking-tight text-white mb-2">{t.bookingsManagement}</h1>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                        <Filter size={14} />
                        {activeFilter === 'all' ? t.allBookings : t[activeFilter]} ({filteredBookings.length})
                    </p>
                </div>

                {bookings.length > 0 && (
                    <button
                        onClick={() => {
                            if (window.confirm(t.deleteHistoryConfirm)) {
                                clearBookings();
                            }
                        }}
                        className="flex items-center gap-2 bg-red-500/10 text-red-500 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all group"
                    >
                        <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
                        {t.clearHistory}
                    </button>
                )}
            </div>

            {/* Filtering Tabs */}
            <div className="flex flex-wrap gap-3">
                <FilterBtn id="all" label={t.allBookings} />
                <FilterBtn id="today" label={t.today} />
                <FilterBtn id="tomorrow" label={t.tomorrow} />
                <FilterBtn id="thisWeek" label={t.thisWeek} />
            </div>

            {/* Table Container */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Decorative Blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] pointer-events-none" />

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <thead>
                            <tr className="bg-white/5 text-gray-400 border-b border-white/10">
                                <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em]">{t.idLabel}</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em]">{t.fullName}</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em]">{t.dateTime}</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em]">{t.guests}</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em]">{t.contactLabel}</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em]">{t.status}</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em]">{t.tableName}</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-[0.2em] text-right">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6">
                                        <span className="text-gray-600 text-[10px] font-mono group-hover:text-accent transition-colors">#{booking.id?.substring(0, 8)}</span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                                <User size={14} />
                                            </div>
                                            <span className="font-bold text-gray-200">{booking.userName || booking.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="flex items-center gap-2 text-gray-300 text-xs font-semibold">
                                                <Calendar size={13} className="text-accent/60" />
                                                {new Date(booking.date).toLocaleDateString(language === 'ar' ? 'ar-JO' : 'en-US', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <span className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
                                                <Clock size={13} className="opacity-70" />
                                                {booking.time}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-gray-300 text-sm font-bold">
                                            <Users size={14} className="text-gray-500" />
                                            {booking.guests} <span className="text-[10px] uppercase tracking-tighter opacity-50">{t.pplShort}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-gray-400 flex items-center gap-2" dir="ltr">
                                                <Phone size={12} className="opacity-50" />
                                                {booking.phone}
                                            </span>
                                            {booking.email && <span className="text-[10px] text-gray-600 truncate max-w-[150px]">{booking.email}</span>}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="p-6">
                                        <span className="text-xs font-black uppercase tracking-widest text-accent bg-accent/5 px-2 py-1 rounded border border-accent/10">
                                            {booking.tableNumber || t.auto}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        {booking.status === 'pending' ? (
                                            <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                    disabled={updating === booking.id}
                                                    className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-green-500/5 hover:scale-110"
                                                    title={t.acceptAndWhatsapp}
                                                >
                                                    {updating === booking.id ? (
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Check size={18} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                                                    disabled={updating === booking.id}
                                                    className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-red-500/5 hover:scale-110"
                                                    title={t.rejectAndWhatsapp}
                                                >
                                                    {updating === booking.id ? (
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <X size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-accent transition-colors"
                                                onClick={() => window.open(`https://wa.me/${booking.phone}`, '_blank')}
                                            >
                                                {t.connect}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredBookings.length === 0 && (
                        <div className="p-24 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                                <Calendar size={32} />
                            </div>
                            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">{t.noBookingsFound}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
