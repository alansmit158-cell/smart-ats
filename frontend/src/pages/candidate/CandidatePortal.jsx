import React, { useState } from 'react';
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
  Bookmark
} from 'lucide-react';

const CandidatePortal = () => {
    const [search, setSearch] = useState('');
    
    // Mock Data pour la simulation
    const stats = [
        { label: 'Candidatures envoyées', value: 12, icon: <FileText className="text-blue-500" />, color: 'bg-blue-50' },
        { label: 'Entretiens prévus', value: 3, icon: <Clock3 className="text-[#B76E79]" />, color: 'bg-[#B76E79]/10' },
        { label: 'Offres correspondantes', value: 8, icon: <Sparkles className="text-amber-500" />, color: 'bg-amber-50' },
    ];

    const recommendedJobs = [
        { id: 1, title: 'Designer UI/UX Senior', company: 'Luxury Web Agency', location: 'Paris (Remote)', salary: '55k-65k', match: 98, date: 'Il y a 2h' },
        { id: 2, title: 'Développeur Frontend React', company: 'Tech Innovation', location: 'Lyon, France', salary: '45k-52k', match: 92, date: 'Il y a 5h' },
        { id: 3, title: 'Product Manager E-commerce', company: 'Global Fashion', location: 'Tunis, Tunisie', salary: '40k-50k', match: 88, date: 'Hier' },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Header / Salutation Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#B76E79] to-[#E5C4A7] rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-[#B76E79]/10 text-[#B76E79] text-[10px] font-black uppercase tracking-widest rounded-full">Excellence Portal</span>
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-3 leading-tight">Optimisez votre carrière avec <span className="text-[#B76E79]">l'IA Smart-ATS.</span></h1>
                        <p className="text-slate-500 text-sm leading-relaxed">Votre profil est actuellement analysé pour 8 nouvelles correspondances aujourd'hui.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:scale-105 transition-all text-sm">Parcourir les offres</button>
                        <button className="bg-white border border-slate-100 text-slate-800 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:scale-105 transition-all text-sm">Mon Profil IA</button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-5 hover:translate-y-[-4px] transition-transform duration-300">
                        <div className={`${stat.color} p-4 rounded-2xl`}>{stat.icon}</div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Job Explorer Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-serif font-bold text-slate-800">Offres recommandées</h2>
                        <div className="flex items-center gap-2 text-[#B76E79] text-xs font-bold cursor-pointer hover:underline">
                            Tout voir <TrendingUp size={14} />
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
                        {recommendedJobs.map((job) => (
                            <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm hover:border-[#B76E79]/30 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 group relative overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 p-4">
                                    <button className="text-slate-200 hover:text-[#B76E79] transition-colors"><Bookmark size={20}/></button>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-14 h-14 bg-[#F9F9F9] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                                        <Briefcase size={22} className="text-[#B76E79]" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-slate-800 group-hover:text-[#B76E79] transition-colors">{job.title}</h3>
                                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100">MATCH {job.match}%</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                                            <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                                            <span className="flex items-center gap-1 font-bold text-[#B76E79]">{job.salary}</span>
                                            <span className="flex items-center gap-1"><Clock size={14}/> {job.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center pr-2">
                                        <button className="w-full md:w-auto bg-[#B76E79]/10 text-[#B76E79] px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#B76E79] hover:text-white transition-all">Postuler</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel / Activity & News */}
                <div className="space-y-8">
                    <h2 className="text-xl font-serif font-bold text-slate-800">Activité Récente</h2>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm space-y-8 relative overflow-hidden">
                        {/* Vertical Progress Line */}
                        <div className="absolute left-[39px] top-12 bottom-12 w-[1px] bg-slate-100"></div>
                        
                        <div className="flex gap-5 relative group">
                            <div className="z-10 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-white shadow-lg shadow-emerald-500/20">
                                <CheckCircle size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Aujourd'hui, 09:20</p>
                                <p className="text-sm font-bold text-slate-800">Candidature acceptée</p>
                                <p className="text-xs text-slate-500 mt-1">Votre CV a été validé par l'IA pour l'offre "Senior UI Designer".</p>
                            </div>
                        </div>

                        <div className="flex gap-5 relative group">
                            <div className="z-10 w-8 h-8 rounded-full bg-[#B76E79] flex items-center justify-center text-white ring-4 ring-white shadow-lg shadow-[#B76E79]/20">
                                <Clock size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Hier, 14:15</p>
                                <p className="text-sm font-bold text-slate-800">Entretien planifié</p>
                                <p className="text-xs text-slate-500 mt-1">Vous avez un rendez-vous demain à 10:00 avec Tech Innovations.</p>
                                <button className="mt-3 text-xs font-black text-[#B76E79] hover:underline uppercase tracking-widest">Préparer avec l'IA →</button>
                            </div>
                        </div>

                        <div className="flex gap-5 relative group">
                            <div className="z-10 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white ring-4 ring-white shadow-lg shadow-amber-500/20">
                                <AlertCircle size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Lundi, 10:00</p>
                                <p className="text-sm font-bold text-slate-800">Mise à jour requise</p>
                                <p className="text-xs text-slate-500 mt-1">Ajoutez vos références pour augmenter votre score de match.</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Tip Box */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white overflow-hidden relative group">
                        <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/5 group-hover:scale-125 transition-transform duration-[2s]" />
                        <h3 className="text-lg font-serif font-bold mb-3 flex items-center gap-2">
                           <Sparkles size={18} className="text-amber-400" /> AI Career Tip
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-amber-400/50 pl-4">
                            "Mettre l'accent sur vos projets React récents dans votre CV pour cette offre doublera vos chances d'entretien selon mes prévisions."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidatePortal;
