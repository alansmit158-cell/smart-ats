import React, { useState, useEffect, useContext } from 'react';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  Clock3, 
  AlertCircle,
  FileText,
  Bookmark,
  Loader2,
  ChevronRight,
  Target,
  Zap,
  ArrowUpRight,
  Cpu
} from 'lucide-react';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';

const CandidatePortal = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [search, setSearch] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasCV, setHasCV] = useState(false);
    const [myApplications, setMyApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch All Jobs
                const jobsRes = await API.get(`/jobs`);
                setJobs(jobsRes.data);

                // Check if candidate has CV
                const candidateRes = await API.get(`/candidates/me`).catch(() => null);
                setHasCV(!!candidateRes?.data?.data);

                // Fetch My Applications
                const appsRes = await API.get(`/applications/my-applications`);
                setMyApplications(appsRes.data.data || []);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching portal data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApply = async (jobId) => {
        if (!hasCV) {
            toast.error(t('candidate_portal.toast_cv_error'), {
                duration: 4000,
                icon: '📄',
                style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
            setTimeout(() => navigate('/candidate/upload'), 1500);
            return;
        }

        try {
            const res = await API.post(`/applications/apply/${jobId}`, {});
            if (res.data.success) {
                toast.success(res.data.message, { icon: '🚀' });
                setMyApplications([...myApplications, res.data.data]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || t('candidate_portal.toast_apply_error'));
        }
    };

    const isApplied = (jobId) => {
        return myApplications.some(app => (app.job._id || app.job) === jobId);
    };

    const filteredJobs = jobs.filter(job => 
        job.titre.toLowerCase().includes(search.toLowerCase()) ||
        job.lieu.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] italic">{t('candidate_portal.loading')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Header / Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[3.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white/5 backdrop-blur-3xl p-10 lg:p-14 rounded-[3.5rem] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full"></div>
                    
                    <div className="max-w-2xl text-center md:text-left relative z-10">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                            <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-500/20 shadow-lg shadow-blue-500/5"
                            >
                                {t('candidate_portal.badge')}
                            </motion.span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
                            {t('candidate_portal.hero_title')} <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic font-medium">{t('candidate_portal.hero_italic')}</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium italic">
                            {hasCV 
                                ? t('candidate_portal.desc_indexed') 
                                : t('candidate_portal.desc_missing')}
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-5 w-full md:w-auto relative z-10">
                        {!hasCV && (
                            <button 
                                onClick={() => navigate('/candidate/upload')}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-3"
                            >
                                <FileText size={18} /> {t('candidate_portal.init_cv_btn')}
                            </button>
                        )}
                        <button 
                            onClick={() => document.getElementById('explorer').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest shadow-2xl backdrop-blur-md"
                        >
                            {t('candidate_portal.explore_btn')}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: t('candidate_portal.stat_postulations'), value: myApplications.length, icon: <FileText size={24} className="text-blue-400" />, color: 'bg-blue-400/10 border-blue-400/20' },
                    { label: t('candidate_portal.stat_protocols'), value: myApplications.filter(a => a.status === 'Interviewed').length, icon: <Target size={24} className="text-rose-400" />, color: 'bg-rose-400/10 border-rose-400/20' },
                    { label: t('candidate_portal.stat_opportunities'), value: jobs.length, icon: <Sparkles size={24} className="text-emerald-400" />, color: 'bg-emerald-400/10 border-emerald-400/20' },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-6 hover:translate-y-[-6px] hover:border-blue-500/30 transition-all duration-500 group"
                    >
                        <div className={`${stat.color} p-5 rounded-2xl border shadow-xl group-hover:scale-110 transition-transform duration-500`}>{stat.icon}</div>
                        <div>
                            <p className="text-3xl font-bold text-white tracking-tighter">{stat.value}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic mt-1">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10" id="explorer">
                {/* Job Explorer Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                            <Zap size={16} className="text-blue-500" /> {t('candidate_portal.active_infra')}
                        </h2>
                        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-blue-300 transition-colors group">
                            {t('candidate_portal.semantic_feed')} <TrendingUp size={14} className="group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
                        </div>
                    </div>

                    {/* Search Bar Plugin */}
                    <div className="bg-white/5 backdrop-blur-3xl p-2 rounded-3xl border border-white/10 flex items-center shadow-2xl group focus-within:border-blue-500/30 transition-all">
                        <div className="p-4 text-slate-500 group-focus-within:text-blue-400 transition-colors"><Search size={22}/></div>
                        <input 
                            type="text" 
                            placeholder={t('candidate_portal.search_placeholder')} 
                            className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-white placeholder-slate-700 focus:ring-0 pl-1 py-4"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl backdrop-blur-md">{t('candidate_portal.filters_btn')}</button>
                    </div>

                    <div className="space-y-6">
                        {filteredJobs.length === 0 ? (
                            <div className="bg-white/5 p-20 rounded-[3.5rem] border border-dashed border-white/10 text-center backdrop-blur-md">
                                <Search size={48} className="mx-auto text-slate-800 mb-6" />
                                <p className="text-slate-500 font-medium italic">{t('candidate_portal.no_nodes')}</p>
                            </div>
                        ) : filteredJobs.map((job, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={job._id} 
                                className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl hover:border-blue-500/20 hover:bg-white/[0.08] transition-all duration-700 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6">
                                    <button className="text-slate-700 hover:text-rose-400 transition-all hover:scale-125"><Bookmark size={22}/></button>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-700 border border-white/10 shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                                        <Briefcase size={26} className="text-blue-500 relative z-10" />
                                    </div>
                                    <div className="flex-1 space-y-4 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight leading-tight">{job.titre}</h3>
                                            {hasCV && (
                                                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/5 uppercase tracking-widest self-center md:self-auto">
                                                    <Cpu size={10} /> {t('candidate_portal.high_affinity')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5"><MapPin size={14} className="text-blue-400/50" /> {job.lieu}</span>
                                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-blue-400">{job.salaire}</span>
                                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5"><Clock size={14} className="text-slate-700" /> {t('candidate_portal.active_track')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center shrink-0 w-full md:w-auto">
                                        {isApplied(job._id) ? (
                                            <button disabled className="w-full md:w-auto bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/5">
                                                <CheckCircle size={16} /> {t('candidate_portal.synchronized')}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleApply(job._id)}
                                                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:from-blue-500 hover:to-indigo-500 transition-all shadow-2xl shadow-blue-600/20 active:scale-90"
                                            >
                                                {t('candidate_portal.init_protocol')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Panel / Activity & News */}
                <div className="space-y-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 px-2">{t('candidate_portal.neural_insights')}</h2>
                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[40px] rounded-full"></div>
                        
                        <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 relative group overflow-hidden shadow-2xl">
                            <Sparkles className="absolute -right-6 -top-6 w-24 h-24 text-blue-600/5 group-hover:scale-125 transition-transform duration-[3s]" />
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3 tracking-tight">
                               <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> {t('candidate_portal.career_agent_title')}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium italic border-l-2 border-blue-500/30 pl-5">
                                {hasCV 
                                    ? t('candidate_portal.agent_desc_indexed')
                                    : t('candidate_portal.agent_desc_missing')}
                            </p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 border-b border-white/5 pb-3">{t('candidate_portal.stream_updates')}</h4>
                            <div className="flex gap-5 items-start">
                                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white tracking-tight">{t('candidate_portal.market_expansion')}</p>
                                    <p className="text-xs text-slate-500 font-medium">{t('candidate_portal.market_desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 shrink-0 shadow-lg">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white tracking-tight">{t('candidate_portal.neural_tip')}</p>
                                    <p className="text-xs text-slate-500 font-medium">{t('candidate_portal.neural_tip_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidatePortal;
