import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, FileText } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Briefcase, label: 'Jobs', path: '/jobs' },
        { icon: Users, label: 'Candidates', path: '/candidates' },
        { icon: FileText, label: 'Reports', path: '/reports' },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar text-white flex flex-col shadow-xl z-20">
            <div className="p-6 border-b border-gray-700/50 flex justify-center">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <img
                        src="/logo.png"
                        alt="Smart-ATS Logo"
                        className="h-10 w-auto object-contain"
                    />
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
              ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                            }`}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-400'}`} />
                                <span className="font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-400">System Online</span>
                </div>
                <p className="text-xs text-gray-500">AI Model v2.4 Active</p>
            </div>
        </div>
    );
};

export default Sidebar;
