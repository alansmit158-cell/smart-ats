import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  FileText, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  BrainCircuit,
  Award,
  ShieldCheck,
  Target,
  AlertTriangle,
  Loader2,
  Info,
  ChevronLeft,
  Zap
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const RecruiterScoring = () => {
    const [applications, setApplications] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAnomalies, setShowAnomalies] = useState(false);
    const [analyzingAnomalies, setAnalyzingAnomalies] = useState(false);

    // Pour la démo, on utilise un ID d'offre fictif ou le premier trouvé
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // On récupère d'abord les jobs pour en choisir un
                const jobsRes = await axios.get('http://localhost:5000/api/jobs', config);
                if (jobsRes.data.length > 0) {
                    const jobId = jobsRes.data[0]._id;
                    const appsRes = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, config);
                    setApplications(appsRes.data.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching scoring data:", error);
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const selectedApp = applications.find(a => a._id === selectedId);

    const handleDetectAnomalies = async () => {
        if (!selectedApp) return;
        
        setAnalyzingAnomalies(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const res = await axios.post(`http://localhost:5000/api/candidates/${selectedApp.candidate._id}/detect-anomalies`, {}, config);
            
            if (res.data.success) {
                // Update local state
                setApplications(prev => prev.map(app => 
                    app._id === selectedId 
                    ? { ...app, candidate: { ...app.candidate, ...res.data.data } }
                    : app
                ));
                toast.success("Analyse des anomalies terminée");
                setShowAnomalies(true);
            }
        } catch (error) {
            toast.error("Erreur lors de l'analyse IA");
        } finally {
            setAnalyzingAnomalies(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
        if (score >= 60) return 'text-blue-500 bg-blue-50 border-blue-100';
        return 'text-amber-500 bg-amber-50 border-amber-100';
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="text-[#B76E79] animate-spin" />
                <p className="text-slate-400 font-medium italic">Calcul des scores sémantiques en cours...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10 relative">
            {/* Header / Context */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="w-10 h-10 bg-[#B76E79] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#B76E79]/20">
                            <BrainCircuit size={20} />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">Analyse Sémantique IA</h1>
                    </div>
                    <p className="text-slate-400 text-sm font-medium italic">Scoring en temps réel basé sur GPT-4o-mini.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-50 p-4 px-8 rounded-2xl border border-slate-100 text-center">
                        <p className="text-2xl font-black text-slate-800 tracking-tighter">{applications.length}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Candidats Matchés</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Candidates List Panel */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-serif font-bold text-slate-800">Classement Stratégique</h2>
                    </div>

                    <div className="space-y-3">
                        {applications.length === 0 ? (
                            <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center">
                                <Search size={48} className="mx-auto text-slate-100 mb-4" />
                                <p className="text-slate-400 font-medium italic">Aucune candidature à analyser pour le moment.</p>
                            </div>
                        ) : applications.map((app) => (
                            <div 
                                key={app._id} 
                                onClick={() => setSelectedId(app._id)}
                                className={`group bg-white p-6 rounded-[2.5rem] border transition-all duration-500 cursor-pointer flex items-center justify-between
                                    ${selectedId === app._id ? 'border-[#B76E79] ring-4 ring-[#B76E79]/5 scale-[1.02] shadow-xl' : 'border-slate-50 hover:border-[#B76E79]/30 shadow-sm'}
                                `}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-serif font-black text-[#B76E79] shadow-inner">
                                        {app.candidate.user?.nom?.substring(0, 2).toUpperCase() || '??'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-base">{app.candidate.user?.nom}</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic mt-0.5">{app.job.titre}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className={`hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-2xl border ${getScoreColor(app.scoreMatching)}`}>
                                        <span className="text-lg font-black tracking-tighter">{app.scoreMatching}%</span>
                                        <span className="text-[7px] font-black uppercase tracking-tighter">Score IA</span>
                                    </div>
                                    <ChevronRight size={20} className={`transition-transform duration-500 ${selectedId === app._id ? 'translate-x-2 text-[#B76E79]' : 'text-slate-200 group-hover:text-slate-400'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Detail Analysis Side Panel */}
                <div className="space-y-6">
                    <h2 className="text-lg font-serif font-bold text-slate-800 px-2">Focus IA : Sélectionné</h2>
                    {selectedApp ? (
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-xl space-y-8">
                           <div className="text-center space-y-2">
                               <div className="w-20 h-20 bg-gradient-to-br from-[#B76E79] to-[#E5C4A7] rounded-3xl mx-auto flex items-center justify-center text-white text-2xl font-serif font-black shadow-xl shadow-[#B76E79]/20">
                                   {selectedApp.candidate.user?.nom?.[0]}
                               </div>
                               <h3 className="text-xl font-serif font-bold text-slate-900 pt-2">{selectedApp.candidate.user?.nom}</h3>
                               <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getScoreColor(selectedApp.scoreMatching)}`}>
                                   Match {selectedApp.scoreMatching > 80 ? 'Exceptionnel' : selectedApp.scoreMatching > 60 ? 'Favorable' : 'Modéré'}
                               </span>
                           </div>

                           <div className="space-y-4">
                                <button 
                                    onClick={handleDetectAnomalies}
                                    disabled={analyzingAnomalies}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-[#B76E79] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                                >
                                    {analyzingAnomalies ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                    {selectedApp.candidate.anomalies?.length > 0 ? "Re-détecter les anomalies" : "Détecter les anomalies CV"}
                                </button>

                                {selectedApp.candidate.anomalies?.length > 0 && (
                                    <button 
                                        onClick={() => setShowAnomalies(true)}
                                        className="w-full flex items-center justify-center gap-2 bg-[#B76E79]/10 text-[#B76E79] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#B76E79] hover:text-white transition-all"
                                    >
                                        <AlertTriangle size={16} /> Voir les {selectedApp.candidate.anomalies.length} alertes
                                    </button>
                                )}
                           </div>

                           <div className="bg-[#FDFCF0] p-6 rounded-[2rem] border border-[#B76E79]/10 relative overflow-hidden group">
                                <Sparkles className="absolute -right-2 -top-2 w-16 h-16 text-[#B76E79]/5 group-hover:scale-125 transition-transform duration-[2s]" />
                                <h4 className="flex items-center gap-2 text-xs font-serif font-black mb-2 text-slate-800">
                                    <Award size={14} className="text-[#B76E79]" /> Analyse Prédictive
                                </h4>
                                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                                    {selectedApp.scoreMatching > 80 
                                        ? "Le profil présente une corrélation sémantique forte avec les prérequis techniques de l'offre."
                                        : "Certaines compétences clés manquent à l'appel, un entretien technique est recommandé pour valider le potentiel."}
                                </p>
                           </div>
                        </div>
                    ) : (
                        <div className="h-64 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-40">
                            <BrainCircuit size={48} className="text-slate-200" />
                            <p className="text-xs font-bold text-slate-400 italic">Sélectionnez un talent pour lancer l'analyse prédictive.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Anomalies Slide-over Panel */}
            <AnimatePresence>
                {showAnomalies && selectedApp && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAnomalies(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-white z-[70] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setShowAnomalies(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div>
                                        <h2 className="text-xl font-serif font-bold text-slate-900">Anomalies Détectées</h2>
                                        <p className="text-xs text-slate-400 font-medium">Fiabilité du profil : <span className={selectedApp.candidate.scoreFiabilite > 70 ? 'text-emerald-500' : 'text-rose-500'}>{selectedApp.candidate.scoreFiabilite}%</span></p>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                        <Info size={14} /> Résumé de l'analyse IA
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed italic">
                                        "{selectedApp.candidate.resumeAnomalies}"
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {selectedApp.candidate.anomalies.map((ano, i) => (
                                        <div key={i} className="p-6 rounded-[2rem] border border-slate-50 bg-white shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                                    ano.severite === 'elevee' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    ano.severite === 'moyenne' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    Sévérité {ano.severite}
                                                </span>
                                                <Zap size={14} className={ano.severite === 'elevee' ? 'text-rose-500' : 'text-slate-200'} />
                                            </div>
                                            <h5 className="font-bold text-slate-800 mb-1">{ano.type.replace('_', ' ').toUpperCase()}</h5>
                                            <p className="text-xs text-slate-500 mb-4">{ano.description}</p>
                                            
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-[9px] font-black text-[#B76E79] uppercase tracking-widest mb-1">Recommandation Recruteur</p>
                                                <p className="text-xs text-slate-600 font-medium italic">"{ano.recommandation}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100">
                                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors">
                                    Ajouter au Kit d'Entretien
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecruiterScoring;
