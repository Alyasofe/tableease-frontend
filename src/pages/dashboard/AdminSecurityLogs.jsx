import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldAlert, ShieldCheck, Activity,
    Lock, Key, Eye, UserX, AlertCircle,
    Terminal, Download, Filter, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSecurityLogs() {
    const { token } = useAuth();
    const { language, t } = useLanguage();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const logs = [
        { id: 1, action: language === 'ar' ? 'دخول المسؤول' : 'Admin Login', user: 'admin@tableease.com', ip: '192.168.1.1', status: 'Success', time: language === 'ar' ? 'منذ دقيقتين' : '2 mins ago', severity: 'low' },
        { id: 2, action: language === 'ar' ? 'إيقاف مستخدم' : 'User Suspended', user: 'admin@tableease.com', target: 'user_992', ip: '192.168.1.1', status: 'Success', time: language === 'ar' ? 'منذ ساعة' : '1 hour ago', severity: 'medium' },
        { id: 3, action: language === 'ar' ? 'فشل تسجيل الدخول' : 'Failed Login Attempt', user: 'unknown', ip: '45.12.89.231', status: 'Failed', time: language === 'ar' ? 'منذ 3 ساعات' : '3 hours ago', severity: 'high' },
        { id: 4, action: language === 'ar' ? 'إنشاء مفتاح API' : 'API Key Generated', user: 'admin@tableease.com', ip: '192.168.1.1', status: 'Success', time: language === 'ar' ? 'منذ 5 ساعات' : '5 hours ago', severity: 'medium' },
        { id: 5, action: language === 'ar' ? 'تغيير كلمة المرور' : 'Password Change', user: 'owner_shawarma_reem', ip: '82.102.3.45', status: 'Success', time: language === 'ar' ? 'أمس' : 'Yesterday', severity: 'low' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className={`flex flex-col md:flex-row justify-between items-end gap-6 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                <div className={language === 'ar' ? 'text-right' : ''}>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">
                        {t.securityLogs.split(' ')[0]} <span className="text-accent">{t.securityLogs.split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-400 font-medium">{t.securityDesc}</p>
                </div>
                <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <button className="bg-red-500/10 border border-red-500/20 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-red-500 flex items-center gap-3 hover:bg-red-500/20 transition-all">
                        <ShieldAlert size={18} /> {t.emergency}
                    </button>
                    <button className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white flex items-center gap-3 hover:bg-white/10 transition-all">
                        <Download size={18} /> {language === 'ar' ? 'تصدير السجلات' : 'Export Logs'}
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                <div className={`bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500"><ShieldCheck size={28} /></div>
                    <div className={language === 'ar' ? 'text-right' : ''}>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'حالة النظام' : 'Global Status'}</p>
                        <h4 className="text-white font-black text-xl">{language === 'ar' ? 'آمن' : 'Secure'}</h4>
                    </div>
                </div>
                <div className={`bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-500"><Activity size={28} /></div>
                    <div className={language === 'ar' ? 'text-right' : ''}>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'الجلسات النشطة' : 'Active Sessions'}</p>
                        <h4 className="text-white font-black text-xl">{12} {t.onlineNow}</h4>
                    </div>
                </div>
                <div className={`bg-primary/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500"><AlertCircle size={28} /></div>
                    <div className={language === 'ar' ? 'text-right' : ''}>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.blocked}</p>
                        <h4 className="text-white font-black text-xl">142 {language === 'ar' ? 'اليوم' : 'Today'}</h4>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-primary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden">
                <div className={`p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                    <h3 className={`text-2xl font-black text-white tracking-tight flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Terminal size={24} className="text-accent" /> {t.auditTrail}
                    </h3>
                    <div className={`flex gap-4 w-full md:w-auto ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <div className="relative flex-1 md:w-64">
                            <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500`} size={16} />
                            <input type="text" placeholder={language === 'ar' ? 'ابحث في السجلات...' : "Search logs..."} className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${language === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} text-white text-xs outline-none focus:border-accent`} />
                        </div>
                        <button className="bg-white/5 p-3 rounded-xl text-gray-400 hover:text-white border border-white/10"><Filter size={18} /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                                <th className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{language === 'ar' ? 'المستخدم' : 'User / Actor'}</th>
                                <th className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{language === 'ar' ? 'عنوان IP' : 'IP Address'}</th>
                                <th className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{t.date}</th>
                                <th className={`px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>{t.severity}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                            {log.severity === 'high' ? <ShieldAlert className="text-red-500" size={16} /> : <Lock className="text-gray-400" size={16} />}
                                            <span className="text-white font-black text-sm">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className={`px-10 py-6 text-gray-400 text-sm font-bold uppercase ${language === 'ar' ? 'text-right' : ''}`}>{log.user}</td>
                                    <td className={`px-10 py-6 text-gray-500 text-xs font-mono ${language === 'ar' ? 'text-right' : ''}`}>{log.ip}</td>
                                    <td className={`px-10 py-6 text-gray-500 text-xs ${language === 'ar' ? 'text-right' : ''}`}>{log.time}</td>
                                    <td className={`px-10 py-6 ${language === 'ar' ? 'text-right' : ''}`}>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${log.severity === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            log.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-green-500/10 text-green-500 border-green-500/20'
                                            }`}>
                                            {log.severity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
