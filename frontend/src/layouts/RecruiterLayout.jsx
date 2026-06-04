import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  MessageSquare, 
  Calendar,
  LogOut,
  Bell,
  Search,
  Menu,
  ChevronRight,
  Sparkles,
  Crown,
  Target,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const RecruiterLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();

    const menuItems = [
        { path: '/recruiter/dashboard', icon: <LayoutDashboard size={20} />, label: t('menu.dashboard') },
        { path: '/recruiter/jobs', icon: <Briefcase size={20} />, label: t('menu.jobs') },
        { path: '/recruiter/candidates', icon: <Users size={20} />, label: t('menu.candidates') },
        { path: '/recruiter/interviews', icon: <Calendar size={20} />, label: t('menu.interviews') },
        { path: '/recruiter/scoring', icon: <Target size={20} />, label: t('menu.scoring') },
        { path: '/recruiter/messages', icon: <MessageSquare size={20} />, label: t('menu.messages') },
        { path: '/recruiter/subscription', icon: <Crown size={20} />, label: t('menu.subscription') },
        { path: '/recruiter/reports', icon: <FileText size={20} />, label: t('menu.reports') },
        { path: '/recruiter/settings', icon: <Settings size={20} />, label: t('menu.settings') },
    ];

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Premium Sidebar (Dark Luxe) */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 w-72 bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 z-50 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col relative z-10">
                    {/* Brand Section */}
                    <div className="p-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white">Smart<span className="text-rose-400">-ATS</span></h1>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">Recruiter Suite</p>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="px-5 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('menu.main_console')}</div>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => 
                                    `flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                                        isActive 
                                        ? 'bg-white/5 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`transition-transform duration-300 group-hover:scale-110 ${location.pathname === item.path ? 'text-blue-400' : ''}`}>{item.icon}</span>
                                    <span className="text-sm tracking-wide">{item.label}</span>
                                </div>
                                {location.pathname === item.path && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>}
                            </NavLink>
                        ))}
                    </nav>

                    {/* AI Status Box (Luxe) */}
                    <div className="p-6">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse shadow-[0_0_8px_#f43f5e]"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">AI Engine Online</span>
                            </div>
                            <h3 className="text-sm font-bold mb-1">Processing Node</h3>
                            <p className="text-[10px] text-slate-400 font-medium italic">Scanning 842 profiles...</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <div className="px-4 pb-8">
                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-bold">{t('menu.signout')}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                {/* Header (Glass) */}
                <header className="h-20 bg-slate-950/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-12 shrink-0 z-30">
                    <div className="flex items-center gap-4 text-slate-400">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:text-white"><Menu size={24} /></button>
                        <div className="hidden md:flex items-center gap-3 bg-white/5 p-2.5 px-4 rounded-xl border border-white/5 shadow-inner group focus-within:border-white/20 transition-all">
                            <Search size={16} className="group-focus-within:text-blue-400" />
                            <input type="text" placeholder="Search talent..." className="bg-transparent border-none outline-none text-xs font-medium w-64 text-white placeholder-slate-500 focus:ring-0" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Language Selector */}
                        <LanguageSelector />

                        <div className="relative cursor-pointer group" onClick={() => toast("Aucune nouvelle notification pour le moment.", { icon: "🔔" })}>
                            <Bell size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950 shadow-[0_0_8px_#f43f5e]"></span>
                        </div>

                        <div className="flex items-center gap-4 pl-6 border-l border-white/10 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white tracking-tight">{user?.nom}</p>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest italic">Recruiter Strategist</p>
                            </div>
                            <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg group overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Users size={18} className="text-white group-hover:text-blue-400 transition-colors" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrolled Content Body */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-12 scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RecruiterLayout;
