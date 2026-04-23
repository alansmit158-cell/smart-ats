import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ArrowUpRight,
  Target,
  Search,
  ChevronRight
} from 'lucide-react';

const RecruiterDashboard = () => {
    // Mock Statistics
    const stats = [
        { label: 'Candidats IA', value: '1,284', icon: <Users size={20} />, change: '+12%', color: 'bg-blue-50 text-blue-600' },
        { label: 'Offres Actives', value: '18', icon: <Briefcase size={20} />, change: '+2', color: 'bg-amber-50 text-amber-600' },
        { label: 'Recrutements', value: '42', icon: <CheckCircle size={20} />, change: '+5%', color: 'bg-emerald-50 text-emerald-600' },
    ];

    const pipeline = [
        { stage: 'Tri IA', count: 156, color: 'bg-[#B76E79]' },
        { stage: 'Entretien', count: 24, color: 'bg-slate-800' },
        { stage: 'Sélectionné', count: 12, color: 'bg-emerald-500' },
        { stage: 'Refusé', count: 89, color: 'bg-rose-400' },
    ];

    return (
        <div className="space-y-12 pb-10">
            {/* Context Header */}
            <div className="flex justify-between items-end border-b border-white pb-10">
                <div className="space-y-2">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B76E79] pl-1">Performance Overview</h2>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Bonjour, <span className="text-[#B76E79]">Alex.</span></h1>
                    <p className="text-slate-400 text-sm font-medium italic">Le moteur IA a analysé 12 nouveaux CV performants ce matin.</p>
                </div>
                <div className="hidden lg:flex items-center gap-4 bg-white p-2.5 rounded-full border border-slate-100 shadow-xl shadow-slate-100/50 pr-8">
                    <div className="w-10 h-10 bg-[#B76E79] rounded-full flex items-center justify-center text-white"><Target size={18} /></div>
                    <div className="text-xs">
                        <p className="font-black text-slate-800 tracking-tighter italic">Objectif Recrutement</p>
                        <p className="font-bold text-[#B76E79] tracking-widest uppercase text-[9px]">84% Atteint</p>
                    </div>
                </div>
            </div>

            {/* Premium Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-100/30 group hover:translate-y-[-8px] transition-all duration-700 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-[2s]"></div>
                        <div className="flex justify-between items-start mb-8 relative">
                            <div className={`p-4 rounded-2xl ${stat.color} border border-white`}>{stat.icon}</div>
                            <div className="flex items-center gap-1 text-emerald-500 font-black text-xs">
                                {stat.change} <ArrowUpRight size={14} />
                            </div>
                        </div>
                        <p className="text-4xl font-serif font-black text-slate-900 mb-1 tracking-tighter">{stat.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Pipeline / Kanban Visualization */}
                <div className="bg-white p-10 rounded-[4rem] border border-slate-50 shadow-sm space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-serif font-bold text-slate-900">Pipeline de Recrutement</h3>
                        <Sparkles size={18} className="text-[#B76E79] animate-pulse" />
                    </div>
                    <div className="space-y-6">
                        {pipeline.map((item, i) => (
                            <div key={i} className="space-y-3 group">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">{item.stage}</span>
                                    <span className="text-sm font-black text-slate-900 tracking-tighter">{item.count} Talents</span>
                                </div>
                                <div className="h-5 w-full bg-slate-50 rounded-2xl p-1 border border-slate-50">
                                    <div 
                                        className={`h-full rounded-xl transition-all duration-1000 group-hover:brightness-110 ${item.color} shadow-lg`}
                                        style={{ width: `${(item.count / 156) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6">
                         <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-3xl text-xs font-black text-slate-300 uppercase tracking-widest hover:border-[#B76E79] hover:text-[#B76E79] transition-all">Consulter l'analyse complète</button>
                    </div>
                </div>

                {/* AI Activity Log / Messages Preview */}
                <div className="bg-slate-900 p-10 rounded-[4rem] text-white space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                       <Search size={150} strokeWidth={4} />
                    </div>
                    <h3 className="text-xl font-serif font-bold relative flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#B76E79] rounded-full"></div> Activité Stratégique IA
                    </h3>
                    <div className="space-y-8 relative">
                        <div className="flex gap-6 items-start group/log cursor-pointer">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 ring-1 ring-white/10 group-hover/log:bg-amber-400 group-hover/log:text-slate-900 transition-all">
                                <Clock size={18} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic pb-1">Il y a 10 min</p>
                                <p className="text-sm font-bold text-slate-100 leading-tight">Nouveau Matching Détecté</p>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Un candidat (Paris) correspond à 98% à l'offre Senior Frontend.</p>
                            </div>
                            <ChevronRight size={18} className="text-slate-700 opacity-0 group-hover/log:opacity-100 group-hover/log:translate-x-2 transition-all mt-6" />
                        </div>

                        <div className="flex gap-6 items-start group/log cursor-pointer">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 ring-1 ring-white/10 group-hover/log:bg-emerald-400 group-hover/log:text-slate-900 transition-all">
                                <CheckCircle size={18} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic pb-1">Hier, 18:45</p>
                                <p className="text-sm font-bold text-slate-100 leading-tight">Kit Entretien Généré</p>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Le dossier IA pour Anis Derbel est prêt pour l'entretien de demain.</p>
                            </div>
                            <ChevronRight size={18} className="text-slate-700 opacity-0 group-hover/log:opacity-100 group-hover/log:translate-x-2 transition-all mt-6" />
                        </div>
                    </div>
                    <div className="pt-6 relative">
                         <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">OpenAI Infrastructure Online</span>
                            </div>
                            <div className="flex -space-x-3">
                                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-[#B76E79]">0{i}</div>)}
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
