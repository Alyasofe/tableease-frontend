import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRestaurants } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Edit2, Save, X, Grid, Clock, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TablesManager() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const { restaurants, updateRestaurant, addTable, updateTable, deleteTable } = useRestaurants();

    const [restaurant, setRestaurant] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [newTable, setNewTable] = useState({ number: '', capacity: 2, isActive: true });
    const [settings, setSettings] = useState({ defaultBookingDuration: 90, bufferTime: 15 });
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (restaurants && user) {
            const userId = user._id || user.id;
            const myRes = restaurants.find(r => r.ownerId === userId || user.role === 'admin');
            if (myRes) {
                setRestaurant(myRes);
                setSettings({
                    defaultBookingDuration: myRes.defaultBookingDuration || 90,
                    bufferTime: myRes.bufferTime || 15
                });
            }
        }
    }, [restaurants, user]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddTable = async () => {
        if (!newTable.number) return;
        const result = await addTable(restaurant._id, newTable);
        if (result.success) {
            showToast(t.success);
            setIsAdding(false);
            setNewTable({ number: '', capacity: 2, isActive: true });
        }
    };

    const handleUpdateTable = async () => {
        const result = await updateTable(restaurant._id, editingTable._id, editingTable);
        if (result.success) {
            showToast(t.changesSaved);
            setEditingTable(null);
        }
    };

    const handleDeleteTable = async (tableId) => {
        if (window.confirm(t.deleteTable + '?')) {
            const result = await deleteTable(restaurant._id, tableId);
            if (result.success) {
                showToast(t.success);
            }
        }
    };

    const handleSaveSettings = async () => {
        const result = await updateRestaurant(restaurant._id, settings);
        if (result.success) {
            showToast(t.changesSaved);
        }
    };

    if (!restaurant) return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            {t.noTables}
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-black uppercase tracking-tight">{t.tableManagement}</h1>
                    <p className="text-gray-400 text-sm mt-1">{restaurant.name}</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-accent hover:bg-highlight text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-accent/20"
                >
                    <Plus size={18} />
                    {t.addTable}
                </button>
            </div>

            {/* Global Table Settings */}
            <div className="bg-primary border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Clock size={80} />
                </div>
                <h3 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Clock size={20} className="text-accent" />
                    </div>
                    {t.tableSettings}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.defaultDuration}</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={settings.defaultBookingDuration}
                                onChange={e => setSettings({ ...settings, defaultBookingDuration: parseInt(e.target.value) })}
                                className="bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none w-32"
                            />
                            <span className="text-gray-400 text-sm">{t.minutes}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.bufferTime}</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={settings.bufferTime}
                                onChange={e => setSettings({ ...settings, bufferTime: parseInt(e.target.value) })}
                                className="bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none w-32"
                            />
                            <span className="text-gray-400 text-sm">{t.minutes}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <button
                        onClick={handleSaveSettings}
                        className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/10"
                    >
                        {t.saveTable}
                    </button>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {restaurant.tables?.map((table) => (
                        <motion.div
                            key={table._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`bg-primary border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-accent/30 transition-all ${!table.isActive ? 'opacity-50 grayscale' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${table.isActive ? 'bg-accent/10' : 'bg-gray-500/10'}`}>
                                    <Grid size={24} className={table.isActive ? 'text-accent' : 'text-gray-500'} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setEditingTable(table)}
                                        className="p-2 bg-white/5 hover:bg-accent hover:text-white rounded-lg transition-all"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTable(table._id)}
                                        className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tight">{table.number}</h4>
                                <div className="flex items-center gap-2 mt-1 text-gray-400">
                                    <Users size={14} />
                                    <span className="text-xs font-bold uppercase tracking-widest">{table.capacity} {t.persons}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${table.isActive ? 'text-accent border-accent/20 bg-accent/5' : 'text-gray-500 border-gray-500/20 bg-gray-500/5'}`}>
                                    {table.isActive ? t.active : t.disabled}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {restaurant.tables?.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl text-gray-500 italic">
                        {t.noTables}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {(isAdding || editingTable) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-primary border border-white/10 rounded-[40px] p-10 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black uppercase tracking-tight">
                                    {isAdding ? t.addTable : t.editTable}
                                </h3>
                                <button onClick={() => { setIsAdding(false); setEditingTable(null); }} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.tableName}</label>
                                    <input
                                        type="text"
                                        value={isAdding ? newTable.number : editingTable.number}
                                        onChange={e => isAdding ? setNewTable({ ...newTable, number: e.target.value }) : setEditingTable({ ...editingTable, number: e.target.value })}
                                        className="w-full bg-secondary border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-accent outline-none text-lg font-bold"
                                        placeholder={t.tablePlaceholder}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">{t.capacity}</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[2, 4, 6].map(cap => (
                                            <button
                                                key={cap}
                                                onClick={() => isAdding ? setNewTable({ ...newTable, capacity: cap }) : setEditingTable({ ...editingTable, capacity: cap })}
                                                className={`py-4 rounded-xl text-sm font-black transition-all border ${(isAdding ? newTable.capacity : editingTable.capacity) === cap
                                                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                                                    : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                {cap}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="active-check"
                                        checked={isAdding ? newTable.isActive : editingTable.isActive}
                                        onChange={e => isAdding ? setNewTable({ ...newTable, isActive: e.target.checked }) : setEditingTable({ ...editingTable, isActive: e.target.checked })}
                                        className="w-5 h-5 rounded-lg accent-accent"
                                    />
                                    <label htmlFor="active-check" className="text-sm font-bold text-gray-300">{t.active}</label>
                                </div>

                                <div className="pt-4 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => { setIsAdding(false); setEditingTable(null); }}
                                        className="py-4 border border-white/10 rounded-2xl text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        onClick={isAdding ? handleAddTable : handleUpdateTable}
                                        className="py-4 bg-accent hover:bg-highlight text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} />
                                        {isAdding ? t.addTable : t.saveTable}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-10 right-10 z-[200]"
                    >
                        <div className={`p-6 rounded-3xl shadow-2xl backdrop-blur-xl border ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'} flex items-center gap-4 min-w-[300px]`}>
                            <div className={`p-2 rounded-xl ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                <Save size={20} />
                            </div>
                            <span className="font-bold">{toast.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
