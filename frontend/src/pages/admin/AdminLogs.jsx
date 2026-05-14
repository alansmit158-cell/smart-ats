import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Search, 
  Download, 
  Trash2, 
  Filter, 
  ShieldAlert, 
  Zap, 
  Cpu, 
  Activity,
  History,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  ChevronRight,
  Database,
  Lock,
  Globe,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axiosConfig';

const AdminLogs = () => {
    const [filter, setFilter] = useState('all');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await API.get('/admin/audit-logs');
                if (res.data.success) {
                    setLogs(res.data.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching logs");
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getSeverityStyles = (action) => {
        const a = action.toUpperCase();
        if (a.includes('FAIL') || a.includes('ERROR') || a.includes('UNAUTHORIZED') || a.includes('ABORTED')) {
            return 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
        }
        if (a.includes('SUCCESS') || a.includes('COMPLETED') || a.includes('SYNC')) {
            return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
        }
        if (a.includes('WARNING') || a.includes('RETRY')) {
            return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        }
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    };

    const getLogIcon = (action) => {
        const a = action.toUpperCase();
        if (a.includes('AUTH') || a.includes('LOGIN') || a.includes('ACCESS')) return <Lock size={16} />;
        if (a.includes('NLP') || a.includes('WORKER') || a.includes('OPENAI')) return <Cpu size={16} />;
        if (a.includes('DB') || a.includes('STORAGE') || a.includes('CLEANUP')) return <Database size={16} />;
        if (a.includes('NETWORK') || a.includes('API')) return <Globe size={16} />;
        return <Activity size={16} />;
    };

    const filteredLogs = logs.filter(log => 
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] italic">Accessing System Signal Stream...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Control Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/20 mb-3"
                    >
                        <ShieldCheck size={12} /> Neural Audit Interface
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
                        Signal <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic">Flux</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium italic mt-2">Trace every critical transaction within the Smart-ATS mainframe.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:text-white transition-all shadow-xl backdrop-blur-md">
                        <Download size={18} /> Export Telemetry
                    </button>
                    <button className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-2xl">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Terminal View */}
            <div className="bg-[#020617] rounded-[4rem] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative flex flex-col">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                    <History size={250} />
                </div>
                
                <div className="p-10 border-b border-white/5 flex flex-wrap items-center justify-between gap-8 bg-white/[0.02] relative z-10 backdrop-blur-3xl">
                    <div className="flex bg-slate-900 rounded-2xl p-1.5 border border-white/5 shadow-inner">
                        {['all', 'auth', 'system', 'security'].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setFilter(t)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === t ? 'bg-blue-600 text-white shadow-[0_0_20px_#2563eb]' : 'text-slate-600 hover:text-slate-300'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 group max-w-xl">
                        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Identify specific signal pattern..." 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-sm font-medium text-white placeholder-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-inner group-focus-within:bg-white/10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="divide-y divide-white/[0.03] bg-slate-950/50 backdrop-blur-xl max-h-[700px] overflow-y-auto custom-scrollbar">
                    {filteredLogs.length > 0 ? filteredLogs.slice().reverse().map((log, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            key={log._id || idx} 
                            className="p-8 px-12 flex flex-col xl:flex-row items-start xl:items-center gap-10 hover:bg-white/[0.02] transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-blue-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex items-center gap-8 w-56 shrink-0 relative z-10">
                                <span className="text-[11px] font-mono text-slate-700 font-black uppercase tracking-[0.2em]">{new Date(log.time).toLocaleTimeString()}</span>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSeverityStyles(log.action)}`}>
                                    {log.action.includes('ERROR') || log.action.includes('FAIL') ? 'Critical' : 'Operational'}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-6 flex-1 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:scale-110 group-hover:border-blue-500/20 transition-all shadow-2xl">
                                    {getLogIcon(log.action)}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors tracking-tight">{log.action}</p>
                                    <p className="text-xs text-slate-600 font-medium italic">{log.details}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-700 font-black text-[10px] uppercase tracking-widest relative z-10">
                                <Zap size={14} className="text-blue-500/30" />
                                <span className="group-hover:text-blue-400 transition-colors">Internal_Node</span>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="p-32 text-center space-y-6">
                            <RefreshCcw size={48} className="mx-auto text-slate-900 animate-spin-slow" />
                            <p className="text-slate-600 font-bold text-[11px] uppercase tracking-[0.4em] italic">No active signals matching your pattern.</p>
                        </div>
                    )}
                </div>

                <div className="p-10 bg-slate-900/50 border-t border-white/5 flex justify-center items-center backdrop-blur-3xl">
                    <button className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] hover:text-blue-400 transition-all flex items-center gap-4 group">
                        Synchronize Previous Cycles <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
            
            {/* Real-time Telemetry Overlay */}
            <div className="fixed bottom-10 right-10 z-50">
                <div className="bg-slate-900/80 backdrop-blur-2xl p-5 px-8 rounded-full border border-white/10 shadow-2xl flex items-center gap-5">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mainframe Link Active</span>
                    </div>
                    <div className="w-[1px] h-4 bg-white/10"></div>
                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Lat: 12ms</div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
