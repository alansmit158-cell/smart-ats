import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const CandidateUpload = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, processing, completed, failed
    const [progress, setProgress] = useState(0);
    const [uploadSteps, setUploadSteps] = useState([]);
    const [parsedData, setParsedData] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setStatus('idle');
        } else {
            toast.error("Veuillez sélectionner un fichier PDF valide.");
        }
    };

    const uploadCV = async () => {
        if (!file) return;
        
        try {
            setStatus('uploading');
            setProgress(20);
            
            // 1. Envoyer le fichier
            const formData = new FormData();
            formData.append('cv', file);
            
            const response = await API.post('/candidates/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const { candidateId } = response.data;
            setStatus('processing');
            setProgress(40);
            
            // 2. Polling toutes les 2 secondes jusqu'à completion
            setUploadSteps([
                { label: 'Fichier reçu par le serveur', done: true },
                { label: 'Worker Thread démarré...', done: true },
                { label: 'Extraction texte PDF...', done: false },
                { label: 'Analyse sémantique OpenAI...', done: false },
                { label: 'Structuration des données...', done: false }
            ]);
            
            let attempts = 0;
            const maxAttempts = 30; // 30 x 2s = 60s max
            
            const pollStatus = async () => {
                attempts++;
                if (attempts > maxAttempts) {
                    toast.error('Délai d\'analyse dépassé. Réessayez.');
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
                        toast.success('✨ CV analysé avec succès par l\'IA !');
                        return;
                    }
                    
                    if (currentStatus === 'failed') {
                        setStatus('failed');
                        toast.error('Analyse IA échouée. Veuillez réessayer.');
                        return;
                    }
                    
                    if (currentStatus === 'processing') {
                        // Increment progress artificially for UI while waiting
                        setProgress(prev => Math.min(prev + 5, 90));
                        setTimeout(pollStatus, 2000);
                    }
                } catch (err) {
                    toast.error("Erreur de connexion au serveur.");
                    setStatus('failed');
                }
            };
            
            // Démarrer le polling
            setTimeout(pollStatus, 2000);

        } catch (error) {
            console.error(error);
            setStatus('failed');
            toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi du fichier.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Optimisation de votre <span className="text-[#B76E79]">Profil IA</span></h1>
                <p className="text-slate-500 font-medium italic">Déposez votre CV, un Worker Thread IA s'occupe de l'extraire et de l'optimiser.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Instructions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-4">Conseils IA</h3>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 font-black text-xs italic">1</div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">Utilisez un format PDF structuré pour une meilleure lecture par notre algorithme GPT-4o.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0 font-black text-xs italic">2</div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">L'analyse est désormais asynchrone, la page ne bloquera plus pendant le traitement.</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#B76E79] to-[#E5C4A7] p-8 rounded-[2rem] text-white shadow-xl shadow-[#B76E79]/20 relative overflow-hidden">
                        <ShieldCheck className="absolute -right-2 -bottom-2 w-20 h-20 opacity-10" />
                        <h4 className="font-bold flex items-center gap-2 mb-2"><Zap size={18} fill="currentColor"/> Smart-Match Plus</h4>
                        <p className="text-xs font-medium text-white/90 leading-relaxed italic">
                            Les candidats ayant un CV analysé reçoivent 3x plus d'invitations à des entretiens.
                        </p>
                    </div>
                </div>

                {/* Right side: Upload Zone */}
                <div className="lg:col-span-2">
                    <div 
                        className={`bg-white border-2 border-dashed rounded-[3rem] p-12 lg:p-20 transition-all duration-700 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[400px]
                            ${status === 'idle' || status === 'failed' ? 'hover:border-[#B76E79] border-slate-200 cursor-pointer' : 'border-slate-100'}
                            ${status === 'completed' ? 'bg-emerald-50/30 border-emerald-200' : ''}
                            ${status === 'failed' ? 'bg-rose-50/30 border-rose-200' : ''}
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

                        {(status === 'idle' || status === 'failed') && (
                            <>
                                <div className="w-24 h-24 bg-[#B76E79]/5 rounded-full flex items-center justify-center mb-8 relative group">
                                    <div className="absolute inset-0 bg-[#B76E79] rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-5"></div>
                                    <UploadCloud size={40} className="text-[#B76E79]" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {file ? file.name : "Cliquez ou glissez votre CV"}
                                </h3>
                                <p className="text-slate-400 text-sm font-medium italic mb-10">Format PDF · Max 10MB</p>
                                
                                {file && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); uploadCV(); }}
                                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-2xl shadow-slate-200 flex items-center gap-3 active:scale-95 transition-transform"
                                    >
                                        Lancer l'Analyse Asynchrone <ArrowRight size={18} />
                                    </button>
                                )}
                            </>
                        )}

                        {(status === 'uploading' || status === 'processing') && (
                            <div className="w-full max-w-sm text-center space-y-8 animate-in fade-in duration-500">
                                <div className="relative inline-block">
                                    <Loader2 size={80} className="text-[#B76E79] animate-spin-slow opacity-20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                         <Sparkles size={32} className="text-[#B76E79] animate-pulse" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                                        {status === 'uploading' ? "Transmission sécurisée..." : "Le Worker Thread analyse le PDF..."}
                                    </h3>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-50">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#B76E79] to-[#E5C4A7] rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic animate-pulse">
                                        {progress}% complet
                                    </p>

                                    {/* Steps list */}
                                    {uploadSteps.length > 0 && (
                                        <div className="mt-6 text-left space-y-2 bg-slate-50 p-4 rounded-2xl">
                                            {uploadSteps.map((step, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    {step.done ? <CheckCircle2 size={14} className="text-emerald-500"/> : <Loader2 size={14} className="text-slate-300 animate-spin"/>}
                                                    <span className={`text-[11px] font-semibold ${step.done ? 'text-slate-700' : 'text-slate-400'}`}>{step.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {status === 'completed' && (
                            <div className="text-center space-y-6 animate-in zoom-in duration-700">
                                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={40} className="text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-slate-900">Analyse Terminée !</h3>
                                <p className="text-slate-500 font-medium max-w-xs mx-auto">Votre profil a été mis à jour avec succès via le pipeline NLP asynchrone.</p>
                                <button 
                                    className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-100 flex items-center gap-3 mx-auto mt-4"
                                    onClick={() => setStatus('idle')}
                                >
                                    Voir mon profil optimisé <FileText size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateUpload;
