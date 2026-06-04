import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  Briefcase,
  Target
} from 'lucide-react';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CandidateApplications = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await API.get(`/applications/my-applications`);
                setApplications(res.data.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching applications:", error);
                toast.error(t('candidate_applications.toast_load_error'));
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Interviewed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
            case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
            case 'Reviewed': return 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]';
            case 'Accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
            case 'Rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Interviewed': return t('candidate_applications.status_interviewed');
            case 'Pending':     return t('candidate_applications.status_pending');
            case 'Reviewed':    return t('candidate_applications.status_reviewed');
            case 'Accepted':    return t('candidate_applications.status_accepted');
            case 'Rejected':    return t('candidate_applications.status_rejected');
            default: return status;
        }
    };

    const getStatusDesc = (status) => {
        switch (status) {
            case 'Pending':    return t('candidate_applications.status_pending_desc');
            case 'Reviewed':   return t('candidate_applications.status_reviewed_desc');
            case 'Interviewed':return t('candidate_applications.status_interviewed_desc');
            case 'Accepted':   return t('candidate_applications.status_accepted_desc');
            case 'Rejected':   return t('candidate_applications.status_rejected_desc');
            default: return '';
        }
    };

    const getStepInfo = (status) => {
        switch (status) {
            case 'Pending':     return { step: 1, total: 4 };
            case 'Reviewed':    return { step: 2, total: 4 };
            case 'Interviewed': return { step: 3, total: 4 };
            case 'Accepted':    return { step: 4, total: 4 };
            case 'Rejected':    return { step: 2, total: 4 };
            default:            return { step: 0, total: 4 };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Interviewed': return <Clock size={12} />;
            case 'Pending':     return <Calendar size={12} />;
            case 'Reviewed':    return <Sparkles size={12} />;
            case 'Accepted':    return <CheckCircle2 size={12} />;
            case 'Rejected':    return <XCircle size={12} />;
            default: return null;
        }
    };

    const filteredApps = applications.filter(app => 
        app.job?.titre?.toLowerCase().includes(search.toLowerCase()) ||
        app.job?.recruiter?.nom?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] italic">
                    {t('candidate_applications.loading')}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-400/20 mb-3"
                    >
                        <Target size={12} /> {t('candidate_applications.badge')}
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        {t('candidate_applications.title_part1')}{' '}
                        <span className="text-slate-500 italic">{t('candidate_applications.title_part2')}</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium italic">
                        {t('candidate_applications.subtitle')}
                    </p>
                </div>
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md">
                    <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                        {t('candidate_applications.tab_all')}
                    </button>
                    <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                        {t('candidate_applications.tab_interviews')}
                    </button>
                    <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                        {t('candidate_applications.tab_archived')}
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1 bg-white/5 p-2 rounded-2xl border border-white/10 flex items-center shadow-2xl backdrop-blur-xl group focus-within:border-blue-500/30 transition-all">
                    <div className="p-3 text-slate-500 group-focus-within:text-blue-400 transition-colors"><Search size={20}/></div>
                    <input 
                        type="text" 
                        placeholder={t('candidate_applications.search_placeholder')}
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-white placeholder-slate-600 focus:ring-0 pl-1 py-3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest shadow-xl hover:bg-white/10 transition-all backdrop-blur-md">
                    <Filter size={18} className="text-slate-400" /> {t('candidate_applications.advanced_filter')}
                </button>
            </div>

            {/* Applications List */}
            <div className="grid grid-cols-1 gap-8 pb-12">
                {filteredApps.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/5 p-24 rounded-[4rem] border border-dashed border-white/10 text-center backdrop-blur-md"
                    >
                        <Briefcase size={48} className="mx-auto text-slate-800 mb-6" />
                        <h3 className="text-2xl font-bold text-slate-600">{t('candidate_applications.no_streams_title')}</h3>
                        <p className="text-slate-500 text-sm italic mt-3">{t('candidate_applications.no_streams_desc')}</p>
                    </motion.div>
                ) : filteredApps.map((app, idx) => {
                    const stepInfo = getStepInfo(app.status);
                    return (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={app._id} 
                            className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-2xl hover:border-blue-500/20 transition-all duration-700 overflow-hidden group"
                        >
                            <div className="p-8 lg:p-12 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                                {/* Company & Position Info */}
                                <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-700 border border-white/10 shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                                        <Sparkles className="text-blue-500 relative z-10" size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight leading-tight">
                                            {app.job?.titre || 'Elite Position'}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 mt-2">
                                            <span className="text-sm font-bold text-slate-400 italic">{app.job?.recruiter?.nom || 'Smart Recruiter'}</span>
                                            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                                {t('candidate_applications.postulated')} {new Date(app.dateDepot).toLocaleDateString()}
                                            </span>
                                            {app.scoreMatching > 0 && (
                                                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                                    <Target size={10} className="text-emerald-500" />
                                                    <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                                                        {t('candidate_applications.match_label')} {app.scoreMatching}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status and Progress */}
                                <div className="flex-1 max-w-sm space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${getStatusStyle(app.status)}`}>
                                            {getStatusIcon(app.status)} {getStatusText(app.status)}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                            {t('candidate_applications.node_step', { step: stepInfo.step, total: stepInfo.total })}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner p-[1px]">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(stepInfo.step / stepInfo.total) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className={`h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] ${
                                                app.status === 'Rejected' ? 'bg-rose-500' : 
                                                app.status === 'Accepted' ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                                            }`}
                                        ></motion.div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4 border-t xl:border-t-0 pt-8 xl:pt-0 border-white/5">
                                    <button 
                                        onClick={() => {
                                            if (app.job?.recruiter?._id) {
                                                navigate('/candidate/messages', {
                                                    state: {
                                                        userId: app.job.recruiter._id,
                                                        userName: app.job.recruiter.nom
                                                    }
                                                });
                                            } else {
                                                toast.error(t('candidate_applications.contact_unavailable'));
                                            }
                                        }}
                                        className="p-5 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all duration-500 relative group/btn border border-white/5 shadow-xl"
                                    >
                                        <MessageCircle size={22} />
                                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity border border-white/10 whitespace-nowrap">
                                            {t('candidate_applications.open_channel')}
                                        </span>
                                    </button>
                                    <button className="bg-white/5 text-white px-10 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl transition-all hover:bg-white/10 hover:border-blue-500/30 border border-white/10 active:scale-95">
                                        {t('candidate_applications.monitor')} <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Status Update Banner */}
                            <div className="px-10 lg:px-12 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between backdrop-blur-md">
                                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${app.status === 'Pending' ? 'bg-amber-400 animate-pulse shadow-[0_0_10px_#fbbf24]' : 'bg-emerald-400 shadow-[0_0_10px_#34d399]'}`}></div>
                                    {t('candidate_applications.quantum_update')}
                                    <span className="text-slate-300 ml-2 font-medium italic normal-case">
                                        {getStatusDesc(app.status)}
                                    </span>
                                 </div>
                                 <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:text-blue-300 group">
                                    {t('candidate_applications.full_history')} <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
