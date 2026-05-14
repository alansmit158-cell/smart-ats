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
  Zap,
  Cpu
} from 'lucide-react';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const RecruiterScoring = () => {
    const [applications, setApplications] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAnomalies, setShowAnomalies] = useState(false);
    const [analyzingAnomalies, setAnalyzingAnomalies] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const jobsRes = await API.get(`/jobs`);
                if (jobsRes.data.length > 0) {
                    const jobId = jobsRes.data[0]._id;
                    const appsRes = await API.get(`/applications/job/${jobId}`);
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
            const res = await API.post(`/candidates/${selectedApp.candidate._id}/detect-anomalies`, {});
            
            if (res.data.success) {
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

    const handleUpdateStatus = async (status) => {
        if (!selectedApp) return;
        try {
            const res = await API.patch(`/applications/${selectedApp._id}/status`, { status });
            
            if (res.data.success) {
                setApplications(prev => prev.map(app => 
                    app._id === selectedApp._id 
                    ? { ...app, status }
                    : app
                ));
                toast.success(status === 'Rejected' ? "Candidature rejetée. Message automatique envoyé." : "Candidature acceptée pour entretien !");
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
        if (score >= 60) return 'text-blue-400 bg-blue-400/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
        return 'text-amber-400 bg-amber-400/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] italic">Initializing Semantic Neural Network...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Header / Context */}
            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                
                <div className="space-y-3 text-center md:text-left relative z-10">
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                            <BrainCircuit size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Semantic AI Scoring</h1>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Real-time analysis v5.0 • GPT-4o Enhanced</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="bg-white/5 p-4 px-8 rounded-2xl border border-white/10 text-center backdrop-blur-md shadow-xl">
                        <p className="text-3xl font-bold text-white tracking-tighter">{applications.length}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mt-1">Matched Nodes</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Candidates List Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Strategic Ranking</h2>
                    </div>

                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="bg-white/5 p-24 rounded-[4rem] border border-dashed border-white/10 text-center backdrop-blur-md">
                                <Search size={48} className="mx-auto text-slate-800 mb-6" />
                                <p className="text-slate-500 font-medium italic">No application data streams detected.</p>
                            </div>
                        ) : applications.map((app, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={app._id} 
                                onClick={() => setSelectedId(app._id)}
                                className={`group bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border transition-all duration-700 cursor-pointer flex items-center justify-between relative overflow-hidden
                                    ${selectedId === app._id ? 'border-blue-500/50 bg-white/[0.08] shadow-2xl scale-[1.02]' : 'border-white/5 hover:border-white/20 hover:bg-white/[0.03] shadow-xl'}
                                `}
                            >
                                <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center font-black text-blue-400 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                        {app.candidate.user?.nom?.substring(0, 2).toUpperCase() || '??'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg tracking-tight">{app.candidate.user?.nom}</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] italic mt-1">{app.job.titre}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 relative z-10">
                                    <div className={`hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-2xl border transition-all duration-700 ${getScoreColor(app.scoreMatching)}`}>
                                        <span className="text-lg font-bold tracking-tighter">{app.scoreMatching}%</span>
                                        <span className="text-[7px] font-black uppercase tracking-tighter">Match</span>
                                    </div>
                                    <ChevronRight size={24} className={`transition-all duration-700 ${selectedId === app._id ? 'translate-x-2 text-blue-400' : 'text-slate-700 group-hover:text-slate-400'}`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI Detail Analysis Side Panel */}
                <div className="space-y-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 px-4">Neural Focus</h2>
                    <AnimatePresence mode="wait">
                        {selectedApp ? (
                            <motion.div 
                                key={selectedApp._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full"></div>
                                
                                <div className="text-center space-y-4 relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/20 border border-white/10">
                                        {selectedApp.candidate.user?.nom?.[0]}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">{selectedApp.candidate.user?.nom}</h3>
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getScoreColor(selectedApp.scoreMatching)}`}>
                                            <Sparkles size={12} /> {selectedApp.scoreMatching > 80 ? 'Exceptional' : selectedApp.scoreMatching > 60 ? 'Optimal' : 'Moderate'} Node
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 relative z-10">
                                    <button 
                                        onClick={handleDetectAnomalies}
                                        disabled={analyzingAnomalies}
                                        className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:border-blue-500/30 transition-all shadow-2xl disabled:opacity-50 group"
                                    >
                                        {analyzingAnomalies ? <Loader2 size={18} className="animate-spin text-blue-400" /> : <ShieldCheck size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />}
                                        {selectedApp.candidate.anomalies?.length > 0 ? "Re-initialize Scan" : "Initialize CV Scan"}
                                    </button>

                                    {selectedApp.candidate.anomalies?.length > 0 && (
                                        <button 
                                            onClick={() => setShowAnomalies(true)}
                                            className="w-full flex items-center justify-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                                        >
                                            <AlertTriangle size={18} /> View {selectedApp.candidate.anomalies.length} Critical Alerts
                                        </button>
                                    )}
                                </div>

                                <div className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group backdrop-blur-md">
                                    <Cpu className="absolute -right-4 -top-4 w-20 h-20 text-blue-500/5 group-hover:scale-125 transition-transform duration-[3s]" />
                                    <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-4 text-blue-400 relative z-10">
                                        <Award size={16} /> Predictive Logic
                                    </h4>
                                    <p className="text-xs text-slate-400 italic leading-relaxed relative z-10">
                                        {selectedApp.scoreMatching > 80 
                                            ? "Quantum correlation detected. High-performance trajectory expected based on technical metadata."
                                            : "Partial node overlap detected. Manual verification recommended for high-risk nodes."}
                                    </p>
                                </div>

                                {/* Actions Recruteur */}
                                <div className="pt-8 border-t border-white/5 flex gap-4 relative z-10">
                                    <button 
                                        onClick={() => handleUpdateStatus('Rejected')}
                                        className="flex-1 bg-white/5 border border-white/10 text-slate-400 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all flex items-center justify-center gap-2 shadow-xl"
                                    >
                                        <XCircle size={18} /> Terminate
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus('Interviewed')}
                                        className="flex-[1.5] bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest hover:from-blue-500 hover:to-indigo-500 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <CheckCircle size={18} /> Initiate Exchange
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                className="h-[500px] border-2 border-dashed border-white/10 rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
                                    <BrainCircuit size={40} className="text-slate-800" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 italic">Select node for deep analysis.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-full md:w-[550px] bg-slate-900 border-l border-white/10 z-[70] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
                        >
                            <div className="p-10 border-b border-white/10 bg-slate-950/40 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button onClick={() => setShowAnomalies(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-slate-400">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">Security Scan</h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 italic">Fiability Index: <span className={selectedApp.candidate.scoreFiabilite > 70 ? 'text-emerald-400' : 'text-rose-400'}>{selectedApp.candidate.scoreFiabilite}%</span></p>
                                    </div>
                                </div>
                                <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 shadow-2xl">
                                    <ShieldCheck size={28} />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <div className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Info size={40} className="text-blue-400" />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-3">
                                        Neural Summary
                                    </h4>
                                    <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                                        "{selectedApp.candidate.resumeAnomalies}"
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {selectedApp.candidate.anomalies.map((ano, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={i} 
                                            className="p-8 rounded-[3rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative group"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-2xl ${
                                                    ano.severite === 'elevee' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                    ano.severite === 'moyenne' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                    Severity {ano.severite}
                                                </span>
                                                <Zap size={18} className={ano.severite === 'elevee' ? 'text-rose-500 animate-pulse' : 'text-slate-800'} />
                                            </div>
                                            <h5 className="text-lg font-bold text-white mb-2 tracking-tight">{ano.type.replace('_', ' ').toUpperCase()}</h5>
                                            <p className="text-sm text-slate-400 mb-6 font-medium">{ano.description}</p>
                                            
                                            <div className="p-6 bg-slate-950/60 rounded-[2rem] border border-white/5">
                                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <Target size={12} /> Strategic Recommendation
                                                </p>
                                                <p className="text-xs text-slate-300 font-medium italic">"{ano.recommandation}"</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-10 bg-slate-950/40 border-t border-white/10 backdrop-blur-3xl">
                                <button className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-2xl active:scale-95">
                                    Export to Interview Kit v5.0
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
