import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Crown, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const AdminSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await API.get('/abonnements/all');
            if (res.data.success) {
                setSubscriptions(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to synchronize subscription matrix");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (subId, action) => {
        try {
            toast.loading("Modifying neural contract...", { id: 'sub-action' });
            if (action === 'cancel') {
                await API.patch(`/abonnements/${subId}/cancel`);
                toast.success("Protocol suspended successfully", { id: 'sub-action' });
            }
            fetchSubscriptions();
        } catch (error) {
            toast.error("Operation block detected", { id: 'sub-action' });
        }
    };

    const filteredSubs = subscriptions.filter(s => 
        s.recruteur?.nom?.toLowerCase().includes(search.toLowerCase()) || 
        s.type?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] italic">Accessing Ledger Database...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Header Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/20 mb-3"
                    >
                        <CreditCard size={12} /> Financial Ledger
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-5">
                        Subscription <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic">Nodes</span>
                        <span className="text-sm font-black text-slate-600 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{subscriptions.length} Active Contracts</span>
                    </h1>
                </div>

                <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Identify contract by recruiter or plan..." 
                            className="w-full bg-white/5 border border-white/5 p-4 pl-14 rounded-2xl text-sm font-medium text-white placeholder-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-inner group-focus-within:bg-white/[0.08]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { label: 'Total Revenue', val: `$${subscriptions.reduce((acc, s) => acc + s.prix, 0)}`, icon: <TrendingUp size={20} />, color: 'text-emerald-400' },
                    { label: 'Enterprise Nodes', val: subscriptions.filter(s => s.type === 'Enterprise').length, icon: <Crown size={20} />, color: 'text-amber-400' },
                    { label: 'Neural Sync Ops', val: '4.8k', icon: <Activity size={20} />, color: 'text-blue-400' },
                    { label: 'Active Contracts', val: subscriptions.filter(s => s.statut === 'active').length, icon: <ShieldCheck size={20} />, color: 'text-indigo-400' },
                ].map((m, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="bg-white/5 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 flex items-center gap-5 hover:border-white/20 transition-all shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className={`p-3.5 rounded-xl bg-white/5 border border-white/10 ${m.color} shadow-lg relative z-10`}>{m.icon}</div>
                        <div className="relative z-10">
                            <p className="text-2xl font-bold text-white tracking-tighter">{m.val}</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 italic font-bold">{m.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Ledger Table */}
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -z-10"></div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Client Node</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Plan Protocol</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Temporal State</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 text-right">Ledger Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredSubs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-10 py-20 text-center text-slate-600 font-medium italic">No active neural contracts detected in this sector.</td>
                                </tr>
                            ) : filteredSubs.map((s, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={s._id} 
                                    className="hover:bg-white/[0.03] transition-all group"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-blue-500 border border-white/10 group-hover:scale-110 transition-transform duration-700">
                                                <Zap size={18} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">{s.recruteur?.nom}</p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.1em] italic mt-1">{s.recruteur?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-3">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                s.type === 'Enterprise' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                                s.type === 'Pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-white/10'
                                            }`}>
                                                {s.type}
                                            </span>
                                            <p className="text-[10px] font-bold text-slate-600">Price Node: ${s.prix}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-slate-400 text-xs font-medium italic">
                                                <Clock size={14} className="text-blue-500/30" /> Ends {new Date(s.dateFin).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${s.statut === 'active' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{s.statut}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            {s.statut === 'active' ? (
                                                <button 
                                                    onClick={() => handleAction(s._id, 'cancel')}
                                                    className="px-5 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                                                >
                                                    Suspend Protocol
                                                </button>
                                            ) : (
                                                <button className="px-5 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl">
                                                    Re-Sync Contract
                                                </button>
                                            )}
                                            <button className="p-3 bg-white/5 text-slate-600 rounded-xl hover:text-white hover:bg-white/10 transition-all shadow-xl"><ArrowUpRight size={18}/></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSubscriptions;
