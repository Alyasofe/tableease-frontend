import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Check, Lock, Banknote, Wallet } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PaymentForm({ amount, onSuccess }) {
    const { t } = useLanguage();
    const [method, setMethod] = useState('card');
    const [processing, setProcessing] = useState(false);

    const handlePay = (e) => {
        e.preventDefault();
        setProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            onSuccess();
        }, 2000);
    };

    const methods = [
        { id: 'card', icon: CreditCard, label: t.payByCard || "Card" },
        { id: 'cliq', icon: Smartphone, label: t.payByCliq || "CliQ" },
        { id: 'wallet', icon: Wallet, label: t.payByWallet || "Wallet" },
        { id: 'cash', icon: Banknote, label: t.payAtRestaurant || "Cash" },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-gray-700">{t.reservationDeposit || "Reservation Deposit"}</span>
                <span className="text-xl font-bold text-primary">{amount} JOD</span>
            </div>

            {/* Method Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {methods.map((m) => {
                    const Icon = m.icon;
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setMethod(m.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${method === m.id
                                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-xs font-bold text-center">{m.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Forms */}
            <form onSubmit={handlePay} className="min-h-[220px]">
                <AnimatePresence mode="wait">
                    {method === 'card' && (
                        <motion.div
                            key="card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.cardHolder}</label>
                                <input type="text" required defaultValue="TEST USER" placeholder="JOHN DOE" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none font-mono uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.cardNumber}</label>
                                <input type="text" required defaultValue="4242 4242 4242 4242" placeholder="0000 0000 0000 0000" maxLength="19" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none font-mono" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.expiryDate}</label>
                                    <input type="text" required defaultValue="12/30" placeholder="MM/YY" maxLength="5" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none font-mono" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.cvv}</label>
                                    <input type="password" required defaultValue="123" placeholder="123" maxLength="3" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none font-mono" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {method === 'cliq' && (
                        <motion.div
                            key="cliq"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6"
                        >
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-2xl">
                                    ⚡
                                </div>
                                <div>
                                    <p className="text-sm text-blue-900 font-bold">Instant Transfer (CliQ)</p>
                                    <p className="text-xs text-blue-600">Merchant: TableEase</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.clicAliasLabel || "Your CliQ Alias"}</label>
                                <input type="text" required defaultValue="TEST_ALIAS" placeholder="ALIASNAME" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                            </div>
                            <p className="text-xs text-center text-gray-400">Request will be sent to your bank app.</p>
                        </motion.div>
                    )}

                    {method === 'wallet' && (
                        <motion.div
                            key="wallet"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6"
                        >
                            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <Wallet className="text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-orange-900 font-bold">E-Wallet</p>
                                    <p className="text-xs text-orange-600">ZainCash, Orange Money, UWallet</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{t.walletNumLabel || "Mobile Number"}</label>
                                <input type="tel" required defaultValue="0790000000" placeholder="079 000 0000" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                            </div>
                        </motion.div>
                    )}

                    {method === 'cash' && (
                        <motion.div
                            key="cash"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6 text-center py-4"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <Banknote size={40} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">{t.payAtRestaurant}</h4>
                                <p className="text-sm text-gray-500">You can pay the deposit when you arrive at the restaurant front desk.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full text-white py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 mt-6 ${method === 'cash' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-secondary'
                        }`}
                >
                    {processing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            {method === 'cash' ? t.confirmPay || "Confirm Booking" : `${t.payNow || "Pay Now"} ${amount} JOD`}
                            {method === 'cash' ? <Check size={18} /> : <Lock size={16} />}
                        </>
                    )}
                </button>
            </form>

            <div className="flex justify-center gap-4 grayscale opacity-40 pt-4 border-t border-gray-100">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-5" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
                <span className="text-xs font-bold border border-gray-400 rounded px-1 flex items-center">CliQ</span>
            </div>
        </div>
    );
}
