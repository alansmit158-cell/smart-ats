import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MoreVertical, 
  Plus, 
  Sparkles, 
  FileText, 
  BrainCircuit, 
  Download, 
  ChevronRight,
  TrendingUp,
  X,
  CheckCircle2,
  AlertTriangle,
  Star,
  MessageSquare,
  Search,
  Filter,
  Loader2,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const RecruiterInterviews = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKit, setSelectedKit] = useState(null);
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [activeApp, setActiveApp] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    // Filters State
    const [statusFilter, setStatusFilter] = useState('');
    const [scoreRange, setScoreRange] = useState({ min: 0, max: 100 });
    const [sortBy, setSortBy] = useState('score');
    const [search, setSearch] = useState('');

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { 
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    status: statusFilter,
                    scoreMin: scoreRange.min,
                    scoreMax: scoreRange.max,
                    sortBy: sortBy,
                    order: 'desc'
                }
            };
            
            // On prend le premier job du recruteur pour la démo
            const jobsRes = await axios.get('http://localhost:5000/api/jobs', config);
            if (jobsRes.data.length > 0) {
                const jobId = jobsRes.data[0]._id;
                const appsRes = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, config);
                setApplications(appsRes.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching applications:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [statusFilter, scoreRange, sortBy]);

    const handleEvaluationSubmit = async () => {
        if (rating === 0) {
            toast.error("Veuillez attribuer une note.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Mise à jour de l'évaluation (simulée ou réelle selon l'endpoint existant)
            // Ici on simule le succès pour le PFE
            toast.success(`Évaluation de ${activeApp.candidate.user.nom} enregistrée avec succès.`, {
                icon: '🌟',
                style: { borderRadius: '20px', background: '#333', color: '#fff' }
            });
            setShowEvaluation(false);
            setRating(0);
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

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

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B76E79] mb-2 pl-1">Recruitment tracking</h2>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Suivi des Candidatures</h1>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => { setStatusFilter(''); setScoreRange({min:0, max:100}); setSortBy('score'); }}
                        className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#B76E79] transition-all shadow-sm"
                        title="Réinitialiser"
                    >
                        <RefreshCcw size={20} />
                    </button>
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-slate-200">
                        <Plus size={18} /> Nouveau Candidat
                    </button>
                </div>
            </div>

            {/* Filter Bar Plugin */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col xl:flex-row items-center gap-6">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un candidat..." 
                        className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#B76E79]/10 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut:</span>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-50 border-none rounded-xl py-2 px-4 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-[#B76E79]/10 outline-none"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="Pending">En attente</option>
                            <option value="Reviewed">Examiné</option>
                            <option value="Interviewed">Entretien</option>
                            <option value="Accepted">Accepté</option>
                            <option value="Rejected">Refusé</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score Min:</span>
                        <input 
                            type="number" 
                            min="0" max="100"
                            value={scoreRange.min}
                            onChange={(e) => setScoreRange({...scoreRange, min: e.target.value})}
                            className="w-16 bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-[#B76E79]/10 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trier par:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-slate-50 border-none rounded-xl py-2 px-4 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-[#B76E79]/10 outline-none"
                        >
                            <option value="score">Meilleur Score</option>
                            <option value="date">Date de dépôt</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                    <h3 className="font-serif font-bold text-lg text-slate-800">
                        {loading ? 'Analyse du vivier...' : `${applications.length} candidatures identifiées`}
                    </h3>
                    <div className="flex gap-2">
                        <span className="px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Telemetry
                        </span>
                    </div>
                </div>
                
                <div className="divide-y divide-slate-50">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 size={40} className="text-[#B76E79] animate-spin" />
                            <p className="text-slate-400 font-medium italic">Filtrage des données en temps réel...</p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="p-20 text-center space-y-4">
                            <Filter size={48} className="mx-auto text-slate-100" />
                            <p className="text-slate-400 font-medium italic">Aucun résultat ne correspond à vos critères.</p>
                        </div>
                    ) : applications.map((app, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={app._id} 
                            className="p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 hover:bg-[#B76E79]/5 transition-all group"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors shrink-0 shadow-inner text-[#B76E79] font-serif font-black">
                                   {app.candidate.user?.nom?.[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-slate-800 group-hover:text-[#B76E79] transition-colors">{app.candidate.user?.nom}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic mt-0.5">{app.job.titre}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-500">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-slate-400 mb-1">Dépôt</span>
                                    <span className="flex items-center gap-2"><Calendar size={14} className="text-[#B76E79] opacity-50" /> {new Date(app.dateDepot).toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-slate-400 mb-1">Matching IA</span>
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                        <TrendingUp size={14} className="text-emerald-500" />
                                        <span className="text-emerald-600 font-black tracking-tighter">{app.scoreMatching}%</span>
                                    </div>
                                </div>
                                {app.candidate.anomalies?.length > 0 && (
                                    <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                                        <AlertTriangle size={14} />
                                        <span className="text-[10px] font-black uppercase">{app.candidate.anomalies.length} Alertes</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {app.status === 'Interviewed' ? (
                                    <button 
                                        onClick={() => { setActiveApp(app); setShowEvaluation(true); }}
                                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <CheckCircle2 size={16} className="text-[#B76E79]" /> Évaluer l'entretien
                                    </button>
                                ) : (
                                    <button 
                                        className="bg-white border border-slate-100 text-slate-800 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all"
                                    >
                                        <FileText size={16} className="text-[#B76E79]" /> Voir Dossier
                                    </button>
                                )}
                                <button className="text-slate-300 hover:text-slate-600 p-2"><MoreVertical size={18}/></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Slide-over Evaluation Panel */}
            <AnimatePresence>
                {showEvaluation && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEvaluation(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#FDFCF0] shadow-2xl z-[120] flex flex-col border-l border-white"
                        >
                            <div className="p-8 lg:p-10 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h3 className="text-2xl font-serif font-black text-slate-900 tracking-tight">Évaluation Post-Entretien</h3>
                                        <p className="text-[#B76E79] text-[10px] font-black uppercase tracking-widest italic mt-1">Candidat : {activeApp?.candidate.user.nom}</p>
                                    </div>
                                    <button onClick={() => setShowEvaluation(false)} className="p-3 bg-white rounded-2xl shadow-sm text-slate-300 hover:text-slate-900 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-10 pr-2 custom-scrollbar">
                                    <section className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Impression Générale</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button 
                                                    key={star}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                    className="transition-transform active:scale-90"
                                                >
                                                    <Star 
                                                        size={32} 
                                                        className={`transition-colors ${
                                                            (hoverRating || rating) >= star 
                                                            ? 'fill-amber-400 text-amber-400' 
                                                            : 'text-slate-200'
                                                        }`} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Commentaires Décisifs</label>
                                        <textarea 
                                            rows={5}
                                            className="w-full bg-white border-2 border-slate-50 rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-[#B76E79]/10 focus:border-[#B76E79]/20 outline-none transition-all shadow-inner resize-none"
                                            placeholder="Quels sont les points clés qui motivent votre décision ?"
                                        ></textarea>
                                    </section>

                                    {activeApp?.candidate.anomalies?.length > 0 && (
                                        <section className="space-y-6">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 italic border-b border-rose-100 pb-3">
                                                <AlertTriangle size={14} /> Rappel Points de Vigilance IA
                                            </h4>
                                            <div className="bg-rose-50/30 border border-rose-100 rounded-3xl p-6 space-y-4">
                                                {activeApp.candidate.anomalies.map((alert, i) => (
                                                    <div key={i} className="flex gap-3 items-start">
                                                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 shrink-0" />
                                                        <p className="text-xs font-medium text-rose-700 italic">[{alert.type}] {alert.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="pt-8 mt-auto flex gap-4">
                                    <button 
                                        onClick={handleEvaluationSubmit}
                                        className="flex-1 bg-slate-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Enregistrer l'évaluation
                                    </button>
                                    <button 
                                        onClick={() => setShowEvaluation(false)}
                                        className="px-8 border-2 border-slate-100 rounded-3xl text-slate-400 font-bold text-xs hover:bg-white transition-colors"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecruiterInterviews;
