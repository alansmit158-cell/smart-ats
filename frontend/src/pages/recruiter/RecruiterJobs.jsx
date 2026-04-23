import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Target, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  MoreHorizontal,
  MapPin,
  TrendingUp,
  FileText
} from 'lucide-react';

const RecruiterJobs = () => {
    const [showModal, setShowModal] = useState(false);

    // Mock Data pour les offres actives
    const activeJobs = [
        { id: 1, title: 'Senior Frontend Developer', location: 'Tunis / Remote', applicants: 156, interviews: 8, status: 'Active', matchRate: 94 },
        { id: 2, title: 'UX Designer Luxury Brand', location: 'Paris, France', applicants: 89, interviews: 12, status: 'Active', matchRate: 88 },
        { id: 3, title: 'Fullstack Node.js Engineer', location: 'Casablanca', applicants: 215, interviews: 5, status: 'Draft', matchRate: 0 },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B76E79] mb-2 pl-1">Talent Management</h2>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Gestion des Offres d'Emploi</h1>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 hover:shadow-2xl hover:shadow-slate-200 transition-all active:scale-95"
                >
                    <Plus size={18} /> Nouvelle Offre
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Offres Actives', value: '12', icon: <Briefcase className="text-[#B76E79]" /> },
                    { label: 'Candidatures Total', value: '1,284', icon: <Users className="text-blue-500" /> },
                    { label: 'Matching Moyen', value: '82%', icon: <Sparkles className="text-amber-500" /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center gap-6 hover:translate-y-[-5px] transition-all duration-500 group">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-50 group-hover:bg-[#B76E79]/5 transition-colors">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-3xl font-serif font-black text-slate-900 tracking-tighter">{stat.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 italic">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Jobs Management Table */}
            <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="font-serif font-bold text-lg text-slate-800">Catalogue des Postes</h3>
                    <div className="flex gap-2">
                        <span className="px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400">FILTRER PAR STATUS</span>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Détails du Poste</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Localisation</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Talents IA</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Qualité Match</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {activeJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-[#B76E79]/5 transition-colors group cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-800 group-hover:text-[#B76E79] transition-colors">{job.title}</p>
                                                {job.status === 'Draft' && <span className="bg-slate-100 text-slate-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Brouillon</span>}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Créée il y a 3 jours</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <MapPin size={14} className="text-[#B76E79] opacity-50" /> {job.location}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <Users size={12} className="text-[#B76E79]" />
                                            <span className="text-sm font-black text-slate-800">{job.applicants}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center text-xs">
                                        {job.matchRate > 0 ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${job.matchRate}%` }}></div>
                                                </div>
                                                <span className="font-black text-emerald-600">{job.matchRate}%</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 font-bold italic">En attente...</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <button className="bg-[#B76E79] text-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-[#B76E79]/20 hover:scale-110 transition-transform">Explorer</button>
                                            <button className="text-slate-300 hover:text-slate-600 p-2"><MoreHorizontal size={18}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Job Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-8 lg:p-12 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-slate-900">Nouvelle Opportunité</h3>
                                    <p className="text-slate-400 text-xs mt-1 font-medium italic">L'IA pré-analysera votre description pour suggérer des profils.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-2xl transition-colors text-slate-300 hover:text-slate-900"><Plus size={24} className="rotate-45" /></button>
                            </div>

                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Titre du Poste</label>
                                    <input type="text" className="w-full bg-[#FAFAFA] border-none rounded-2xl p-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-[#B76E79]/20 outline-none" placeholder="ex. Creative UI Specialist" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Localisation</label>
                                        <input type="text" className="w-full bg-[#FAFAFA] border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#B76E79]/20 outline-none" placeholder="Remote, Paris, Tunis..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Type de Contrat</label>
                                        <select className="w-full bg-[#FAFAFA] border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#B76E79]/20 outline-none">
                                            <option>Full-time</option>
                                            <option>Part-time</option>
                                            <option>Freelance</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Description Stratégique</label>
                                    <textarea rows={4} className="w-full bg-[#FAFAFA] border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#B76E79]/20 outline-none resize-none" placeholder="Décrivez les enjeux et les missions du poste..."></textarea>
                                </div>
                            </form>

                            <div className="flex gap-4 pt-4">
                                <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all">Publier et Lancer l'IA</button>
                                <button className="px-8 border border-slate-100 rounded-2xl text-slate-400 font-bold text-xs hover:bg-slate-50 transition-colors" onClick={() => setShowModal(false)}>Annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterJobs;
