import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  FileSearch,
  Sparkles
} from 'lucide-react';

const CandidateApplications = () => {
    // Mock Data pour le suivi des candidatures
    const applications = [
        { id: 1, position: 'Développeur Full Stack React/Node', company: 'Tech Horizon', date: '12 Oct 2023', status: 'Entretien', step: 3, totalSteps: 5, iaScore: 94, lastMessage: 'Votre entretien est confirmé.' },
        { id: 2, position: 'Lead UI/UX Designer', company: 'Creative flow', date: '08 Oct 2023', status: 'En attente', step: 1, totalSteps: 4, iaScore: 88, lastMessage: 'Analyse du CV en cours...' },
        { id: 3, position: 'Product Owner IA', company: 'NeuraLink Soft', date: '05 Oct 2023', status: 'Accepté', step: 5, totalSteps: 5, iaScore: 91, lastMessage: 'Félicitations pour votre offre !' },
        { id: 4, position: 'Data Analyst Junior', company: 'Data Metrics', date: '01 Oct 2023', status: 'Refusé', step: 2, totalSteps: 4, iaScore: 72, lastMessage: 'Profil non retenu pour ce poste.' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Entretien': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'En attente': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Accepté': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Refusé': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Entretien': return <Clock size={14} />;
            case 'En attente': return <FileSearch size={14} />;
            case 'Accepté': return <CheckCircle2 size={14} />;
            case 'Refusé': return <XCircle size={14} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Mes Candidatures</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium italic">Suivez l'évolution de vos opportunités professionnelles.</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                    <button className="px-5 py-2 text-xs font-bold bg-[#B76E79] text-white rounded-xl shadow-lg shadow-[#B76E79]/20">Active</button>
                    <button className="px-5 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Archive</button>
                    <button className="px-5 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Brouillons</button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white p-2 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                    <div className="p-3 text-slate-400"><Search size={18}/></div>
                    <input 
                        type="text" 
                        placeholder="Rechercher par poste ou entreprise..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium focus:ring-0 pl-1"
                    />
                </div>
                <button className="bg-white border border-slate-100 text-slate-800 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 text-sm shadow-sm hover:bg-slate-50 transition-all">
                    <Filter size={18} /> Filtrer
                </button>
            </div>

            {/* Applications List */}
            <div className="grid grid-cols-1 gap-6">
                {applications.map((app) => (
                    <div key={app.id} className="bg-white rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 overflow-hidden group">
                        <div className="p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            {/* Company & Position Info */}
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 border border-slate-100 shadow-inner">
                                   <Sparkles className="text-[#B76E79]" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#B76E79] transition-colors">{app.position}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-sm font-semibold text-slate-500 italic">{app.company}</span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="text-xs text-slate-400 font-medium">Postulé le {app.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status and Progress */}
                            <div className="flex-1 max-w-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                        {getStatusIcon(app.status)} {app.status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400">Étape {app.step}/{app.totalSteps}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                            app.status === 'Refusé' ? 'bg-rose-400' : 
                                            app.status === 'Accepté' ? 'bg-emerald-400' : 'bg-[#B76E79]'
                                        }`}
                                        style={{ width: `${(app.step / app.totalSteps) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Actions and More */}
                            <div className="flex items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-50">
                                <button className="p-3 bg-[#B76E79]/5 text-[#B76E79] rounded-2xl hover:bg-[#B76E79] hover:text-white transition-all duration-300 relative">
                                    <MessageCircle size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                                </button>
                                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-slate-100 transition-transform active:scale-95">
                                    Détails <ChevronRight size={16} />
                                </button>
                                <button className="text-slate-300 hover:text-slate-600 transition-colors p-2"><MoreVertical size={20}/></button>
                            </div>
                        </div>

                        {/* Recent Update Banner (Optional) */}
                        <div className="px-8 py-3 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={12} className="text-amber-500" />
                                Dernier message recruteur : 
                                <span className="text-slate-800 lowercase normal-case ml-1">"{app.lastMessage}"</span>
                             </p>
                             <button className="text-[10px] font-black text-[#B76E79] uppercase tracking-tighter flex items-center gap-1 hover:underline">
                                Répondre <ExternalLink size={10} />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CandidateApplications;
