import { useLanguage } from '../../context/LanguageContext';
import { useBookings } from '../../context/BookingContext';
import { Check, X, Clock, Calendar } from 'lucide-react';

export default function BookingsManager() {
    const { t } = useLanguage();
    const { bookings, updateStatus, clearBookings } = useBookings();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-heading font-bold">{t.bookings} Management</h1>
                {bookings.length > 0 && (
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete all booking history?')) {
                                clearBookings();
                            }
                        }}
                        className="text-red-400 hover:text-red-500 text-sm font-semibold hover:underline"
                    >
                        Clear History
                    </button>
                )}
            </div>

            <div className="bg-primary border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary text-gray-400 border-b border-white/10">
                                <th className="p-6 font-semibold">ID</th>
                                <th className="p-6 font-semibold">{t.fullName}</th>
                                <th className="p-6 font-semibold">Date & Time</th>
                                <th className="p-6 font-semibold">{t.guests}</th>
                                <th className="p-6 font-semibold">Contact</th>
                                <th className="p-6 font-semibold">{t.status}</th>
                                <th className="p-6 font-semibold text-right">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-gray-500">#{booking.id}</td>
                                    <td className="p-6 font-bold">{booking.name}</td>
                                    <td className="p-6">
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1 text-gray-300"><Calendar size={14} /> {booking.date}</span>
                                            <span className="flex items-center gap-1 text-accent"><Clock size={14} /> {booking.time}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">{booking.guests} ppl</td>
                                    <td className="p-6 text-sm text-gray-400">{booking.phone}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400'
                                            : booking.status === 'rejected' ? 'bg-red-500/20 text-red-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {t[booking.status] || booking.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        {booking.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        updateStatus(booking.id, 'confirmed');
                                                        const msg = t.whatsappConfirmMsg?.replace('{restaurant}', booking.restaurantName || "TableEase") || "Booking Confirmed";
                                                        // RESTORED: Must open WhatsApp for the message to actually be sent in a frontend-only app
                                                        window.open(`https://wa.me/${booking.phone}?text=${encodeURIComponent(msg)}`, '_blank');
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all"
                                                    title="Accept & Open WhatsApp"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        updateStatus(booking.id, 'rejected');
                                                        const msg = t.whatsappRejectMsg?.replace('{restaurant}', booking.restaurantName || "TableEase") || "Booking Rejected";
                                                        // RESTORED: Must open WhatsApp for the message to actually be sent in a frontend-only app
                                                        window.open(`https://wa.me/${booking.phone}?text=${encodeURIComponent(msg)}`, '_blank');
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                                    title="Reject & Open WhatsApp"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && (
                        <div className="p-12 text-center text-gray-500">No bookings found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
