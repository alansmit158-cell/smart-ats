import React, { useState, useEffect, useContext } from 'react';
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
  ChevronRight,
  Cpu,
  Loader2,
  Zap,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../api/axiosConfig';
import AuthContext from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const RecruiterDashboard = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    const getStageLabel = (stage) => {
        switch (stage) {
            case 'Neural Screening': return t('recruiter_dashboard.stage_screening');
            case 'Protocol Exchange': return t('recruiter_dashboard.stage_protocol');
            case 'Final Deployment': return t('recruiter_dashboard.stage_deployment');
            case 'Rejected Nodes': return t('recruiter_dashboard.stage_rejected');
            default: return stage;
        }
    };

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/dashboard/stats');
                setStats(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const dashboardCards = [
        { label: t('recruiter_dashboard.talent_pool'), value: stats?.totalCandidates || 0, icon: <Users size={22} />, change: '+12%', color: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/20' },
        { label: t('recruiter_dashboard.active_specs'), value: stats?.totalJobs || 0, icon: <Briefcase size={22} />, change: '+2', color: 'from-rose-600 to-pink-600', shadow: 'shadow-rose-500/20' },
        { label: t('recruiter_dashboard.sync_interviews'), value: stats?.interviewsScheduled || 0, icon: <Activity size={22} />, change: '+5%', color: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-500/20' },
    ];

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] italic">{t('recruiter_dashboard.loading')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Context Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-12 gap-8">
                <div className="space-y-3">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/20 mb-2"
                    >
                        <Cpu size={12} /> {t('recruiter_dashboard.neural_core_online')}
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-white tracking-tight flex items-center flex-wrap gap-2"
                    >
                        {t('recruiter_dashboard.welcome', { name: '###' }).split('###')[0]}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic font-medium">
                            {user?.nom || 'Strategist'}
                        </span>
                        {t('recruiter_dashboard.welcome', { name: '###' }).split('###')[1]}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-500 text-lg font-medium italic"
                    >
                        {t('recruiter_dashboard.synthesized_matchings_part1')}{' '}
                        <span className="text-blue-400 font-bold">
                            {stats?.totalCandidates || 12} {t('recruiter_dashboard.synthesized_matchings_part2')}
                        </span>
                    </motion.p>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-5 bg-white/5 p-3 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md pr-10 group"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                        <Target size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase italic">{t('recruiter_dashboard.quarterly_quota')}</p>
                        <p className="text-lg font-bold text-white tracking-tight">{t('recruiter_dashboard.synchronized_status', { percent: 84 })}</p>
                    </div>
                </motion.div>
            </div>

            {/* Premium Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {dashboardCards.map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl group hover:border-blue-500/30 transition-all duration-700 relative overflow-hidden flex flex-col h-full"
                    >
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/5 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-[2s]"></div>
                        
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-2xl ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
                                {stat.icon}
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-lg">
                                {stat.change} <ArrowUpRight size={14} />
                            </div>
                        </div>
                        
                        <div className="mt-auto relative z-10">
                            <p className="text-5xl font-bold text-white mb-2 tracking-tighter">{stat.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic font-bold">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Pipeline / Kanban Visualization */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4">
                            <Activity className="text-blue-500" /> {t('recruiter_dashboard.pipeline_sync')}
                        </h3>
                        <Sparkles size={20} className="text-blue-400 animate-pulse" />
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                        {[
                            { stage: 'Neural Screening', count: 156, color: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/20' },
                            { stage: 'Protocol Exchange', count: 24, color: 'from-slate-700 to-slate-900', shadow: 'shadow-slate-500/10' },
                            { stage: 'Final Deployment', count: 12, color: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-500/20' },
                            { stage: 'Rejected Nodes', count: 89, color: 'from-rose-600 to-pink-600', shadow: 'shadow-rose-500/20' },
                        ].map((item, i) => (
                            <div key={i} className="space-y-3 group">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic font-bold">{getStageLabel(item.stage)}</span>
                                    <span className="text-sm font-bold text-white tracking-tight">{t('recruiter_dashboard.nodes_count', { count: item.count })}</span>
                                </div>
                                <div className="h-5 w-full bg-white/5 rounded-2xl p-[3px] border border-white/5 shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(item.count / 156) * 100}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className={`h-full rounded-xl bg-gradient-to-r ${item.color} shadow-2xl ${item.shadow} group-hover:brightness-125 transition-all`}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6 relative z-10">
                         <button className="w-full py-5 bg-white/5 border border-white/10 rounded-[2rem] text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all shadow-xl backdrop-blur-md">{t('recruiter_dashboard.deep_analytics')}</button>
                    </div>
                </motion.div>

                {/* AI Activity Log / Messages Preview */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-950 p-12 rounded-[4rem] text-white space-y-10 relative overflow-hidden group border border-white/5 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
                       <Zap size={180} strokeWidth={4} />
                    </div>
                    
                    <h3 className="text-2xl font-bold relative flex items-center gap-4 tracking-tight">
                        <div className="w-2 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_#2563eb]"></div> {t('recruiter_dashboard.strategic_logs')}
                    </h3>
                    
                    <div className="space-y-10 relative z-10">
                        {stats?.upcomingInterviews?.length > 0 ? stats.upcomingInterviews.map((interview, idx) => (
                            <div key={idx} className="flex gap-8 items-start group/log cursor-pointer">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover/log:bg-blue-600 group-hover/log:text-white group-hover/log:scale-110 transition-all duration-500 shadow-2xl">
                                    <Clock size={20} />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 italic pb-1">{t('recruiter_dashboard.scheduled_for', { date: new Date(interview.date).toLocaleDateString() })}</p>
                                    <p className="text-lg font-bold text-white leading-tight group-hover/log:text-blue-400 transition-colors">{interview.jobTitle}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{t('recruiter_dashboard.protocol_exchange_part1')} <span className="text-slate-300 font-bold">{interview.candidateName}</span> {t('recruiter_dashboard.protocol_exchange_part2')}</p>
                                </div>
                                <ChevronRight size={24} className="text-slate-800 opacity-0 group-hover/log:opacity-100 group-hover/log:translate-x-3 transition-all mt-8" />
                            </div>
                        )) : (
                            <div className="flex gap-8 items-start group/log cursor-pointer">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shadow-2xl">
                                    <Zap size={20} />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 italic pb-1">{t('recruiter_dashboard.system_status')}</p>
                                    <p className="text-lg font-bold text-white leading-tight">{t('recruiter_dashboard.no_protocols')}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{t('recruiter_dashboard.idle_desc')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="pt-10 relative z-10">
                         <div className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('recruiter_dashboard.infrastructure_online')}</span>
                            </div>
                            <div className="flex -space-x-4">
                                {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-2xl border-4 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px] font-black text-blue-400 shadow-2xl">0{i}</div>)}
                            </div>
                         </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
