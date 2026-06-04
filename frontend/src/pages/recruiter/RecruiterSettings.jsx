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
import { useTranslation } from 'react-i18next';

const RecruiterSettings = () => {
    const { t } = useTranslation();
    const [notifs, setNotifs] = useState({
        email: true,
        matching: true,
        interviews: true
    });

    const handleSave = () => {
        toast.success(t('recruiter_settings.toast_success'));
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tighter">{t('recruiter_settings.title')}</h1>
                <button 
                    onClick={handleSave}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-slate-200"
                >
                    <Save size={18} /> {t('recruiter_settings.save_btn')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Profil Entreprise */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-3">
                            <Briefcase size={20} className="text-[#B76E79]" /> {t('recruiter_settings.profile_company')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('recruiter_settings.full_name')}</label>
                                <input type="text" defaultValue="Alex Morgan" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#B76E79]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('recruiter_settings.company')}</label>
                                <input type="text" defaultValue="Smart Recruit Ltd" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#B76E79]" />
                            </div>
                        </div>
                    </div>

                    {/* Préférences IA */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/5 group-hover:scale-125 transition-all duration-[2s]" />
                        <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-3">
                            <Sparkles size={20} className="text-amber-400" /> {t('recruiter_settings.ai_preferences')}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className="text-sm font-bold">{t('recruiter_settings.auto_reply_title')}</p>
                                    <p className="text-[10px] text-slate-400">{t('recruiter_settings.auto_reply_desc')}</p>
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
                            <Bell size={20} className="text-blue-500" /> {t('recruiter_settings.notifications')}
                        </h3>
                        <div className="space-y-4">
                            {[
                                { key: 'matching_alerts', defaultLabel: 'Alertes de matching' },
                                { key: 'new_messages', defaultLabel: 'Nouveaux messages' },
                                { key: 'interview_reminders', defaultLabel: "Rappels d'entretien" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600">{t(`recruiter_settings.${item.key}`, item.defaultLabel)}</span>
                                    <input type="checkbox" defaultChecked className="accent-[#B76E79]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sécurité */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-3">
                            <Lock size={20} className="text-rose-500" /> {t('recruiter_settings.security')}
                        </h3>
                        <button className="w-full py-3 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 hover:bg-slate-100 transition-all">
                            {t('recruiter_settings.change_password')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterSettings;
