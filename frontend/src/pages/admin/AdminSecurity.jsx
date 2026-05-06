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
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSecurity = () => {
    const [scanning, setScanning] = useState(false);
    
    const securityEvents = [
        { time: '02:14:05', type: 'Prompt Injection blocked', severity: 'high', location: 'Candidate #452' },
        { time: '01:55:12', type: 'Sensitive data redaction', severity: 'medium', location: 'Worker Thread #2' },
        { time: '00:42:30', type: 'Unusual token spike', severity: 'low', location: 'Recruiter Orange' },
        { time: '23:15:00', type: 'Firewall Auto-update', severity: 'info', location: 'System' },
    ];

    const runScan = () => {
        setScanning(true);
        toast.loading("Analyse heuristique en cours...");
        setTimeout(() => {
            setScanning(false);
            toast.dismiss();
            toast.success("Intégrité du système confirmée : 0 menace détectée.");
        }, 3000);
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Security Header */}
            <div className="bg-gradient-to-br from-slate-900 to-black p-12 rounded-[3rem] border border-[#1e293b] relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#B76E79]/5 rounded-full blur-[120px] group-hover:bg-[#B76E79]/10 transition-all duration-1000"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">IA Shield v4.2 Active</span>
                        </div>
                        <h1 className="text-4xl font-serif font-black text-white tracking-tighter">Firewall Sémantique & Sécurité IA</h1>
                        <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                            Protection proactive contre les injections de prompts, la fuite de données sensibles et les comportements anormaux des modèles d'IA.
                        </p>
                    </div>
                    <button 
                        onClick={runScan}
                        disabled={scanning}
                        className={`px-10 py-5 bg-[#B76E79] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#B76E79]/20 hover:scale-105 transition-all flex items-center gap-3 ${scanning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {scanning ? <RefreshCcw size={16} className="animate-spin" /> : <Eye size={16} />}
                        Lancer Scan Heuristique
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Real-time Threat Map (Simulation) */}
                <div className="lg:col-span-2 bg-[#1e293b]/10 backdrop-blur-md p-10 rounded-[3rem] border border-[#1e293b] space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3">
                            <Activity size={20} className="text-[#B76E79]" /> Matrice des Menaces
                        </h3>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signal Global</span>
                    </div>
                    
                    <div className="relative h-64 bg-black/40 rounded-[2rem] border border-[#1e293b] overflow-hidden">
                        {/* Simulation of a radar/grid */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#B76E79 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border border-[#B76E79]/20 rounded-full animate-ping"></div>
                            <div className="absolute w-32 h-32 border border-[#B76E79]/40 rounded-full animate-pulse"></div>
                            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e] animate-bounce"></div>
                            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> Attaque bloquée</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Trafic sain</span>
                        </div>
                    </div>
                </div>

                {/* Security Score */}
                <div className="bg-black/40 p-10 rounded-[3rem] border border-[#1e293b] flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative w-40 h-40">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="440" strokeDashoffset="44" className="text-emerald-500" strokeLinecap="round" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-4xl font-black text-white">98%</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Trust Score</p>
                         </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-serif font-bold text-white">Niveau de confiance optimal</h4>
                        <p className="text-xs text-slate-500 mt-2 italic">Votre instance est protégée par les derniers standards OWASP Top 10 pour LLM.</p>
                    </div>
                </div>
            </div>

            {/* Security Logs Table */}
            <div className="bg-[#1e293b]/10 backdrop-blur-md rounded-[3rem] border border-[#1e293b] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-[#1e293b] flex justify-between items-center bg-[#1e293b]/20">
                     <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3">
                        <Terminal size={20} className="text-[#B76E79]" /> Audit Log de Sécurité
                     </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#1e293b]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Événement</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Sévérité</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Origine</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]">
                            {securityEvents.map((ev, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6 text-[11px] font-mono text-slate-500 italic">{ev.time}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <Lock size={14} className="text-[#B76E79]" />
                                            <span className="text-sm font-bold text-white">{ev.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            ev.severity === 'high' ? 'bg-rose-900/20 text-rose-500 border-rose-500/20' : 
                                            ev.severity === 'medium' ? 'bg-amber-900/20 text-amber-500 border-amber-500/20' : 'bg-blue-900/20 text-blue-500 border-blue-500/20'
                                        }`}>
                                            {ev.severity}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-slate-400">{ev.location}</td>
                                    <td className="px-8 py-6">
                                        <button className="text-[10px] font-black text-[#B76E79] uppercase tracking-widest hover:underline italic">Inspecter</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSecurity;
