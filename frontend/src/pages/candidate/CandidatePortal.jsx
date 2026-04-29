import React, { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CandidatePortal = () => {
    const [search, setSearch] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasCV, setHasCV] = useState(false);
    const [myApplications, setMyApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // Fetch All Jobs
                const jobsRes = await axios.get('http://localhost:5000/api/jobs', config);
                setJobs(jobsRes.data);

                // Check if candidate has CV
                const candidateRes = await axios.get('http://localhost:5000/api/candidates/me', config).catch(() => null);
                setHasCV(!!candidateRes?.data?.data);

                // Fetch My Applications to disable apply button if already applied
                const appsRes = await axios.get('http://localhost:5000/api/applications/my-applications', config);
                setMyApplications(appsRes.data.data);

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
            toast.error("Veuillez d'abord uploader votre CV pour postuler.", {
                duration: 4000,
                icon: '📄',
            });
            setTimeout(() => navigate('/candidate/upload'), 1500);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const res = await axios.post(`http://localhost:5000/api/applications/apply/${jobId}`, {}, config);
            
            if (res.data.success) {
                toast.success(res.data.message);
                setMyApplications([...myApplications, res.data.data]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la postulation");
        }
    };

    const isApplied = (jobId) => {
        return myApplications.some(app => (app.job._id || app.job) === jobId);
    };

    // Filter jobs based on search
    const filteredJobs = jobs.filter(job => 
        job.titre.toLowerCase().includes(search.toLowerCase()) ||
        job.lieu.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="text-[#B76E79] animate-spin" />
                <p className="text-slate-400 font-medium italic">Préparation de votre portail d'excellence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header / Salutation Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#B76E79] to-[#E5C4A7] rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
                    <div className="max-w-md text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="px-3 py-1 bg-[#B76E79]/10 text-[#B76E79] text-[10px] font-black uppercase tracking-widest rounded-full">Excellence Portal</span>
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-3 leading-tight">Optimisez votre carrière avec <span className="text-[#B76E79]">l'IA Smart-ATS.</span></h1>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {hasCV 
                                ? "Votre CV est analysé en temps réel pour vous proposer les meilleures opportunités." 
                                : "Commencez par uploader votre CV pour laisser l'IA vous propulser."}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {!hasCV && (
                            <button 
                                onClick={() => navigate('/candidate/upload')}
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:scale-105 transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <FileText size={18} /> Uploader mon CV
                            </button>
                        )}
                        <button 
                            onClick={() => document.getElementById('explorer').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white border border-slate-100 text-slate-800 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:scale-105 transition-all text-sm shadow-sm"
                        >
                            Parcourir les offres
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Candidatures envoyées', value: myApplications.length, icon: <FileText className="text-blue-500" />, color: 'bg-blue-50' },
                    { label: 'Entretiens prévus', value: myApplications.filter(a => a.status === 'Interviewed').length, icon: <Clock3 className="text-[#B76E79]" />, color: 'bg-[#B76E79]/10' },
                    { label: 'Offres disponibles', value: jobs.length, icon: <Sparkles className="text-amber-500" />, color: 'bg-amber-50' },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-5 hover:translate-y-[-4px] transition-transform duration-300"
                    >
                        <div className={`${stat.color} p-4 rounded-2xl`}>{stat.icon}</div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10" id="explorer">
                {/* Job Explorer Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-serif font-bold text-slate-800">Offres disponibles</h2>
                        <div className="flex items-center gap-2 text-[#B76E79] text-xs font-bold cursor-pointer hover:underline">
                            Voir les meilleures correspondances <TrendingUp size={14} />
                        </div>
                    </div>

                    {/* Search Bar Plugin */}
                    <div className="bg-white p-2 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                        <div className="p-3 text-slate-400"><Search size={18}/></div>
                        <input 
                            type="text" 
                            placeholder="Rechercher par métier, ville..." 
                            className="flex-1 bg-transparent border-none outline-none text-sm font-medium focus:ring-0 pl-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="bg-[#B76E79] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:shadow-lg transition-all">Filtres</button>
                    </div>

                    <div className="space-y-4">
                        {filteredJobs.length === 0 ? (
                            <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-200 text-center">
                                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-400 font-medium italic">Aucune offre ne correspond à votre recherche.</p>
                            </div>
                        ) : filteredJobs.map((job, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={job._id} 
                                className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm hover:border-[#B76E79]/30 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <button className="text-slate-200 hover:text-[#B76E79] transition-colors"><Bookmark size={20}/></button>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-14 h-14 bg-[#F9F9F9] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                                        <Briefcase size={22} className="text-[#B76E79]" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-slate-800 group-hover:text-[#B76E79] transition-colors">{job.titre}</h3>
                                            {hasCV && <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100">MATCH IA PRÉVU</span>}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                                            <span className="flex items-center gap-1"><MapPin size={14}/> {job.lieu}</span>
                                            <span className="flex items-center gap-1 font-bold text-[#B76E79]">{job.salaire}</span>
                                            <span className="flex items-center gap-1"><Clock size={14}/> Il y a peu</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center pr-2">
                                        {isApplied(job._id) ? (
                                            <button disabled className="w-full md:w-auto bg-emerald-50 text-emerald-600 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2">
                                                <CheckCircle size={14} /> Déjà postulé
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleApply(job._id)}
                                                className="w-full md:w-auto bg-[#B76E79]/10 text-[#B76E79] px-8 py-3 rounded-xl font-bold text-xs hover:bg-[#B76E79] hover:text-white transition-all shadow-sm"
                                            >
                                                Postuler
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
                    <h2 className="text-xl font-serif font-bold text-slate-800">Conseils IA</h2>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm space-y-8 relative overflow-hidden">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white overflow-hidden relative group">
                            <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/5 group-hover:scale-125 transition-transform duration-[2s]" />
                            <h3 className="text-lg font-serif font-bold mb-3 flex items-center gap-2">
                               <Sparkles size={18} className="text-amber-400" /> Career Agent
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-amber-400/50 pl-4">
                                {hasCV 
                                    ? "Votre profil est optimisé. Je vous recommande de postuler aux offres marquées 'MATCH IA' pour maximiser vos chances."
                                    : "Sans CV parsé, je ne peux pas encore vous guider précisément. Uploadez votre fichier pour activer mon moteur de recommandation."}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">Mises à jour récentes</h4>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                                    <TrendingUp size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Le marché recrute</p>
                                    <p className="text-xs text-slate-500">+15% d'offres en React ce mois-ci.</p>
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
