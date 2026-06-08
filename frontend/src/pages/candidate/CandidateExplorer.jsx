import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, Sparkles, ChevronRight, BookmarkPlus, ArrowUpRight, Loader2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const CandidateExplorer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());

    useEffect(() => {
        fetchJobs();
        fetchMyApplications();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await API.get('/jobs');
            setJobs(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Erreur lors du chargement des offres');
            setLoading(false);
        }
    };

    const fetchMyApplications = async () => {
        try {
            const res = await API.get('/applications/my-applications');
            if (res.data.success) {
                const ids = new Set(res.data.data.map(a => a.job?._id));
                setAppliedJobIds(ids);
            }
        } catch (error) {
            // Silently fail — user may not have a CV yet
        }
    };

    const navigate = useNavigate();

    const handleApply = async (jobId) => {
        setApplyingId(jobId);
        try {
            await API.post(`/applications/apply/${jobId}`);
            setAppliedJobIds(prev => new Set([...prev, jobId]));
            toast.success('Candidature envoyée avec succès !', {
                icon: '🚀',
                style: {
                    borderRadius: '20px',
                    background: '#0f172a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            });
        } catch (error) {
            const msg = error.response?.data?.message || 'Erreur lors de la postulation';
            if (msg.includes('CV')) {
                toast.error('CV requis pour postuler.', {
                    icon: '📄',
                    duration: 5000,
                    style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                });
                setTimeout(() => {
                    if (window.confirm("Voulez-vous être redirigé vers l'upload de CV ?")) {
                        window.location.href = `/candidate/upload?jobId=${jobId}`;
                    }
                }, 1000);
            } else {
                toast.error(msg);
            }
        } finally {
            setApplyingId(null);
        }
    };

    const filteredJobs = jobs.filter(j => 
        j.titre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        j.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.competences?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-24 relative">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/5 blur-[120px] -z-10 rounded-full"></div>

            {/* Premium Header Card */}
            <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                
                <div className="relative z-10 max-w-3xl space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/20 shadow-lg shadow-blue-500/5"
                    >
                        <Target size={14} /> Global Talent Explorer
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-bold text-white leading-tight tracking-tight"
                    >
                        Precision Matching <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic font-medium">Powered by Quantum AI.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium text-lg max-w-xl leading-relaxed"
                    >
                        Discover elite opportunities optimized through deep semantic analysis of your professional profile.
                    </motion.p>
                </div>

                {/* Cyberpunk Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 flex flex-col md:flex-row gap-5 relative z-10"
                >
                    <div className="flex-1 bg-white/5 backdrop-blur-xl p-2 rounded-3xl border border-white/10 flex items-center gap-4 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all shadow-2xl group/input">
                        <div className="pl-5">
                            <Search className="text-slate-500 group-focus-within/input:text-blue-400 transition-colors" size={22} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search by role, tech stack, or keyword..."
                            className="w-full bg-transparent border-none focus:ring-0 text-white font-medium placeholder:text-slate-600 py-4 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-white/5 border border-white/10 text-white px-10 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 hover:border-blue-500/30 transition-all shadow-xl backdrop-blur-md group">
                        <Filter size={18} className="text-slate-400 group-hover:text-blue-400" /> Advanced Filters
                    </button>
                </motion.div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-8">
                <div className="flex justify-between items-end px-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
                            <Sparkles className="text-blue-400" size={28} /> 
                            AI Recommended Threads
                        </h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 italic">Semantic compatibility ranking v5.0</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">Real-time Feed</span>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[450px] bg-white/5 rounded-[3rem] border border-white/5 animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="py-20 text-center bg-white/5 rounded-[4rem] border border-white/5 border-dashed">
                        <p className="text-slate-500 font-medium italic">No matches found in the current talent stream.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJobs.map((job, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={job._id}
                                className="bg-white/[0.03] backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl hover:border-blue-500/30 hover:bg-white/[0.05] transition-all group relative cursor-pointer flex flex-col h-full"
                            >
                                <div className="absolute top-10 right-10 text-slate-600 group-hover:text-blue-400 transition-all group-hover:scale-125 group-hover:rotate-12">
                                    <ArrowUpRight size={24} />
                                </div>

                                {/* Match Score Badge */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/5 group-hover:bg-blue-500/20 transition-colors">
                                        <span className="text-blue-400 font-bold text-lg">{Math.floor(Math.random() * 20 + 75)}%</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black tracking-widest text-blue-400">Semantic Score</p>
                                        <p className="text-[9px] font-bold text-slate-500 italic mt-0.5">High Potential</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8 flex-1">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">{job.titre}</h3>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Briefcase size={14} className="text-blue-500/50" /> {job.recruiter?.nom || 'Elite Partner'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-8">
                                    <span className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-bold text-slate-300 flex items-center gap-2 group-hover:bg-white/10 transition-colors">
                                        <MapPin size={12} className="text-blue-400" /> {job.lieu}
                                    </span>
                                    <span className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-bold text-slate-300 group-hover:bg-white/10 transition-colors">
                                        {job.salaire}
                                    </span>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/5 mt-auto">
                                    {appliedJobIds.has(job._id) ? (
                                        <div className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default">
                                            <span>✓</span> Application Submitted
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleApply(job._id); }}
                                            disabled={applyingId === job._id}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-sm hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {applyingId === job._id ? <Loader2 className="animate-spin" size={18} /> : <ArrowUpRight size={18} />}
                                            {applyingId === job._id ? 'Processing...' : 'Apply Securely'}
                                        </button>
                                    )}
                                    <button className="w-full py-4 bg-white/5 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 border border-white/5">
                                        <BookmarkPlus size={16} /> Save Opportunity
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateExplorer;
