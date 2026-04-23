import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  FileText, 
  Terminal, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  BrainCircuit,
  Award,
  ShieldCheck,
  Target
} from 'lucide-react';

const RecruiterScoring = () => {
    const [selectedId, setSelectedId] = useState(null);

    // Mock Data pour le scoring IA
    const rankedTalents = [
        { id: 1, name: 'Anis Derbel', role: 'Fullstack Dev', score: 98, match: 'Exceptionnel', strengths: ['React Expert', 'Architecture Node.js', 'Clean Code'], gaps: [] },
        { id: 2, name: 'Sonia K.', role: 'UI/UX Lead', score: 92, match: 'Fort', strengths: ['Design System', 'Accessibility'], gaps: ['React Native'] },
        { id: 3, name: 'Walid B.', role: 'Junior React Dev', score: 74, match: 'Modéré', strengths: ['Motivation', 'CSS/Tailwind'], gaps: ['Database knowledge', 'CI/CD'] },
        { id: 4, name: 'Karim T.', role: 'Backend Dev', score: 65, match: 'Faible', strengths: ['Python', 'SQL'], gaps: ['No React experience'] },
    ];

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
        if (score >= 75) return 'text-blue-500 bg-blue-50 border-blue-100';
        return 'text-amber-500 bg-amber-50 border-amber-100';
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header / Context */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="w-10 h-10 bg-[#B76E79] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#B76E79]/20">
                            <BrainCircuit size={20} />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">Analyse Sémantique IA</h1>
                    </div>
                    <p className="text-slate-400 text-sm font-medium italic">Offre : <span className="text-[#B76E79] font-bold">Senior Frontend Developer</span> · 124 profils analysés.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-50 p-4 px-8 rounded-2xl border border-slate-100 text-center">
                        <p className="text-2xl font-black text-slate-800 tracking-tighter">84%</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Qualité Moyenne</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Candidates List Panel */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-serif font-bold text-slate-800">Talents Recommandés</h2>
                        <div className="flex bg-white p-1 rounded-xl border border-slate-50">
                            <button className="px-4 py-1.5 text-[9px] font-black bg-slate-900 text-white rounded-lg uppercase tracking-widest">Score IA</button>
                            <button className="px-4 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Récent</button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {rankedTalents.map((talent) => (
                            <div 
                                key={talent.id} 
                                onClick={() => setSelectedId(talent.id)}
                                className={`group bg-white p-6 rounded-[2.5rem] border transition-all duration-500 cursor-pointer flex items-center justify-between
                                    ${selectedId === talent.id ? 'border-[#B76E79] ring-4 ring-[#B76E79]/5 scale-[1.02] shadow-xl' : 'border-slate-50 hover:border-[#B76E79]/30 shadow-sm'}
                                `}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-serif font-black text-slate-400 group-hover:text-[#B76E79] transition-colors">
                                        {talent.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-base">{talent.name}</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic mt-0.5">{talent.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className={`hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-2xl border ${getScoreColor(talent.score)}`}>
                                        <span className="text-lg font-black tracking-tighter">{talent.score}%</span>
                                        <span className="text-[7px] font-black uppercase tracking-tighter">Score IA</span>
                                    </div>
                                    <ChevronRight size={20} className={`transition-transform duration-500 ${selectedId === talent.id ? 'translate-x-2 text-[#B76E79]' : 'text-slate-200 group-hover:text-slate-400'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Detail Analysis Side Panel */}
                <div className="space-y-6">
                    <h2 className="text-lg font-serif font-bold text-slate-800 px-2">Focus IA : Sélectionné</h2>
                    {selectedId ? (
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-xl space-y-8 animate-in slide-in-from-right-4 duration-500">
                           <div className="text-center space-y-2">
                               <div className="w-20 h-20 bg-gradient-to-br from-[#B76E79] to-[#E5C4A7] rounded-3xl mx-auto flex items-center justify-center text-white text-2xl font-serif font-black shadow-xl shadow-[#B76E79]/20">
                                   {rankedTalents.find(t => t.id === selectedId).name[0]}
                               </div>
                               <h3 className="text-xl font-serif font-bold text-slate-900 pt-2">{rankedTalents.find(t => t.id === selectedId).name}</h3>
                               <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getScoreColor(rankedTalents.find(t => t.id === selectedId).score)}`}>
                                   Match {rankedTalents.find(t => t.id === selectedId).match}
                               </span>
                           </div>

                           <div className="space-y-6">
                                {/* Strengths */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 italic">
                                        <CheckCircle size={14} /> Points Forts (Top Matches)
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {rankedTalents.find(t => t.id === selectedId).strengths.map((str, i) => (
                                            <span key={i} className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-xl border border-emerald-100 shadow-sm">{str}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Gaps */}
                                {rankedTalents.find(t => t.id === selectedId).gaps.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 italic">
                                            <Target size={14} /> Lacunes Identifiées
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {rankedTalents.find(t => t.id === selectedId).gaps.map((gap, i) => (
                                                <span key={i} className="px-4 py-1.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded-xl border border-amber-100">{gap}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                           </div>

                           <div className="bg-slate-900 p-6 rounded-[2rem] text-white relative overflow-hidden group">
                                <Sparkles className="absolute -right-2 -top-2 w-16 h-16 text-white/5 opacity-40 group-hover:scale-125 transition-transform duration-[2s]" />
                                <h4 className="flex items-center gap-2 text-xs font-serif font-black mb-2">
                                    <Award size={14} className="text-[#B76E79]" /> Suggestion du Moteur
                                </h4>
                                <p className="text-[11px] text-slate-300 italic leading-relaxed">
                                    "Candidate à haut potentiel pour le leadership technique. Son expertise en architecture distribuée correspond parfaitement à vos enjeux 2024."
                                </p>
                           </div>

                           <button className="w-full bg-[#B76E79] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#B76E79]/20 hover:scale-105 active:scale-95 transition-all">
                               Générer Kit Entretien IA
                           </button>
                        </div>
                    ) : (
                        <div className="h-64 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-40">
                            <BrainCircuit size={48} className="text-slate-200" />
                            <p className="text-xs font-bold text-slate-400 italic">Sélectionnez un talent pour lancer l'analyse prédictive.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecruiterScoring;
