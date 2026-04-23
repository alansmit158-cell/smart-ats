import React, { useState } from 'react';
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
  AlertTriangle
} from 'lucide-react';

const RecruiterInterviews = () => {
    const [selectedKit, setSelectedKit] = useState(null);

    // Mock Data pour les entretiens
    const interviews = [
        { id: 1, candidate: 'Anis Derbel', role: 'Senior React Dev', date: 'Demain, 14:00', type: 'Visio', matchScore: 98, status: 'Confirmé' },
        { id: 2, candidate: 'Sonia K.', role: 'UX Lead', date: 'Ven. 24 Oct, 10:30', type: 'Présentiel', matchScore: 92, status: 'Confirmé' },
        { id: 3, candidate: 'Karim T.', role: 'Backend Dev', date: 'Lun. 27 Oct, 16:00', type: 'Visio', matchScore: 65, status: 'À valider' },
    ];

    // Mock Data pour le Kit d'entretien IA
    const interviewKit = {
        candidate: 'Anis Derbel',
        summary: "Anis est un expert React avec 8 ans d'expérience. Il a mené des projets de migration vers des architectures micro-frontend et possède une solide culture de la performance Web. Son profil est classé dans le top 2% de notre base pour ce poste.",
        questions: [
            "Comment gérez-vous la réhydratation du state dans une application Next.js massive ?",
            "Pouvez-vous expliquer votre stratégie de découplage des composants métiers des hooks de données ?",
            "Décrivez une situation où vous avez dû optimiser un bundle JS ayant dépassé 2MB."
        ],
        alerts: [
            "N'a pas mentionné d'expérience avec les nouveaux Server Components de React 19.",
            "Semble très orienté technique, vérifier son appétence pour le mentorat d'équipe."
        ]
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B76E79] mb-2 pl-1">Recruitment Pipeline</h2>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Entretiens & Dossiers IA</h1>
                </div>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all outline-none">
                    <Calendar size={18} /> Planifier un RDV
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 {/* Sidebar Stats */}
                 <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-[#B76E79]/10 rounded-xl flex items-center justify-center text-[#B76E79]">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="font-serif font-bold text-slate-800">Assistance IA</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-50">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Kits</span>
                                <span className="font-serif font-black text-xl">24</span>
                            </div>
                            <div className="flex justify-between items-center bg-[#B76E79]/5 p-4 rounded-2xl border border-[#B76E79]/10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#B76E79]">Prêts ce jour</span>
                                <span className="font-serif font-black text-xl text-[#B76E79]">03</span>
                            </div>
                        </div>
                        <p className="mt-6 text-[10px] text-slate-400 font-medium italic leading-relaxed">Le système génère 3 versions du kit selon le type d'entretien choisi.</p>
                    </div>
                 </div>

                 {/* Interviews Table / Main Area */}
                 <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="font-serif font-bold text-lg text-slate-800">Prochains Entretiens</h3>
                            <button className="text-slate-300 hover:text-slate-600 font-black text-[10px] uppercase tracking-widest italic hover:underline flex items-center gap-1">Voir tout l'agenda <ChevronRight size={12} /></button>
                        </div>
                        
                        <div className="divide-y divide-slate-50">
                            {interviews.map((interview) => (
                                <div key={interview.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#B76E79]/5 transition-colors group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                                           <p className="text-[8px] font-black text-[#B76E79] uppercase">OCT</p>
                                           <p className="text-2xl font-serif font-black text-slate-800 tracking-tighter">{interview.date.match(/\d+/)}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-slate-800 group-hover:text-[#B76E79] transition-colors">{interview.candidate}</h4>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${interview.status === 'Confirmé' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{interview.status}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic mt-0.5">{interview.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                                        <span className="flex items-center gap-2"><Clock size={14} className="text-[#B76E79] opacity-50" /> {interview.date}</span>
                                        <span className="flex items-center gap-2"><MapPin size={14} className="text-[#B76E79] opacity-50" /> {interview.type}</span>
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <TrendingUp size={14} className="text-emerald-500" />
                                            <span className="text-emerald-600 font-black tracking-tighter">{interview.matchScore}%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setSelectedKit(interview.candidate)}
                                            className="bg-[#B76E79] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#B76E79]/20 hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <BrainCircuit size={16} /> Kit Entretien IA
                                        </button>
                                        <button className="text-slate-300 hover:text-slate-600 p-2"><MoreVertical size={18}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>

            {/* AI Interview Kit Overlay */}
            {selectedKit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#FDFCF0] w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="p-8 lg:p-12 pb-6 border-b border-white relative shrink-0">
                             <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-[#B76E79] shadow-xl">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-slate-900">Kit d'Entretien Stratégique</h3>
                                        <p className="text-[#B76E79] text-xs font-black uppercase tracking-widest italic">Généré par Smart-ATS IA pour {selectedKit}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedKit(null)} className="p-3 bg-white hover:bg-slate-50 rounded-2xl transition-colors text-slate-300 hover:text-slate-900 shadow-sm border border-slate-50"><X size={24} /></button>
                             </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 lg:px-12 space-y-10 scrollbar-hide py-10">
                            {/* Section: Résumé IA */}
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#B76E79] italic border-b border-[#B76E79]/10 pb-3">
                                    <Sparkles size={14} /> Profil & Potentiel
                                </h4>
                                <div className="bg-white p-6 rounded-3xl border border-slate-50 text-sm italic text-slate-600 leading-relaxed shadow-sm">
                                    "{interviewKit.summary}"
                                </div>
                            </section>

                            {/* Section: Questions suggérées */}
                            <section className="space-y-6">
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 italic border-b border-blue-100 pb-3">
                                    <BrainCircuit size={14} /> Questions de Validation Technique
                                </h4>
                                <div className="grid grid-cols-1 gap-1">
                                    {interviewKit.questions.map((q, i) => (
                                        <div key={i} className="bg-white p-5 rounded-3xl border border-slate-50 hover:border-blue-200 transition-colors flex gap-4 group">
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-serif font-black text-xs shrink-0">{i+1}</div>
                                            <p className="text-sm font-bold text-slate-700 leading-snug group-hover:text-blue-900 pt-1">{q}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Section: Points de vigilance */}
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 italic border-b border-rose-100 pb-3">
                                    <AlertTriangle size={14} /> Points de Vigilance (Vigilance IA)
                                </h4>
                                <div className="space-y-2">
                                    {interviewKit.alerts.map((a, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100 italic">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></div>
                                            <p className="text-xs font-medium text-rose-700">{a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="p-8 lg:p-12 pt-6 border-t border-white shrink-0 bg-white/30 backdrop-blur-sm">
                            <div className="flex gap-4">
                                <button className="flex-1 bg-slate-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                    <Download size={18} /> Télécharger le Dossier PDF
                                </button>
                                <button className="px-10 bg-emerald-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:bg-emerald-600 transition-colors">
                                    <CheckCircle2 size={18} /> Valider l'Entretien
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterInterviews;
