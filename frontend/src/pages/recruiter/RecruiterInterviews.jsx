import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
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
  RefreshCcw,
  Target,
  Cpu,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const RecruiterInterviews = () => {
    const { t } = useTranslation();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [activeApp, setActiveApp] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isGeneratingKit, setIsGeneratingKit] = useState(false);
    const [generatedKit, setGeneratedKit] = useState(null);

    // Filters State
    const [statusFilter, setStatusFilter] = useState('');
    const [scoreRange, setScoreRange] = useState({ min: 0, max: 100 });
    const [sortBy, setSortBy] = useState('score');
    const [search, setSearch] = useState('');

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const jobsRes = await API.get(`/jobs`);
            if (jobsRes.data.length > 0) {
                const jobId = jobsRes.data[0]._id;
                const appsRes = await API.get(`/applications/job/${jobId}`);
                setApplications(appsRes.data.data || []);
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
            toast.error(t('recruiter_interviews.toast_rating_error'));
            return;
        }

        try {
            toast.success(t('recruiter_interviews.toast_eval_success', { name: activeApp.candidate.user.nom }), {
                icon: '🌟',
                style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
            setShowEvaluation(false);
            setRating(0);
        } catch (error) {
            toast.error(t('recruiter_interviews.toast_eval_error'));
        }
    };

    const handleGenerateKit = async () => {
        if (!activeApp) return;
        setIsGeneratingKit(true);
        try {
            const res = await API.post(`/kits/generate/direct`, {
                candidateId: activeApp.candidate._id,
                jobId: activeApp.job._id
            });
            
            if (res.data.success) {
                setGeneratedKit(res.data.data);
                toast.success(t('recruiter_interviews.toast_kit_success'));
            }
        } catch (error) {
            toast.error(t('recruiter_interviews.toast_kit_error'));
            console.error(error);
        } finally {
            setIsGeneratingKit(false);
        }
    };

    const handleExportPDF = () => {
        const element = document.getElementById('interview-kit-content');
        if (!element) return;
        
        const opt = {
            margin:       15,
            filename:     `InterviewKit_${activeApp.candidate.user.nom.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#FAF6F0' },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().from(element).set(opt).save();
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Interviewed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Reviewed': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const filteredApps = applications.filter(app => 
        app.candidate.user?.nom?.toLowerCase().includes(search.toLowerCase()) ||
        app.job?.titre?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-10 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/20 mb-3"
                    >
                        <Target size={12} /> {t('recruiter_interviews.strategic_tracking')}
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">{t('recruiter_interviews.talent_pipeline').split(' ')[0]} <span className="text-slate-500 italic">{t('recruiter_interviews.talent_pipeline').split(' ').slice(1).join(' ')}</span></h1>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => { setStatusFilter(''); setScoreRange({min:0, max:100}); setSortBy('score'); setSearch(''); }}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-blue-400 transition-all shadow-xl backdrop-blur-md"
                    >
                        <RefreshCcw size={20} />
                    </button>
                    <button 
                        onClick={() => toast(t('recruiter_interviews.new_protocol_toast'), { icon: "🚀", style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } })}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-blue-600/20"
                    >
                        <Plus size={18} /> {t('recruiter_interviews.new_protocol')}
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col xl:flex-row items-center gap-6">
                <div className="flex-1 w-full relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder={t('recruiter_interviews.search_placeholder')} 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-sm font-medium text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-inner"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('recruiter_interviews.status')}</span>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-bold text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <option value="" className="bg-slate-900">{t('recruiter_interviews.all_nodes')}</option>
                            <option value="Pending" className="bg-slate-900">{t('recruiter_interviews.pending')}</option>
                            <option value="Reviewed" className="bg-slate-900">{t('recruiter_interviews.reviewed')}</option>
                            <option value="Interviewed" className="bg-slate-900">{t('recruiter_interviews.interview')}</option>
                            <option value="Accepted" className="bg-slate-900">{t('recruiter_interviews.accepted')}</option>
                            <option value="Rejected" className="bg-slate-900">{t('recruiter_interviews.rejected')}</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('recruiter_interviews.sort_by')}</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-bold text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <option value="score" className="bg-slate-900">{t('recruiter_interviews.quantum_score')}</option>
                            <option value="date" className="bg-slate-900">{t('recruiter_interviews.date_logged')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                        {loading ? t('recruiter_interviews.analyzing_streams') : t('recruiter_interviews.threads_identified', { count: filteredApps.length })}
                    </h3>
                    <div className="flex gap-2">
                        <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {t('recruiter_interviews.live_telemetry')}
                        </span>
                    </div>
                </div>
                
                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-6">
                            <Loader2 size={48} className="text-blue-500 animate-spin" />
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest italic">{t('recruiter_interviews.filtering_metadata')}</p>
                        </div>
                    ) : filteredApps.length === 0 ? (
                        <div className="p-24 text-center space-y-6">
                            <Filter size={48} className="mx-auto text-slate-800" />
                            <p className="text-slate-500 font-medium italic">{t('recruiter_interviews.no_matches')}</p>
                        </div>
                    ) : filteredApps.map((app, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={app._id} 
                            className="p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-10 hover:bg-white/[0.02] transition-all group relative"
                        >
                            <div className="absolute inset-0 bg-blue-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center font-black text-blue-400 shadow-2xl group-hover:scale-110 transition-transform duration-700 shrink-0">
                                   {app.candidate.user?.nom?.[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">{app.candidate.user?.nom}</h4>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] italic mt-1">{app.job.titre}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-10 text-[11px] font-bold text-slate-400 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-slate-600 mb-1 tracking-widest">{t('recruiter_interviews.logged')}</span>
                                    <span className="flex items-center gap-2 text-white"><Calendar size={14} className="text-blue-500/50" /> {new Date(app.dateDepot).toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-slate-600 mb-1 tracking-widest">{t('recruiter_interviews.quantum_match')}</span>
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner">
                                        <TrendingUp size={14} className="text-emerald-500" />
                                        <span className="text-emerald-400 font-black tracking-tighter">{app.scoreMatching}%</span>
                                    </div>
                                </div>
                                {app.candidate.anomalies?.length > 0 && (
                                    <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                                        <AlertTriangle size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('recruiter_interviews.critical_anomaly', { count: app.candidate.anomalies.length })}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                {app.status === 'Interviewed' ? (
                                    <button 
                                        onClick={() => { setActiveApp(app); setGeneratedKit(null); setShowEvaluation(true); }}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <CheckCircle2 size={18} className="text-white" /> {t('recruiter_interviews.evaluate_exchange')}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            if(app.cvUrl) {
                                                window.open(app.cvUrl, '_blank');
                                            } else {
                                                toast(t('recruiter_interviews.toast_pdf_error'), { icon: "🔒", style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
                                            }
                                        }}
                                        className="bg-white/5 border border-white/10 text-slate-300 px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all shadow-xl"
                                    >
                                        <FileText size={18} className="text-blue-400/50" /> {t('recruiter_interviews.view_payload')}
                                    </button>
                                )}
                                <button 
                                    onClick={() => toast("Menu des options du candidat ouvert.", { icon: "⚙️", style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } })}
                                    className="text-slate-600 hover:text-white p-2 transition-colors"
                                ><MoreVertical size={20}/></button>
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
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[110]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-900 border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] z-[120] flex flex-col"
                        >
                            <div className="p-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <h3 className="text-3xl font-bold text-white tracking-tight">{t('recruiter_interviews.post_exchange_analysis')}</h3>
                                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">{t('recruiter_interviews.node')} : {activeApp?.candidate.user.nom}</p>
                                    </div>
                                    <button onClick={() => setShowEvaluation(false)} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-12 pr-4 custom-scrollbar">
                                    <section className="space-y-6">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 block ml-1">{t('recruiter_interviews.general_core_sentiment')}</label>
                                        <div className="flex gap-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button 
                                                    key={star}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                    className="transition-all transform active:scale-75"
                                                >
                                                    <Star 
                                                        size={36} 
                                                        className={`transition-all ${
                                                            (hoverRating || rating) >= star 
                                                            ? 'fill-blue-500 text-blue-500 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                                                            : 'text-slate-800'
                                                        }`} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-6">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 block ml-1">{t('recruiter_interviews.strategic_insights')}</label>
                                        <textarea 
                                            rows={5}
                                            className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-8 text-sm font-medium text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 outline-none transition-all shadow-inner placeholder-slate-700 resize-none"
                                            placeholder={t('recruiter_interviews.placeholder_insights')}
                                        ></textarea>
                                    </section>

                                    {activeApp?.candidate.anomalies?.length > 0 && (
                                        <section className="space-y-6">
                                            <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 italic border-b border-white/5 pb-4">
                                                <AlertTriangle size={16} /> {t('recruiter_interviews.neural_vigilance')}
                                            </h4>
                                            <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-8 space-y-5 backdrop-blur-xl">
                                                {activeApp.candidate.anomalies.map((alert, i) => (
                                                    <div key={i} className="flex gap-4 items-start">
                                                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 shrink-0 shadow-[0_0_10px_#f43f5e]" />
                                                        <p className="text-xs font-medium text-rose-200/70 italic leading-relaxed">[{alert.type}] {alert.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    <section className="space-y-8 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 italic">
                                                <BrainCircuit size={16} /> {t('recruiter_interviews.quantum_assistant')}
                                            </h4>
                                            {!generatedKit && (
                                                <button 
                                                    onClick={handleGenerateKit}
                                                    disabled={isGeneratingKit}
                                                    className="px-5 py-2.5 bg-blue-500/10 text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all flex items-center gap-3 disabled:opacity-50 shadow-2xl"
                                                >
                                                    {isGeneratingKit ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                                    {isGeneratingKit ? t('recruiter_interviews.generating') : t('recruiter_interviews.sync_ai_kit')}
                                                </button>
                                            )}
                                        </div>

                                        {generatedKit && (
                                            <div className="space-y-4">
                                                <button 
                                                    onClick={handleExportPDF}
                                                    className="w-full bg-slate-800 text-slate-300 py-4 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-700 transition-all shadow-xl flex items-center justify-center gap-2 border border-slate-700"
                                                >
                                                    <Download size={16} /> {t('recruiter_interviews.export_pdf')}
                                                </button>
                                                <div id="interview-kit-content" style={{
                                                    backgroundColor: '#FAF6F0',
                                                    border: '2px solid #B76E79',
                                                    borderRadius: '40px',
                                                    padding: '32px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '32px',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                                }}>
                                                    
                                                    <div style={{ position: 'relative', zIndex: 10 }}>
                                                        <h2 style={{
                                                            fontSize: '20px',
                                                            fontWeight: 'bold',
                                                            color: '#1e293b',
                                                            marginBottom: '24px',
                                                            borderBottom: '1px solid #B76E79',
                                                            paddingBottom: '16px'
                                                        }}>
                                                            {t('recruiter_interviews.kit_title', { name: activeApp?.candidate?.user?.nom || 'Candidat' })}
                                                        </h2>
                                                        <p style={{
                                                            fontSize: '10px',
                                                            fontWeight: '900',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.1em',
                                                            color: '#B76E79',
                                                            marginBottom: '12px'
                                                        }}>
                                                            {t('recruiter_interviews.kit_context_summary')}
                                                        </p>
                                                        <p style={{
                                                            fontSize: '14px',
                                                            fontWeight: '500',
                                                            color: '#334155',
                                                            fontStyle: 'italic',
                                                            lineHeight: '1.6'
                                                        }}>
                                                            "{generatedKit.resumeIA || t('recruiter_scoring.no_applications')}"
                                                        </p>
                                                    </div>
                                                    
                                                    <div style={{ position: 'relative', zIndex: 10 }}>
                                                        <p style={{
                                                            fontSize: '10px',
                                                            fontWeight: '900',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.1em',
                                                            color: '#B76E79',
                                                            marginBottom: '16px'
                                                        }}>
                                                            {t('recruiter_interviews.kit_probing_vectors')}
                                                        </p>
                                                        <ul style={{
                                                            listStyleType: 'none',
                                                            padding: 0,
                                                            margin: 0,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '16px'
                                                        }}>
                                                            {(generatedKit.questionsTechniques || []).length > 0 ? (
                                                                (generatedKit.questionsTechniques || []).map((q, idx) => (
                                                                    <li key={idx} style={{
                                                                        display: 'flex',
                                                                        gap: '16px',
                                                                        alignItems: 'flex-start'
                                                                    }}>
                                                                        <span style={{
                                                                            color: '#B76E79',
                                                                            fontWeight: '900',
                                                                            marginTop: '4px',
                                                                            fontSize: '12px'
                                                                        }}>
                                                                            V{idx + 1}
                                                                        </span>
                                                                        <span style={{
                                                                            fontSize: '14px',
                                                                            fontWeight: 'bold',
                                                                            color: '#334155',
                                                                            lineHeight: '1.4'
                                                                        }}>
                                                                            {q}
                                                                        </span>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li style={{
                                                                    fontSize: '14px',
                                                                    color: '#64748b',
                                                                    fontStyle: 'italic'
                                                                }}>
                                                                    {t('recruiter_interviews.kit_no_questions')}
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>

                                                    {generatedKit.pointsVigilance && generatedKit.pointsVigilance.length > 0 && (
                                                        <div style={{ position: 'relative', zIndex: 10 }}>
                                                            <p style={{
                                                                fontSize: '10px',
                                                                fontWeight: '900',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.1em',
                                                                color: '#B76E79',
                                                                marginBottom: '16px'
                                                            }}>
                                                                {t('recruiter_interviews.kit_high_risk')}
                                                            </p>
                                                            <ul style={{
                                                                listStyleType: 'none',
                                                                padding: 0,
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '12px'
                                                            }}>
                                                                {generatedKit.pointsVigilance.map((p, idx) => (
                                                                    <li key={idx} style={{
                                                                        display: 'flex',
                                                                        gap: '12px',
                                                                        alignItems: 'flex-start',
                                                                        fontSize: '12px',
                                                                        fontWeight: '500',
                                                                        color: '#8C1D1D',
                                                                        backgroundColor: '#FFF0F0',
                                                                        border: '1px solid #F87171',
                                                                        padding: '16px',
                                                                        borderRadius: '16px'
                                                                    }}>
                                                                        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#EF4444' }} />
                                                                        <span>{p}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                </div>

                                <div className="pt-10 mt-auto flex gap-5">
                                    <button 
                                        onClick={handleEvaluationSubmit}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        {t('recruiter_interviews.log_final_sentiment')}
                                    </button>
                                    <button 
                                        onClick={() => setShowEvaluation(false)}
                                        className="px-10 border border-white/10 rounded-[1.5rem] text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all backdrop-blur-md"
                                    >
                                        {t('recruiter_interviews.abort')}
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
