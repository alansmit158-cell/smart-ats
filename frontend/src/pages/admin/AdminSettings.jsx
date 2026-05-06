import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Database, 
  Cpu, 
  Save, 
  Trash2, 
  Globe, 
  Bell, 
  Moon, 
  Layout, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        openaiKey: 'sk-proj-••••••••••••••••••••••••••••••••',
        maxWorkers: 3,
        tokenLimit: 1000000,
        enableAutoMatching: true,
        notificationEmails: 'admin@smart-ats.com',
        maintenanceMode: false
    });

    const handleSave = () => {
        toast.loading("Sauvegarde des paramètres...");
        setTimeout(() => {
            toast.dismiss();
            toast.success("Configuration système mise à jour avec succès.");
        }, 1500);
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black text-white tracking-tighter">Configuration Système</h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Gérez les fondations techniques de votre plateforme IA.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="px-10 py-4 bg-gradient-to-r from-[#B76E79] to-[#E5C4A7] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#B76E79]/20 hover:scale-105 transition-all flex items-center gap-3"
                >
                    <Save size={16} /> Enregistrer les modifications
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: API & Infrastructure */}
                <div className="lg:col-span-2 space-y-10">
                    {/* API Configuration */}
                    <div className="bg-[#1e293b]/10 backdrop-blur-md p-10 rounded-[3rem] border border-[#1e293b] space-y-8">
                        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3 border-b border-[#1e293b] pb-6">
                            <Key size={20} className="text-amber-500" /> API & Infrastructure IA
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Clé API OpenAI</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        value={settings.openaiKey} 
                                        className="w-full bg-black/40 border border-[#1e293b] p-4 rounded-2xl text-white font-mono text-sm focus:ring-1 focus:ring-[#B76E79] outline-none"
                                        readOnly
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">Modifier</button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre de Workers Max</label>
                                <select 
                                    className="w-full bg-black/40 border border-[#1e293b] p-4 rounded-2xl text-white text-sm focus:ring-1 focus:ring-[#B76E79] outline-none appearance-none"
                                    value={settings.maxWorkers}
                                    onChange={(e) => setSettings({...settings, maxWorkers: e.target.value})}
                                >
                                    <option value="1">1 Worker (Économique)</option>
                                    <option value="3">3 Workers (Équilibré)</option>
                                    <option value="5">5 Workers (Performance)</option>
                                    <option value="10">10 Workers (Cluster)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Limite de Tokens Mensuelle</label>
                             <div className="flex items-center gap-6">
                                <input 
                                    type="range" 
                                    min="100000" 
                                    max="5000000" 
                                    step="100000"
                                    value={settings.tokenLimit}
                                    onChange={(e) => setSettings({...settings, tokenLimit: e.target.value})}
                                    className="flex-1 accent-[#B76E79]"
                                />
                                <span className="text-sm font-black text-white w-24 text-right">{(settings.tokenLimit / 1000000).toFixed(1)} M</span>
                             </div>
                        </div>
                    </div>

                    {/* Automation Settings */}
                    <div className="bg-[#1e293b]/10 backdrop-blur-md p-10 rounded-[3rem] border border-[#1e293b] space-y-8">
                        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3 border-b border-[#1e293b] pb-6">
                            <Cpu size={20} className="text-[#B76E79]" /> Automatisation & Intelligence
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className="text-sm font-bold text-white">Matching Sémantique Automatique</p>
                                    <p className="text-[10px] text-slate-500 font-medium italic">Déclencher le scoring dès la création d'une offre.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.enableAutoMatching} onChange={() => setSettings({...settings, enableAutoMatching: !settings.enableAutoMatching})} />
                                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B76E79]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className="text-sm font-bold text-white">Mode Maintenance</p>
                                    <p className="text-[10px] text-slate-500 font-medium italic">Désactiver l'accès public à la plateforme.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.maintenanceMode} onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} />
                                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Platform Prefs */}
                <div className="space-y-10">
                    <div className="bg-black/40 p-10 rounded-[3rem] border border-[#1e293b] space-y-8">
                        <h3 className="text-lg font-serif font-bold text-white flex items-center gap-3">
                            <Layout size={18} className="text-blue-500" /> Préférences UX
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Thème Principal</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="p-3 bg-[#B76E79]/20 border border-[#B76E79] rounded-xl text-white text-[10px] font-black uppercase tracking-widest">Rose Doré Luxe</button>
                                    <button className="p-3 bg-slate-900 border border-[#1e293b] rounded-xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Midnight Slate</button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Langue du Système</label>
                                <div className="flex items-center gap-4 bg-black/40 border border-[#1e293b] p-4 rounded-2xl">
                                    <Globe size={16} className="text-slate-500" />
                                    <span className="text-sm font-bold text-white">Français (FR)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-500/5 p-10 rounded-[3rem] border border-rose-500/20 space-y-6">
                        <div className="flex items-center gap-3 text-rose-500">
                             <AlertTriangle size={24} />
                             <h4 className="font-serif font-bold">Zone de Danger</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">La réinitialisation supprimera toutes les données candidates et les configurations d'IA. Cette action est irréversible.</p>
                        <button className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                             Réinitialiser l'Instance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
