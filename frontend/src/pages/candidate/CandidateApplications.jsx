import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Loader2,
  Calendar,
  Briefcase
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CandidateApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/applications/my-applications', config);
                setApplications(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching applications:", error);
                toast.error("Erreur lors du chargement de vos candidatures.");
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Interviewed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Reviewed': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Interviewed': return 'Entretien';
            case 'Pending': return 'En attente';
            case 'Reviewed': return 'En cours d\'examen';
            case 'Accepted': return 'Accepté';
            case 'Rejected': return 'Refusé';
            default: return status;
        }
    };

    const getStepInfo = (status) => {
        switch (status) {
            case 'Pending': return { step: 1, total: 4 };
            case 'Reviewed': return { step: 2, total: 4 };
            case 'Interviewed': return { step: 3, total: 4 };
            case 'Accepted': return { step: 4, total: 4 };
            case 'Rejected': return { step: 2, total: 4 };
            default: return { step: 0, total: 4 };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Interviewed': return <Clock size={14} />;
            case 'Pending': return <Calendar size={14} />;
            case 'Reviewed': return <Sparkles size={14} />;
            case 'Accepted': return <CheckCircle2 size={14} />;
            case 'Rejected': return <XCircle size={14} />;
            default: return null;
        }
    };

    const filteredApps = applications.filter(app => 
        app.job.titre.toLowerCase().includes(search.toLowerCase()) ||
        app.job.recruiter?.nom?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="text-[#B76E79] animate-spin" />
                <p className="text-slate-400 font-medium italic">Récupération de vos candidatures stratégiques...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Mes Candidatures</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium italic">Suivez en temps réel l'évolution de vos opportunités.</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                    <button className="px-5 py-2 text-xs font-bold bg-[#B76E79] text-white rounded-xl shadow-lg shadow-[#B76E79]/20">Toutes</button>
                    <button className="px-5 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Entretiens</button>
                    <button className="px-5 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Archives</button>
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="bg-white border border-slate-100 text-slate-800 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 text-sm shadow-sm hover:bg-slate-50 transition-all">
                    <Filter size={18} /> Filtrer
                </button>
            </div>

            {/* Applications List */}
            <div className="grid grid-cols-1 gap-6 pb-12">
                {filteredApps.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center">
                        <Briefcase size={48} className="mx-auto text-slate-100 mb-4" />
                        <h3 className="text-xl font-serif font-bold text-slate-400">Aucune candidature trouvée</h3>
                        <p className="text-slate-300 text-sm italic mt-2">Commencez par postuler aux offres recommandées sur votre portail.</p>
                    </div>
                ) : filteredApps.map((app, idx) => {
                    const stepInfo = getStepInfo(app.status);
                    return (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={app._id} 
                            className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 overflow-hidden group"
                        >
                            <div className="p-6 lg:p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                                {/* Company & Position Info */}
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-[#FDFCF0] rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 border border-[#B76E79]/20 shadow-inner">
                                       <Sparkles className="text-[#B76E79]" size={26} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#B76E79] transition-colors tracking-tight">{app.job.titre}</h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                            <span className="text-sm font-semibold text-slate-500 italic">{app.job.recruiter?.nom || 'Smart Recruiter'}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span className="text-xs text-slate-400 font-medium">Postulé le {new Date(app.dateDepot).toLocaleDateString()}</span>
                                            {app.scoreMatching > 0 && (
                                                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">Match IA {app.scoreMatching}%</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status and Progress */}
                                <div className="flex-1 max-w-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                            {getStatusIcon(app.status)} {getStatusText(app.status)}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Étape {stepInfo.step}/{stepInfo.total}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(stepInfo.step / stepInfo.total) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`h-full rounded-full ${
                                                app.status === 'Rejected' ? 'bg-rose-400' : 
                                                app.status === 'Accepted' ? 'bg-emerald-400' : 'bg-[#B76E79]'
                                            }`}
                                        ></motion.div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4 border-t xl:border-t-0 pt-6 xl:pt-0 border-slate-50">
                                    <button className="p-4 bg-[#B76E79]/5 text-[#B76E79] rounded-2xl hover:bg-[#B76E79] hover:text-white transition-all duration-300 relative group/btn">
                                        <MessageCircle size={20} />
                                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Contacter le recruteur</span>
                                    </button>
                                    <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xl shadow-slate-100 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">
                                        Détails <ChevronRight size={16} />
                                    </button>
                                    <button className="text-slate-300 hover:text-slate-600 transition-colors p-2"><MoreVertical size={20}/></button>
                                </div>
                            </div>

                            {/* Status Update Banner */}
                            <div className="px-8 lg:px-10 py-4 bg-[#FDFCF0]/50 border-t border-slate-50 flex items-center justify-between">
                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${app.status === 'Pending' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                                    Dernière mise à jour : 
                                    <span className="text-slate-800 lowercase normal-case ml-1">
                                        {app.status === 'Pending' ? 'Votre candidature est en attente de lecture.' : 
                                         app.status === 'Reviewed' ? 'Le recruteur a consulté votre profil.' :
                                         app.status === 'Interviewed' ? 'Invitation à un entretien envoyée.' :
                                         app.status === 'Accepted' ? 'Offre émise ! Félicitations.' : 'Profil non retenu.'}
                                    </span>
                                 </p>
                                 <button className="text-[10px] font-black text-[#B76E79] uppercase tracking-widest flex items-center gap-1 hover:underline group">
                                    Historique complet <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                 </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default CandidateApplications;
