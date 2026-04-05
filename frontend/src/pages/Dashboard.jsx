import React from 'react';
import { Users, Calendar, Briefcase } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import AIAnalysisCard from '../components/AIAnalysisCard';

const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />

            <main className="ml-64 w-full">
                <Header />

                <div className="p-8 pt-24 space-y-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                            <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
                        </div>
                        <div className="flex gap-2">
                            <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Quarter</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard
                            title="New Applicants"
                            value="1,284"
                            icon={Users}
                            trend="+12%"
                            trendUp={true}
                        />
                        <StatsCard
                            title="Interviews Scheduled"
                            value="42"
                            icon={Calendar}
                            trend="+5%"
                            trendUp={true}
                        />
                        <StatsCard
                            title="Active Jobs"
                            value="18"
                            icon={Briefcase}
                            trend="-2%"
                            trendUp={false}
                        />
                    </div>

                    <AIAnalysisCard />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Placeholder for Recent Activity or other sections */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            JD
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">John Doe applied for Senior Frontend Developer</p>
                                            <p className="text-xs text-gray-500">2 minutes ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Interviews</h3>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                                        <div className="text-center w-12 bg-blue-50 rounded-lg py-1">
                                            <div className="text-xs text-blue-600 font-bold">FEB</div>
                                            <div className="text-lg font-bold text-gray-900">{10 + i}</div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Sarah Smith - UX Designer</p>
                                            <p className="text-xs text-gray-500">10:00 AM • Google Meet</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
