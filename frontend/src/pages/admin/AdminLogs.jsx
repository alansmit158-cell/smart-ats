import React, { useState } from 'react';
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
  History
} from 'lucide-react';

const AdminLogs = () => {
    const [filter, setFilter] = useState('all');
    
    const logs = [
        { id: 1, time: '10:45:22', type: 'system', action: 'NLP Worker Pool expansion requested', user: 'System', severity: 'info' },
        { id: 2, time: '10:42:10', type: 'auth', action: 'Failed login attempt (Invalid JWT)', user: 'Guest_99', severity: 'warning' },
        { id: 3, time: '10:30:05', type: 'api', action: 'OpenAI GPT-4o-mini processing success', user: 'Recruiter Orange', severity: 'success' },
        { id: 4, time: '10:15:30', type: 'db', action: 'Purge of expired CV uploads (Cleanup)', user: 'CronJob', severity: 'info' },
        { id: 5, time: '09:55:12', type: 'security', action: 'Rate limit triggered for endpoint /api/auth', user: '192.168.1.45', severity: 'error' },
        { id: 6, time: '09:40:00', type: 'matching', action: 'Bulk scoring completed for Job #882', user: 'System', severity: 'success' },
    ];

    const getSeverityStyles = (severity) => {
        switch(severity) {
            case 'error': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'success': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <div className="space-y-10">
            {/* Control Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-black text-white tracking-tighter flex items-center gap-4">
                        <Terminal size={32} className="text-[#B76E79]" /> Audit & Signal Flux
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 italic font-medium">Tracez chaque interaction critique du Mainframe Smart-ATS.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-[#1e293b]/50 border border-[#1e293b] rounded-xl text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
                        <Download size={14} /> Exporter CSV
                    </button>
                    <button className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Live Feed Simulator */}
            <div className="bg-[#020617] rounded-[3rem] border border-[#1e293b] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <History size={150} className="text-[#B76E79]" />
                </div>
                
                <div className="p-8 border-b border-[#1e293b] flex flex-wrap items-center gap-6 bg-white/5 relative z-10">
                    <div className="flex bg-black/40 rounded-xl p-1 border border-[#1e293b]">
                        {['all', 'system', 'security', 'error'].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setFilter(t)}
                                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-[#B76E79] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" placeholder="Rechercher un signal..." className="w-full bg-transparent border-none outline-none text-sm text-slate-400 pl-12 focus:ring-0" />
                    </div>
                </div>

                <div className="divide-y divide-[#1e293b] bg-black/20">
                    {logs.map((log) => (
                        <div key={log.id} className="p-6 px-10 flex flex-col md:flex-row items-start md:items-center gap-8 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-6 w-40 shrink-0">
                                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{log.time}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getSeverityStyles(log.severity)}`}>
                                    {log.severity}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center text-slate-400 group-hover:text-[#B76E79] transition-colors border border-slate-800">
                                    {log.type === 'security' ? <ShieldAlert size={14} /> : log.type === 'system' ? <Cpu size={14} /> : <Activity size={14} />}
                                </div>
                                <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{log.action}</p>
                            </div>

                            <div className="flex items-center gap-3 text-slate-600">
                                <Zap size={12} className="text-[#B76E79]/50" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{log.user}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-black/40 border-t border-[#1e293b] flex justify-center">
                    <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-[#B76E79] transition-all">Charger les flux précédents</button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
