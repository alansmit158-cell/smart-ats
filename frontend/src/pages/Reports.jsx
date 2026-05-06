import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Clock, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';

const Reports = () => {
    const stats = [
        { label: 'Taux de Conversion', value: '64.2%', trend: '+4.2%', up: true, icon: <Target className="text-blue-500" /> },
        { label: 'Temps Moyen Recrutement', value: '18j', trend: '-2j', up: true, icon: <Clock className="text-amber-500" /> },
        { label: 'Score Matching Moyen', value: '88%', trend: '+1.5%', up: true, icon: <Sparkles className="text-[#B76E79]" /> },
    ];

    const pipelineData = [
        { stage: 'Sourcing IA', count: 1240, color: 'bg-[#B76E79]' },
        { stage: 'Analysés', count: 842, color: 'bg-[#B76E79]/80' },
        { stage: 'Matches > 80%', count: 156, color: 'bg-[#B76E79]/60' },
        { stage: 'Entretiens', count: 42, color: 'bg-[#B76E79]/40' },
        { stage: 'Offres', count: 12, color: 'bg-[#B76E79]/20' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header Control */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#B76E79]/5 rounded-full blur-3xl group-hover:bg-[#B76E79]/10 transition-all duration-1000"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tighter">Analytiques & Rapports Stratégiques</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Visualisez la performance de votre pipeline de recrutement assisté par IA.</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                        <Calendar size={14} /> 30 derniers jours
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200">
                        <Download size={14} /> Exporter PDF
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-[#B76E79]/5 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-50 group-hover:scale-110 transition-transform duration-500">
                                {s.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${s.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {s.trend}
                            </div>
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-slate-900 mb-1">{s.value}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recruitment Funnel */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3">
                            <BarChart3 size={20} className="text-[#B76E79]" /> Entonnoir de Recrutement
                        </h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversion Globale</span>
                    </div>
                    
                    <div className="space-y-4">
                        {pipelineData.map((stage, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">
                                    <span>{stage.stage}</span>
                                    <span>{stage.count}</span>
                                </div>
                                <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-50">
                                    <div 
                                        className={`h-full ${stage.color} rounded-full transition-all duration-[2s] delay-${i*100} shadow-sm`}
                                        style={{ width: `${(stage.count / pipelineData[0].count) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Chart Simulation */}
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
                    <Sparkles className="absolute -right-6 -top-6 w-32 h-32 text-white/5 group-hover:scale-125 transition-transform duration-[3s]" />
                    <div className="flex justify-between items-center relative z-10">
                        <h3 className="text-xl font-serif font-bold flex items-center gap-3">
                            <TrendingUp size={20} className="text-[#B76E79]" /> Performance IA vs Humaine
                        </h3>
                        <div className="flex gap-3">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#B76E79]"></div> <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">IA Smart-ATS</span></div>
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-700"></div> <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Standard</span></div>
                        </div>
                    </div>
                    
                    <div className="h-56 flex items-end gap-3 relative z-10">
                        {[40, 65, 45, 90, 60, 100, 85].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                <div className="w-full flex gap-1 items-end h-full">
                                    <div className="flex-1 bg-[#B76E79]/20 rounded-t-lg group-hover/bar:bg-[#B76E79] transition-all duration-700" style={{ height: `${h}%` }}></div>
                                    <div className="flex-1 bg-slate-800 rounded-t-lg" style={{ height: `${h * 0.6}%` }}></div>
                                </div>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">W{i+1}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 relative z-10">
                        <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed">
                            <span className="text-[#B76E79] font-black uppercase mr-2 tracking-widest">Intelligence :</span>
                            Le moteur sémantique a permis de réduire le temps de tri des CV de <span className="text-white font-bold">72%</span> sur cette période tout en augmentant la qualité des "Shortlists" de <span className="text-white font-bold">14%</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
