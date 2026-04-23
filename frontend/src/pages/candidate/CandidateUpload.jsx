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

const CandidateUpload = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, parsing, success, error
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert("Veuillez sélectionner un fichier PDF valide.");
        }
    };

    const simulateUpload = () => {
        if (!file) return;
        setStatus('uploading');
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setStatus('parsing');
                setTimeout(() => setStatus('success'), 3500);
            }
        }, 100);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Optimisation de votre <span className="text-[#B76E79]">Profil IA</span></h1>
                <p className="text-slate-500 font-medium italic">Déposez votre CV, notre IA s'occupe de l'extraire et de l'optimiser pour les meilleurs recruteurs.</p>
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
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">N'oubliez pas d'inclure vos projets personnels et liens GitHub/Portfolio.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 font-black text-xs italic">3</div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">Notre IA détectera automatiquement vos "Soft Skills" clés.</p>
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
                            ${status === 'idle' ? 'hover:border-[#B76E79] border-slate-200 cursor-pointer' : 'border-slate-100'}
                            ${status === 'success' ? 'bg-emerald-50/30' : ''}
                        `}
                        onClick={() => status === 'idle' && fileInputRef.current.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="application/pdf" 
                            onChange={handleFileChange}
                        />

                        {status === 'idle' && (
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
                                        onClick={(e) => { e.stopPropagation(); simulateUpload(); }}
                                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-2xl shadow-slate-200 flex items-center gap-3 active:scale-95 transition-transform"
                                    >
                                        Lancer l'Analyse IA <ArrowRight size={18} />
                                    </button>
                                )}
                            </>
                        )}

                        {(status === 'uploading' || status === 'parsing') && (
                            <div className="w-full max-w-sm text-center space-y-8 animate-in fade-in duration-500">
                                <div className="relative inline-block">
                                    <Loader2 size={80} className="text-[#B76E79] animate-spin-slow opacity-20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                         <Sparkles size={32} className="text-[#B76E79] animate-pulse" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                                        {status === 'uploading' ? "Transmission sécurisée..." : "L'IA analyse votre parcours..."}
                                    </h3>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-50">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#B76E79] to-[#E5C4A7] rounded-full transition-all duration-300"
                                            style={{ width: `${status === 'parsing' ? 100 : progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic animate-pulse">
                                        {status === 'parsing' ? "Extraction des compétences en cours avec GPT-4o" : `${progress}% complet`}
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="text-center space-y-6 animate-in zoom-in duration-700">
                                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={40} className="text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-slate-900">Analyse Terminée !</h3>
                                <p className="text-slate-500 font-medium max-w-xs mx-auto">Votre profil a été mis à jour avec succès. 12 nouvelles opportunités ont été détectées.</p>
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
