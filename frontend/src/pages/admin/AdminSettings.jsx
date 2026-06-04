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
  AlertTriangle,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Server,
  Cloud,
  Layers,
  Sliders
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const AdminSettings = () => {
    const { t, i18n } = useTranslation();
    const configTitle = t('admin.settings.mainframe_config');
    const configWords = configTitle.split(' ');
    const configFirstPart = configWords.slice(0, -1).join(' ');
    const configLastWord = configWords[configWords.length - 1];

    const getLanguageLabel = () => {
        switch (i18n.language) {
            case 'fr': return 'Français (FR)';
            case 'ar': return 'العربية (AR)';
            default: return 'English (US/UK)';
        }
    };

    const [settings, setSettings] = useState({
        openaiKey: 'sk-proj-••••••••••••••••••••••••••••••••',
        maxWorkers: 3,
        tokenLimit: 1000000,
        enableAutoMatching: true,
        notificationEmails: 'admin@smart-ats.com',
        maintenanceMode: false
    });

    const handleSave = () => {
        toast.loading(t('admin.settings.syncing_toast'), {
            style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        });
        setTimeout(() => {
            toast.dismiss();
            toast.success(t('admin.settings.optimized_toast'), {
                icon: '⚙️',
                style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
        }, 1500);
    };

    return (
        <div className="space-y-12 pb-24 relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/20 mb-3"
                    >
                        <Settings size={12} /> {t('admin.settings.infrastructure')}
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
                        {configFirstPart} <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic">{configLastWord}</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium italic mt-2">{t('admin.settings.subtitle')}</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                >
                    <Save size={18} /> {t('admin.settings.commit')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: API & Infrastructure */}
                <div className="lg:col-span-2 space-y-12">
                    {/* API Configuration */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full"></div>
                        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4 border-b border-white/5 pb-8 relative z-10">
                            <Key size={24} className="text-blue-500" /> {t('admin.settings.api_control')}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{t('admin.settings.openai_key')}</label>
                                <div className="relative group">
                                    <input 
                                        type="password" 
                                        value={settings.openaiKey} 
                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-inner group-focus-within:bg-slate-950"
                                        readOnly
                                    />
                                    <button className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors text-[10px] font-black uppercase tracking-widest">{t('admin.settings.update_btn')}</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{t('admin.settings.workers')}</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl text-white text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer hover:bg-slate-950 transition-all"
                                        value={settings.maxWorkers}
                                        onChange={(e) => setSettings({...settings, maxWorkers: e.target.value})}
                                    >
                                        <option value="1" className="bg-slate-900">{t('admin.settings.worker_nodes.eco')}</option>
                                        <option value="3" className="bg-slate-900">{t('admin.settings.worker_nodes.balanced')}</option>
                                        <option value="5" className="bg-slate-900">{t('admin.settings.worker_nodes.high')}</option>
                                        <option value="10" className="bg-slate-900">{t('admin.settings.worker_nodes.cluster')}</option>
                                    </select>
                                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none rotate-90" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                             <div className="flex justify-between items-end">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{t('admin.settings.token_quota')}</label>
                                 <span className="text-lg font-bold text-white tracking-tighter">{(settings.tokenLimit / 1000000).toFixed(1)} <span className="text-blue-500 text-xs">{t('admin.settings.million')}</span></span>
                             </div>
                             <div className="flex items-center gap-8 bg-slate-950/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                                <Cloud size={20} className="text-blue-500/50" />
                                <input 
                                    type="range" 
                                    min="100000" 
                                    max="5000000" 
                                    step="100000"
                                    value={settings.tokenLimit}
                                    onChange={(e) => setSettings({...settings, tokenLimit: e.target.value})}
                                    className="flex-1 accent-blue-600 h-1.5 rounded-full bg-white/5"
                                />
                             </div>
                        </div>
                    </motion.div>

                    {/* Automation Settings */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden"
                    >
                        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4 border-b border-white/5 pb-8">
                            <Layers size={24} className="text-blue-400" /> {t('admin.settings.automation')}
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-slate-950/30 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shadow-xl group-hover:scale-110 transition-transform">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-white tracking-tight">{t('admin.settings.autonomy_title')}</p>
                                        <p className="text-xs text-slate-500 font-medium italic">{t('admin.settings.autonomy_desc')}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.enableAutoMatching} onChange={() => setSettings({...settings, enableAutoMatching: !settings.enableAutoMatching})} />
                                    <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-700 after:border-none after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white shadow-inner"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-950/30 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 shadow-xl group-hover:scale-110 transition-transform">
                                        <Server size={20} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-white tracking-tight">{t('admin.settings.maintenance_title')}</p>
                                        <p className="text-xs text-slate-500 font-medium italic">{t('admin.settings.maintenance_desc')}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={settings.maintenanceMode} onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} />
                                    <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-700 after:border-none after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600 peer-checked:after:bg-white shadow-inner"></div>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Platform Prefs */}
                <div className="space-y-12">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-950 p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4 relative z-10">
                            <Sliders size={20} className="text-blue-500" /> {t('admin.settings.interface')}
                        </h3>
                        
                        <div className="space-y-8 relative z-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1 font-bold">{t('admin.settings.aesthetic_label')}</label>
                                <div className="grid grid-cols-1 gap-4">
                                    <button className="p-5 bg-blue-600/10 border border-blue-600/30 rounded-[1.5rem] text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(37,99,235,0.1)]">{t('admin.settings.aesthetic_dark')}</button>
                                    <button className="p-5 bg-white/5 border border-white/5 rounded-[1.5rem] text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all">{t('admin.settings.aesthetic_space')}</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1 font-bold">{t('admin.settings.lang_label')}</label>
                                <div className="flex items-center gap-5 bg-white/5 border border-white/5 p-5 rounded-[1.5rem] shadow-inner group/lang cursor-pointer hover:bg-white/10 transition-all">
                                    <Globe size={20} className="text-blue-500/50 group-hover/lang:rotate-180 transition-transform duration-1000" />
                                    <span className="text-sm font-bold text-white">{getLanguageLabel()}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-rose-500/[0.03] p-12 rounded-[4rem] border border-rose-500/20 space-y-8 shadow-[0_0_50px_rgba(244,63,94,0.05)]"
                    >
                        <div className="flex items-center gap-4 text-rose-500">
                             <AlertTriangle size={32} className="animate-pulse" />
                             <h4 className="text-2xl font-bold tracking-tight">{t('admin.settings.danger_zone')}</h4>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed italic font-medium">{t('admin.settings.danger_desc')}</p>
                        <button className="w-full py-5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-2xl">
                             {t('admin.settings.reset_btn')}
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
