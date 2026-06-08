import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import { 
  LayoutDashboard, 
  Briefcase, 
  Send, 
  MessageSquare, 
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const CandidateLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const menuItems = [
    { path: '/candidate/portal', icon: <LayoutDashboard size={20} />, label: t('menu.dashboard') },
    { path: '/candidate/explorer', icon: <Briefcase size={20} />, label: t('menu.jobs') },
    { path: '/candidate/upload', icon: <Sparkles size={20} />, label: t('menu.interviews') },
    { path: '/candidate/applications', icon: <Send size={20} />, label: t('menu.scoring') },
    { path: '/candidate/messages', icon: <MessageSquare size={20} />, label: t('menu.messages') },
    { path: '/candidate/profile', icon: <UserIcon size={20} />, label: t('menu.settings') },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Dark Glass) — RTL-aware */}
      <aside className={`
        fixed lg:static inset-y-0 w-72 bg-slate-900/50 backdrop-blur-2xl border-white/5 z-50 transition-transform duration-300 ease-in-out
        ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
        ${isSidebarOpen
          ? 'translate-x-0'
          : isRTL
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }
      `}>
        <div className="h-full flex flex-col relative z-10">
          {/* Logo Section */}
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
               <Sparkles className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-xl font-bold tracking-tight text-white">Smart<span className="text-rose-400">-ATS</span></h1>
               <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{t('menu.suite_candidate')}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4">
            <div className="px-5 mb-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">{t('menu.navigation')}</div>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-white/5 text-white font-bold border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <span className={`transition-transform duration-300 group-hover:scale-110 ${location.pathname === item.path ? 'text-blue-400' : ''}`}>{item.icon}</span>
                <span className="text-sm tracking-wide">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* AI Profile Progress Footer */}
          <div className="p-6">
            <div className="bg-white/5 p-5 rounded-3xl mb-4 border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-all">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse shadow-[0_0_8px_#f43f5e]"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('menu.ai_profile_score')}</span>
               </div>
               <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[85%] rounded-full"></div>
               </div>
               <p className="text-[10px] text-slate-500 font-medium">{t('menu.visibility_label')} : <span className="text-blue-400 font-bold uppercase">{t('menu.visibility_optimal')}</span></p>
            </div>

            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300"
            >
              <LogOut size={20} />
              <span className="text-sm font-bold">{t('menu.signout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Header (Glass) */}
        <header className="h-20 bg-slate-950/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-12 flex-shrink-0 z-30">
          <div className="flex items-center gap-4 text-slate-400">
            <button 
              className="lg:hidden p-2 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold text-white tracking-wide uppercase italic">
               {menuItems.find(i => location.pathname === i.path)?.label || t('menu.dashboard')}
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <LanguageSelector />

            <NotificationBell />

            <div className="flex items-center gap-4 pl-6 border-l border-white/5 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
              <div className="text-right hidden sm:block rtl:text-left">
                <p className="text-sm font-bold text-white tracking-tight">{user?.nom}</p>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest italic">{t('menu.role_candidate_label')}</p>
              </div>
              <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg group overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent group-hover:opacity-100 transition-opacity opacity-0"></div>
                 <UserIcon size={20} className="text-white group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
