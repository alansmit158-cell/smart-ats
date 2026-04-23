import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Settings, 
  Activity, 
  LogOut,
  Bell,
  Cpu,
  Menu,
  X,
  Zap
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/admin/stats', icon: <BarChart3 size={20} />, label: 'Supervision' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Utilisateurs' },
        { path: '/admin/security', icon: <ShieldCheck size={20} />, label: 'Sécurité' },
        { path: '/admin/logs', icon: <Activity size={20} />, label: 'Audit Logs' },
        { path: '/admin/settings', icon: <Settings size={20} />, label: 'Système' },
    ];

    return (
        <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden selection:bg-[#B76E79]/30">
            {/* Dark Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Dark Luxe */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 w-72 bg-[#020617] border-r border-[#1e293b] z-50 transition-transform duration-500 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col pt-4">
                    {/* Brand Admin */}
                    <div className="p-8 pb-12 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#B76E79] to-amber-600 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-[#B76E79]/20">
                                <Cpu size={22} className="animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-xl font-serif font-black tracking-tight text-white leading-none">Smart-ATS</h1>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-[#B76E79] font-black mt-1">Admin Core v4.0</p>
                            </div>
                        </div>
                        <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                        <p className="px-5 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Main Modules</p>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => 
                                    `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                                        isActive 
                                        ? 'bg-[#B76E79]/10 text-white font-bold border-l-4 border-[#B76E79] shadow-inner shadow-black' 
                                        : 'text-slate-500 hover:text-[#B76E79] hover:bg-[#111827]'
                                    }`
                                }
                            >
                                <span className={`transition-transform duration-500 group-hover:rotate-12`}>{item.icon}</span>
                                <span className="text-sm tracking-wide">{item.label}</span>
                                {item.label === 'Supervision' && (
                                    <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Security Badge Footer */}
                    <div className="p-6">
                        <div className="bg-gradient-to-b from-[#1e293b]/50 to-transparent p-5 rounded-[2rem] border border-[#1e293b] relative overflow-hidden group">
                           <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#B76E79]/5 rounded-full blur-2xl group-hover:bg-[#B76E79]/10 transition-all duration-1000"></div>
                           <div className="flex items-center gap-3 mb-3">
                              <Zap size={14} className="text-[#B76E79]" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Threat Level : 0</span>
                           </div>
                           <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                               <p className="text-[10px] text-slate-500 font-medium italic">Firewall IA : Operationnel</p>
                           </div>
                        </div>
                        
                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-6 py-5 mt-6 rounded-2xl text-slate-600 hover:text-rose-400 hover:bg-rose-950/20 transition-all duration-300"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-bold">Logout Console</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B76E79]/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Glass Header */}
                <header className="h-20 bg-[#020617]/80 backdrop-blur-3xl border-b border-[#1e293b] flex items-center justify-between px-6 lg:px-12 shrink-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={24} /></button>
                        <h2 className="text-lg font-serif font-black text-white tracking-widest uppercase italic">Console Administrative</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2 bg-[#1e293b]/50 p-2 px-4 rounded-xl border border-[#1e293b] text-xs">
                             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                             <span className="text-slate-400 font-black uppercase tracking-widest">Mainframe Link : Good</span>
                        </div>
                        
                        <div className="relative">
                            <Bell size={20} className="text-slate-500 hover:text-white transition-colors cursor-pointer" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B76E79] rounded-full border-2 border-[#020617]"></span>
                        </div>

                        <div className="flex items-center gap-4 pl-6 border-l border-[#1e293b]">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-white tracking-tight">{user?.nom}</p>
                                <p className="text-[10px] font-black text-[#B76E79] uppercase tracking-widest italic">Root Access</p>
                            </div>
                            <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center text-white border border-[#334155] shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[#B76E79]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <ShieldCheck size={18} className="text-[#B76E79]" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main View Port */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-12 z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
