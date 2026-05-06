import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Briefcase, 
  Sparkles,
  Save,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

const RecruiterSettings = () => {
    const [notifs, setNotifs] = useState({
        email: true,
        matching: true,
        interviews: true
    });

    const handleSave = () => {
        toast.success("Paramètres mis à jour.");
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tighter">Paramètres Recruteur</h1>
                <button 
                    onClick={handleSave}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-slate-200"
                >
                    <Save size={18} /> Enregistrer
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Profil Entreprise */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-3">
                            <Briefcase size={20} className="text-[#B76E79]" /> Profil & Entreprise
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom Complet</label>
                                <input type="text" defaultValue="Alex Morgan" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#B76E79]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entreprise</label>
                                <input type="text" defaultValue="Smart Recruit Ltd" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#B76E79]" />
                            </div>
                        </div>
                    </div>

                    {/* Préférences IA */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/5 group-hover:scale-125 transition-all duration-[2s]" />
                        <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-3">
                            <Sparkles size={20} className="text-amber-400" /> Préférences de l'Agent IA
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className="text-sm font-bold">Suggestions de réponse auto</p>
                                    <p className="text-[10px] text-slate-400">L'IA génère des brouillons pour vos messages.</p>
                                </div>
                                <div className="w-12 h-6 bg-[#B76E79] rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Notifications */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-3">
                            <Bell size={20} className="text-blue-500" /> Notifications
                        </h3>
                        <div className="space-y-4">
                            {['Alertes de matching', 'Nouveaux messages', 'Rappels d\'entretien'].map((label, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600">{label}</span>
                                    <input type="checkbox" defaultChecked className="accent-[#B76E79]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sécurité */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-3">
                            <Lock size={20} className="text-rose-500" /> Sécurité
                        </h3>
                        <button className="w-full py-3 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 hover:bg-slate-100 transition-all">
                            Changer le mot de passe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterSettings;
