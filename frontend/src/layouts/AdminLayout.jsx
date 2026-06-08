import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import { 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Settings, 
  Activity, 
  LogOut,
  Cpu,
  Menu,
  X,
  Zap,
  CreditCard
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();

    const menuItems = [
        { path: '/admin/stats', icon: <BarChart3 size={20} />, label: t('menu.dashboard') },
        { path: '/admin/users', icon: <Users size={20} />, label: t('menu.candidates') },
        { path: '/admin/security', icon: <ShieldCheck size={20} />, label: t('menu.interviews') },
        { path: '/admin/logs', icon: <Activity size={20} />, label: t('menu.reports') },
        { path: '/admin/subscriptions', icon: <CreditCard size={20} />, label: t('menu.subscription') },
        { path: '/admin/settings', icon: <Settings size={20} />, label: t('menu.settings') },
    ];

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-rose-500/30">
            {/* Dark Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Dark Luxe */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 w-72 bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 z-50 transition-transform duration-500 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col pt-4 relative z-10">
                    {/* Brand Admin */}
                    <div className="p-8 pb-12 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
                                <Cpu size={22} className="animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white leading-none">Smart<span className="text-rose-400">-ATS</span></h1>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-1">Admin Core v5.0</p>
                            </div>
                        </div>
                        <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                        <p className="px-5 mb-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">{t('admin.main_modules')}</p>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => 
                                    `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                                        isActive 
                                        ? 'bg-white/5 text-white font-bold border-l-4 border-blue-500 shadow-inner' 
                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                <span className={`transition-all duration-500 group-hover:rotate-12 ${location.pathname === item.path ? 'text-blue-400' : ''}`}>{item.icon}</span>
                                <span className="text-sm tracking-wide">{item.label}</span>
                                {item.label === 'Supervision' && (
                                    <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Security Badge Footer */}
                    <div className="p-6">
                        <div className="bg-gradient-to-b from-white/5 to-transparent p-5 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                           <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-1000"></div>
                           <div className="flex items-center gap-3 mb-3">
                              <Zap size={14} className="text-rose-400" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('admin.threat_level')}</span>
                           </div>
                           <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                               <p className="text-[10px] text-slate-500 font-medium italic">{t('admin.firewall_active')}</p>
                           </div>
                        </div>
                        
                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-6 py-5 mt-6 rounded-2xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-bold">{t('menu.signout')}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-rose-900/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Glass Header */}
                <header className="h-20 bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-6 lg:px-12 shrink-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={24} /></button>
                        <h2 className="text-lg font-bold text-white tracking-widest uppercase italic">{t('admin.console_title')}</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <LanguageSelector />

                        <div className="hidden sm:flex items-center gap-2 bg-white/5 p-2 px-4 rounded-xl border border-white/5 text-xs">
                             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                             <span className="text-slate-400 font-bold uppercase tracking-widest">{t('admin.mainframe_link')}</span>
                        </div>
                        
                        <NotificationBell />

                        <div className="flex items-center gap-4 pl-6 border-l border-white/5 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white tracking-tight">{user?.nom}</p>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest italic">{t('admin.root_access')}</p>
                            </div>
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10 shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <ShieldCheck size={18} className="text-blue-400" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main View Port */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-12 z-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
