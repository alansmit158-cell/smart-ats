import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between z-10">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search candidates, jobs..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">Alex Morgan</p>
                        <p className="text-xs text-gray-500">Senior Recruiter</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center border border-blue-100">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
