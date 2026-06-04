import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  AlertTriangle, 
  Activity, 
  Zap, 
  Fingerprint,
  RefreshCcw,
  Terminal,
  ShieldCheck,
  Cpu,
  Target,
  ArrowUpRight,
  ChevronRight,
  ShieldX,
  Radar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const AdminSecurity = () => {
    const { t } = useTranslation();
    const [scanning, setScanning] = useState(false);
    
    const securityEvents = [
        { time: '02:14:05', type: 'Prompt Injection blocked', severity: 'high', location: 'Candidate #452' },
        { time: '01:55:12', type: 'Sensitive data redaction', severity: 'medium', location: 'Worker Thread #2' },
        { time: '00:42:30', type: 'Unusual token spike', severity: 'low', location: 'Recruiter Orange' },
        { time: '23:15:00', type: 'Firewall Auto-update', severity: 'info', location: 'System' },
    ];

    const runScan = () => {
        setScanning(true);
        toast.loading(t('admin.security.heuristic_scanning'), {
            style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        });
        setTimeout(() => {
            setScanning(false);
            toast.dismiss();
            toast.success(t('admin.security.scan_success'), {
                icon: '🛡️',
                style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
        }, 3000);
    };

    return (
        <div className="space-y-12 pb-24 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Security Header */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-950 p-12 rounded-[4rem] border border-white/5 relative overflow-hidden group shadow-2xl"
            >
                <div className="absolute -right-32 -top-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-5 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{t('admin.security.shield_active')}</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">{t('admin.security.title')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic"></span></h1>
                        <p className="text-slate-500 max-w-2xl text-lg font-medium italic">
                            {t('admin.security.subtitle')}
                        </p>
                    </div>
                    <button 
                        onClick={runScan}
                        disabled={scanning}
                        className={`px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 ${scanning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {scanning ? <RefreshCcw size={20} className="animate-spin" /> : <Eye size={20} />}
                        {t('admin.security.execute_scan')}
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Real-time Threat Map (Simulation) */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4">
                            <Radar size={24} className="text-blue-500 animate-pulse" /> {t('admin.security.threat_matrix')}
                        </h3>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic font-bold">{t('admin.security.live_telemetry')}</span>
                    </div>
                    
                    <div className="relative h-72 bg-slate-950/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-inner group">
                        {/* Simulation of a radar/grid */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2563eb 1.5px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 border border-blue-500/10 rounded-full animate-ping"></div>
                            <div className="absolute w-48 h-48 border border-blue-500/20 rounded-full animate-pulse duration-[3s]"></div>
                            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_20px_#f43f5e] animate-bounce delay-700"></div>
                            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981] animate-pulse"></div>
                            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa] animate-ping"></div>
                        </div>
                        <div className="absolute bottom-8 left-10 flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] italic">
                            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]"></div> {t('admin.security.attack_intercepted')}</span>
                            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div> {t('admin.security.secure_channel')}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Security Score */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-950 p-12 rounded-[4rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-10 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative w-48 h-48">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/[0.03]" />
                            <motion.circle 
                                cx="96" cy="96" r="85" 
                                stroke="currentColor" strokeWidth="10" 
                                fill="transparent" 
                                strokeDasharray="534" 
                                strokeDashoffset="53" 
                                className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                                strokeLinecap="round" 
                                initial={{ strokeDashoffset: 534 }}
                                animate={{ strokeDashoffset: 53 }}
                                transition={{ duration: 2, ease: "circOut" }}
                            />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-6xl font-bold text-white tracking-tighter">98<span className="text-2xl text-emerald-500">%</span></p>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1 font-bold">{t('admin.security.trust_index')}</p>
                         </div>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <h4 className="text-2xl font-bold text-white tracking-tight">{t('admin.security.system_optimal')}</h4>
                        <p className="text-sm text-slate-500 italic leading-relaxed px-4 font-medium">{t('admin.security.owasp_hardened')}</p>
                    </div>
                </motion.div>
            </div>

            {/* Security Logs Table */}
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -z-10"></div>
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                     <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4">
                        <ShieldAlert size={24} className="text-blue-500" /> {t('admin.security.deep_audit')}
                     </h3>
                     <div className="flex gap-4">
                        <button className="bg-white/5 p-3 rounded-xl border border-white/10 text-slate-600 hover:text-white transition-all shadow-xl"><Activity size={18}/></button>
                     </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">{t('admin.security.timestamp')}</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">{t('admin.security.threat_event')}</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 text-center">{t('admin.security.vigilance_level')}</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">{t('admin.security.origin_node')}</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 text-right">{t('admin.security.protocol')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {securityEvents.map((ev, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i} 
                                    className="hover:bg-white/[0.02] transition-all group"
                                >
                                    <td className="px-10 py-8 text-[11px] font-mono text-slate-700 font-black italic">{ev.time}</td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-500 border border-white/10 shadow-2xl group-hover:scale-110 transition-transform">
                                                <ShieldX size={18} />
                                            </div>
                                            <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">{ev.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                                            ev.severity === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 
                                            ev.severity === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                            {ev.severity}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-xs font-black text-slate-500 uppercase tracking-widest italic">{ev.location}</td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] hover:text-white transition-all flex items-center gap-2 ml-auto group/btn">
                                            {t('admin.security.deep_inspect')} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-10 border-t border-white/5 bg-slate-900/50 flex justify-center">
                    <button className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] hover:text-white transition-all italic">{t('admin.security.sync_db')}</button>
                </div>
            </div>
        </div>
    );
};

export default AdminSecurity;
