import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  RefreshCcw,
  Activity,
  Target
} from 'lucide-react';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CandidateUpload = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const queryParams = new URLSearchParams(window.location.search);
    const initialJobId = queryParams.get('jobId') || '';

    const [file, setFile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(initialJobId);
    const [status, setStatus] = useState('idle'); // idle, uploading, processing, completed, failed
    const [progress, setProgress] = useState(0);
    const [uploadSteps, setUploadSteps] = useState([]);
    const [parsedData, setParsedData] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await API.get('/jobs');
                setJobs(res.data);
                if (res.data.length > 0 && !initialJobId) {
                    setSelectedJobId(res.data[0]._id);
                }
            } catch (err) {
                console.error("Error fetching jobs in upload:", err);
            }
        };
        fetchJobs();
    }, [initialJobId]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setStatus('idle');
            toast.success(t('candidate_upload.toast_selected', { name: selectedFile.name }), {
                icon: '📎',
                style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
        } else {
            toast.error(t('candidate_upload.toast_invalid_pdf'));
        }
    };

    const uploadCV = async () => {
        if (!file) return;
        
        try {
            setStatus('uploading');
            setProgress(20);
            
            const formData = new FormData();
            formData.append('cv', file);
            if (selectedJobId) {
                formData.append('jobId', selectedJobId);
            }
            
            const response = await API.post('/candidates/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const { candidateId } = response.data;
            setStatus('processing');
            setProgress(40);
            
            setUploadSteps([
                { label: t('candidate_upload.step_1'), done: true },
                { label: t('candidate_upload.step_2'), done: true },
                { label: t('candidate_upload.step_3'), done: false },
                { label: t('candidate_upload.step_4'), done: false },
                { label: t('candidate_upload.step_5'), done: false }
            ]);
            
            let attempts = 0;
            const maxAttempts = 30;
            
            const pollStatus = async () => {
                attempts++;
                if (attempts > maxAttempts) {
                    toast.error(t('candidate_upload.toast_timeout'));
                    setStatus('failed');
                    return;
                }
                
                try {
                    const statusResponse = await API.get(`/candidates/status/${candidateId}`);
                    const { status: currentStatus, data } = statusResponse.data;
                    
                    if (currentStatus === 'completed') {
                        setProgress(100);
                        setUploadSteps(prev => prev.map(s => ({ ...s, done: true })));
                        setParsedData(data);
                        setStatus('completed');
                        toast.success(t('candidate_upload.toast_sync_success'), {
                            style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                        });
                        return;
                    }
                    
                    if (currentStatus === 'failed') {
                        setStatus('failed');
                        toast.error(t('candidate_upload.toast_analysis_failed'));
                        return;
                    }
                    
                    if (currentStatus === 'processing') {
                        setProgress(prev => Math.min(prev + 5, 90));
                        setTimeout(pollStatus, 2000);
                    }
                } catch (err) {
                    toast.error(t('candidate_upload.toast_network_error'));
                    setStatus('failed');
                }
            };
            
            setTimeout(pollStatus, 2000);

        } catch (error) {
            console.error(error);
            setStatus('failed');
            toast.error(error.response?.data?.message || t('candidate_upload.toast_transmission_failed'));
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>
            
            <div className="text-center space-y-4">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/20 mb-2"
                >
                    <Cpu size={14} /> {t('candidate_upload.profile_indexing')}
                </motion.div>
                <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
                    {t('candidate_upload.initialize_title')}{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic font-medium">
                        {t('candidate_upload.professional_node')}
                    </span>
                </h1>
                <p className="text-slate-500 text-lg font-medium italic max-w-2xl mx-auto">
                    {t('candidate_upload.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left side: Instructions */}
                <div className="lg:col-span-1 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[40px] rounded-full"></div>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-6 flex items-center gap-3 relative z-10">
                            <Sparkles size={16} className="text-blue-400" /> {t('candidate_upload.tips_title')}
                        </h3>
                        
                        <div className="space-y-8 relative z-10">
                            <div className="flex gap-5 items-start group">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-blue-400 flex items-center justify-center flex-shrink-0 font-black text-xs italic group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">1</div>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                                    {t('candidate_upload.tip_1_part1')}{' '}
                                    <span className="text-blue-400 font-bold">{t('candidate_upload.tip_1_bold')}</span>
                                    {t('candidate_upload.tip_1_part2')}
                                </p>
                            </div>
                            <div className="flex gap-5 items-start group">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-indigo-400 flex items-center justify-center flex-shrink-0 font-black text-xs italic group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">2</div>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                                    {t('candidate_upload.tip_2_part1')}{' '}
                                    <span className="text-indigo-400 font-bold">{t('candidate_upload.tip_2_bold')}</span>
                                    {t('candidate_upload.tip_2_part2')}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-blue-600/80 to-indigo-800/80 p-10 rounded-[3rem] text-white shadow-[0_0_50px_rgba(37,99,235,0.2)] relative overflow-hidden group"
                    >
                        <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                        <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 mb-4">
                            <Zap size={20} className="text-blue-300" fill="currentColor"/> {t('candidate_upload.strategic_edge')}
                        </h4>
                        <p className="text-sm font-medium text-blue-100 leading-relaxed italic opacity-90">
                            {t('candidate_upload.strategic_edge_desc_part1')}{' '}
                            <span className="text-white font-black underline decoration-blue-400 underline-offset-4">
                                {t('candidate_upload.strategic_edge_bold')}
                            </span>{' '}
                            {t('candidate_upload.strategic_edge_desc_part2')}
                        </p>
                    </motion.div>
                </div>

                {/* Right side: Upload Zone */}
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    {(status === 'idle' || status === 'failed') && (
                        <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-xl space-y-3">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block ml-1">
                                {t('candidate_explorer.job_offer') || "Target Job Offer"}
                            </label>
                            <select
                                value={selectedJobId}
                                onChange={(e) => setSelectedJobId(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer hover:bg-white/5 transition-all"
                            >
                                <option value="" disabled>{t('candidate_upload.select_job') || "Select a job offer..."}</option>
                                {jobs.map(j => (
                                    <option key={j._id} value={j._id} className="bg-slate-900">
                                        {j.titre} - {j.lieu}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`bg-white/5 backdrop-blur-3xl border-2 border-dashed rounded-[4rem] p-12 lg:p-24 transition-all duration-700 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[400px] shadow-2xl
                            ${status === 'idle' || status === 'failed' ? 'hover:border-blue-500/50 border-white/10 cursor-pointer' : 'border-white/5'}
                            ${status === 'completed' ? 'bg-emerald-500/[0.03] border-emerald-500/30' : ''}
                            ${status === 'failed' ? 'bg-rose-500/[0.03] border-rose-500/30' : ''}
                        `}
                        onClick={() => (status === 'idle' || status === 'failed') && fileInputRef.current.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="application/pdf" 
                            onChange={handleFileChange}
                        />

                        <AnimatePresence mode="wait">
                            {(status === 'idle' || status === 'failed') && (
                                <motion.div 
                                    key="idle"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center mb-10 relative group border border-white/10 shadow-2xl">
                                        <div className="absolute inset-0 bg-blue-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 opacity-10"></div>
                                        <UploadCloud size={48} className="text-blue-500 group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                                        {file ? file.name : t('candidate_upload.initialize_payload')}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium italic mb-12 uppercase tracking-widest">
                                        {t('candidate_upload.supported_format')}
                                    </p>
                                    
                                    {file && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); uploadCV(); }}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            {t('candidate_upload.btn_transmit')} <ArrowRight size={20} />
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {(status === 'uploading' || status === 'processing') && (
                                <motion.div 
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full max-w-md text-center space-y-12"
                                >
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
                                        <Loader2 size={100} className="text-blue-500 animate-spin opacity-20 relative z-10" />
                                        <div className="absolute inset-0 flex items-center justify-center relative z-10">
                                             <Activity size={36} className="text-blue-400 animate-pulse" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-white tracking-tight italic">
                                            {status === 'uploading' 
                                                ? t('candidate_upload.stream_syncing') 
                                                : t('candidate_upload.worker_active')}
                                        </h3>
                                        <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                            ></motion.div>
                                        </div>
                                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em] italic animate-pulse">
                                            {progress}% {t('candidate_upload.indexed_percent')}
                                        </p>

                                        {uploadSteps.length > 0 && (
                                            <div className="mt-8 text-left space-y-4 bg-white/5 p-8 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                                                {uploadSteps.map((step, idx) => (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        {step.done ? <CheckCircle2 size={16} className="text-emerald-500"/> : <Loader2 size={16} className="text-blue-400 animate-spin"/>}
                                                        <span className={`text-[11px] font-black uppercase tracking-widest ${step.done ? 'text-slate-300' : 'text-slate-600 italic'}`}>{step.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {status === 'completed' && (
                                <motion.div 
                                    key="completed"
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-8"
                                >
                                    <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                        <CheckCircle2 size={56} className="text-emerald-500" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
                                            {t('candidate_upload.success_title')}
                                        </h3>
                                        <p className="text-slate-400 font-medium max-w-sm mx-auto italic text-lg leading-relaxed">
                                            {t('candidate_upload.success_desc')}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-4 pt-4">
                                        <button 
                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/20 flex items-center gap-4 mx-auto hover:scale-105 active:scale-95 transition-all"
                                            onClick={() => navigate('/candidate/profile')}
                                        >
                                            {t('candidate_upload.btn_view_identity')} <FileText size={20} />
                                        </button>
                                        <button 
                                            className="text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                                            onClick={() => setStatus('idle')}
                                        >
                                            {t('candidate_upload.btn_new_stream')}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CandidateUpload;
