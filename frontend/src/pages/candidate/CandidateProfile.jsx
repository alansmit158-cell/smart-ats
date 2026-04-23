import React from 'react';
import { User, Mail, Shield, Smartphone, MapPin, Globe, Award, Sparkles } from 'lucide-react';

const CandidateProfile = () => {
    return (
        <div className="space-y-10">
            {/* Header Profil */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 bg-gradient-to-br from-[#B76E79] to-[#E5C4A7] rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-serif font-bold shadow-xl shadow-[#B76E79]/20 relative">
                    AD
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                        <Sparkles size={16} className="text-white" />
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Anis Derbel</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Développeur Full Stack Senior</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                        <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"><MapPin size={14}/> Tunis, Tunisie</span>
                        <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"><Globe size={14}/> github.com/anisderbel</span>
                    </div>
                </div>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-slate-200">Éditer le profil</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Account Settings */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8">
                    <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3">
                        <Shield size={20} className="text-[#B76E79]" /> Sécurité & Compte
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Email Principal</label>
                            <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-slate-50 flex items-center gap-4">
                                <Mail size={18} className="text-slate-300" />
                                <span className="text-sm font-bold text-slate-700">candidate@test.com</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Téléphone</label>
                            <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-slate-50 flex items-center gap-4">
                                <Smartphone size={18} className="text-slate-300" />
                                <span className="text-sm font-bold text-slate-700">+216 22 345 678</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <button className="text-[#B76E79] font-black text-xs uppercase tracking-widest hover:underline italic">Changer le mot de passe →</button>
                    </div>
                </div>

                {/* AI Performance Score */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                       <Award size={64} className="text-[#B76E79] opacity-10" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3">
                        <TrendingUp size={20} className="text-emerald-500" /> Score de Performance IA
                    </h2>
                    <div className="flex items-center gap-10">
                        <div className="relative w-32 h-32">
                           <svg className="w-full h-full transform -rotate-90">
                              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364.42" strokeDashoffset="54.66" className="text-[#B76E79] drop-shadow-lg" strokeLinecap="round" />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center font-serif font-black text-3xl text-slate-800">85%</div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-xs font-bold text-slate-600">CV Optimisé</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-xs font-bold text-slate-600">Compétences validées</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-amber-300"></div>
                                <span className="text-xs font-bold text-slate-400">Références à ajouter</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic border-t border-slate-50 pt-6">
                        Votre score est supérieur à 92% des candidats dans votre secteur. Continuez ainsi pour attirer les contrats les plus prestigieux.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
