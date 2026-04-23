import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Send, 
  MessageSquare, 
  User as UserIcon,
  LogOut,
  Bell,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

const CandidateLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/candidate/portal', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/candidate/explorer', icon: <Briefcase size={20} />, label: 'Explorer Offres' },
    { path: '/candidate/upload', icon: <Sparkles size={20} />, label: 'Dépôt de CV (IA)' },
    { path: '/candidate/applications', icon: <Send size={20} />, label: 'Mes Candidatures' },
    { path: '/candidate/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { path: '/candidate/profile', icon: <UserIcon size={20} />, label: 'Mon Profil' },
  ];

  return (
    <div className="flex h-screen bg-[#FDFCF0] text-slate-800 font-sans overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-100 z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#B76E79] to-[#E5C4A7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#B76E79]/20">
              <span className="font-serif text-xl font-bold italic">S</span>
            </div>
            <div>
               <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900">Smart-ATS</h1>
               <p className="text-[10px] uppercase tracking-widest text-[#B76E79] font-bold">Luxe Recruitment</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#B76E79]/10 to-transparent text-[#B76E79] font-semibold border-l-4 border-[#B76E79]' 
                      : 'text-slate-400 hover:text-[#B76E79] hover:bg-[#B76E79]/5'
                  }`
                }
              >
                <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                <span className="text-sm tracking-wide">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Section Footer */}
          <div className="p-6 border-t border-slate-50">
            <div className="bg-[#B76E79]/5 p-4 rounded-2xl mb-4 border border-[#B76E79]/10">
               <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={14} className="text-[#B76E79]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Premium AI Profile</span>
               </div>
               <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#B76E79] h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(183,110,121,0.5)]"></div>
               </div>
               <p className="text-[10px] text-slate-400 mt-2">Visibilité Recruteurs : <span className="text-[#B76E79] font-bold">Optimale</span></p>
            </div>

            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-50 transition-all duration-300"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Se déconnecter</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-white flex items-center justify-between px-4 lg:px-10 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-serif font-bold text-slate-800">
               {menuItems.find(i => location.pathname === i.path)?.label || 'Aperçu'}
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="relative cursor-pointer group">
              <Bell size={20} className="text-slate-400 group-hover:text-[#B76E79] transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#B76E79] rounded-full border-2 border-white"></span>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user?.nom}</p>
                <p className="text-[10px] font-bold text-[#B76E79] uppercase tracking-tighter italic">Candidat Premium</p>
              </div>
              <div className="w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#B76E79]/10 to-transparent group-hover:opacity-100 transition-opacity opacity-0"></div>
                 <UserIcon size={20} className="text-[#B76E79]" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet with scroll and fade effect */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
