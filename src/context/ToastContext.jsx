import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <XCircle className="text-red-500" size={20} />,
        warning: <AlertCircle className="text-amber-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-8 flex flex-col gap-3 z-[1000] pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className="bg-white/80 backdrop-blur-2xl border border-gray-100 shadow-3xl rounded-[1.5rem] p-4 pr-6 flex items-center gap-4 min-w-[300px] group">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                    {icons[toast.type]}
                                </div>
                                <p className="text-sm font-black text-primary flex-grow">
                                    {toast.message}
                                </p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="text-gray-300 hover:text-primary transition-colors"
                                >
                                    <X size={16} />
                                </button>

                                {/* Progress Bar */}
                                <motion.div
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: 4, ease: 'linear' }}
                                    className={`absolute bottom-0 left-4 right-4 h-1 rounded-full ${toast.type === 'success' ? 'bg-green-500' :
                                            toast.type === 'error' ? 'bg-red-500' :
                                                toast.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                        } opacity-20`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
