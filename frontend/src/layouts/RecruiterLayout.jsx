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
  Crown
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

const RecruiterLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/recruiter/dashboard', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
        { path: '/recruiter/jobs', icon: <Briefcase size={20} />, label: 'Offres d\'emploi' },
        { path: '/recruiter/candidates', icon: <Users size={20} />, label: 'Vivier Talents' },
        { path: '/recruiter/interviews', icon: <Calendar size={20} />, label: 'Entretiens IA' },
        { path: '/recruiter/messages', icon: <MessageSquare size={20} />, label: 'Messagerie' },
        { path: '/recruiter/subscription', icon: <Crown size={20} />, label: 'Abonnement' },
        { path: '/recruiter/settings', icon: <Settings size={20} />, label: 'Paramètres' },
    ];

    return (
        <div className="flex h-screen bg-[#FDFCF0] text-slate-800 font-sans overflow-hidden">
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Premium Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-100 z-50 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Brand Section */}
                    <div className="p-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                            <span className="font-serif text-xl font-bold tracking-tighter">S</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-black tracking-tight text-slate-900">Smart-ATS</h1>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#B76E79] font-black">Recruiter Edition</p>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="px-5 mb-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Navigation Centrale</div>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => 
                                    `flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                                        isActive 
                                        ? 'bg-[#B76E79]/5 text-[#B76E79] font-bold shadow-sm border border-[#B76E79]/10' 
                                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                                    }`
                                }
                            >
                                <div className="flex items-center gap-4">
                                    <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                                    <span className="text-sm tracking-wide">{item.label}</span>
                                </div>
                                {location.pathname === item.path && <ChevronRight size={14} className="opacity-50" />}
                            </NavLink>
                        ))}
                    </nav>

                    {/* AI Engine Status Box */}
                    <div className="p-6">
                        <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                            <Sparkles className="absolute -right-2 -bottom-2 w-16 h-16 text-white/5 group-hover:scale-125 transition-transform duration-1000" />
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 bg-[#B76E79] rounded-full animate-pulse shadow-[0_0_8px_#B76E79]"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#B76E79]">IA GPT-4o Active</span>
                            </div>
                            <h3 className="text-sm font-serif font-bold mb-1">Moteur d'analyse</h3>
                            <p className="text-[10px] text-slate-400 font-medium italic">842 Talents analysés ce mois-ci.</p>
                        </div>
                    </div>

                    {/* Footer Nav */}
                    <div className="px-4 pb-8">
                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-bold">Se déconnecter</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Modern Header */}
                <header className="h-20 bg-white/50 backdrop-blur-md border-b border-white flex items-center justify-between px-6 lg:px-12 shrink-0 z-30">
                    <div className="flex items-center gap-4 text-slate-400">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2"><Menu size={24} /></button>
                        <div className="hidden md:flex items-center gap-3 bg-white p-2.5 px-4 rounded-xl border border-slate-100 shadow-inner">
                            <Search size={16} />
                            <input type="text" placeholder="Rechercher un talent ou une offre..." className="bg-transparent border-none outline-none text-xs font-medium w-64 focus:ring-0" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative cursor-pointer hover:scale-110 transition-transform">
                            <Bell size={20} className="text-slate-400" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B76E79] rounded-full border-2 border-white"></span>
                        </div>

                        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-800 tracking-tight">{user?.nom}</p>
                                <p className="text-[10px] font-black text-[#B76E79] uppercase tracking-widest italic">Recruteur Strategist</p>
                            </div>
                            <div className="w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#B76E79]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Users size={18} className="text-[#B76E79]" />
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
