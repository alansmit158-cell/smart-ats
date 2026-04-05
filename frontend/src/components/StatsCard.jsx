import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendUp }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(59,130,246,0.1)] hover:shadow-lg transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {trend}
                    {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </div>
            </div>

            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;
