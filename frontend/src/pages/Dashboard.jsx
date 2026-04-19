import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, Briefcase } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import AIAnalysisCard from '../components/AIAnalysisCard';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalCandidates: 0,
        interviewsScheduled: 0,
        upcomingInterviews: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/dashboard/stats');
                if (data.success) {
                    setStats((prev) => ({
                        ...prev,
                        ...data.data
                    }));
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);
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
                            value={loading ? "..." : stats.totalCandidates.toLocaleString()}
                            icon={Users}
                            trend="+12%"
                            trendUp={true}
                        />
                        <StatsCard
                            title="Interviews Scheduled"
                            value={loading ? "..." : stats.interviewsScheduled.toString()}
                            icon={Calendar}
                            trend="+5%"
                            trendUp={true}
                        />
                        <StatsCard
                            title="Active Jobs"
                            value={loading ? "..." : stats.totalJobs.toLocaleString()}
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
                                {loading ? (
                                    <p className="text-gray-400 text-sm">Loading interviews...</p>
                                ) : stats.upcomingInterviews?.length > 0 ? (
                                    stats.upcomingInterviews.map((interview) => {
                                        const dateObj = new Date(interview.date);
                                        const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                        const day = dateObj.getDate();
                                        const time = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                                        return (
                                            <div key={interview._id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                                                <div className="text-center w-12 bg-blue-50 rounded-lg py-1">
                                                    <div className="text-xs text-blue-600 font-bold">{month}</div>
                                                    <div className="text-lg font-bold text-gray-900">{day}</div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{interview.candidate?.name || 'Unknown Candidate'} {interview.job?.title ? `- ${interview.job.title}` : ''}</p>
                                                    <p className="text-xs text-gray-500">{time} • {interview.type === 'Online' ? 'Online' : 'In-Person'}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-400 text-sm">No upcoming interviews scheduled.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
