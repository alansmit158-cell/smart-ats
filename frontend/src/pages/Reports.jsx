import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { BarChart, PieChart, Activity } from 'lucide-react';

const Reports = () => {
    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />

            <main className="ml-64 w-full">
                <Header />

                <div className="p-8 pt-24 space-y-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                            <p className="text-gray-500 mt-1">Deep dive into recruitment metrics.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder Charts */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center space-y-4">
                            <BarChart className="w-16 h-16 text-blue-100" />
                            <h3 className="text-lg font-bold text-gray-900">Application Sources</h3>
                            <p className="text-sm text-gray-500 text-center">Chart data visualization will go here.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center space-y-4">
                            <PieChart className="w-16 h-16 text-purple-100" />
                            <h3 className="text-lg font-bold text-gray-900">Candidate Pipeline Status</h3>
                            <p className="text-sm text-gray-500 text-center">Chart data visualization will go here.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center space-y-4">
                            <Activity className="w-16 h-16 text-emerald-100" />
                            <h3 className="text-lg font-bold text-gray-900">Time-to-Hire Analytics</h3>
                            <p className="text-sm text-gray-500 text-center">Chart data visualization will go here.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
