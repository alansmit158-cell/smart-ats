import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Briefcase, MapPin, Building, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Form fields
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Full-time');
    
    const [error, setError] = useState('');

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/jobs');
            setJobs(data);
        } catch (err) {
            console.error('Error fetching jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/jobs', {
                title, department, location, description, type
            });
            setShowModal(false);
            // Reset form
            setTitle(''); setDepartment(''); setLocation(''); setDescription(''); setType('Full-time');
            // Refresh list
            fetchJobs();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating job');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col pt-16">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">Available Jobs</h1>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <Plus size={18} className="mr-2" />
                                Create New Job
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                                <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
                                <p>Get started by creating a new job posting.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {jobs.map(job => (
                                    <div key={job._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                {job.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Building size={16} className="mr-2 text-gray-400" />
                                                {job.department}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin size={16} className="mr-2 text-gray-400" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Briefcase size={16} className="mr-2 text-gray-400" />
                                                {job.type}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-3 mb-6">
                                            {job.description}
                                        </p>
                                        <button className="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Create Job Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Create New Job Posting</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>
                        
                        <div className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-md flex items-center">
                                    <AlertCircle className="text-red-500 mr-2" size={18} />
                                    <p className="text-red-700 text-xs font-medium">{error}</p>
                                </div>
                            )}
                            
                            <form onSubmit={handleCreateJob} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Senior Frontend Developer" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <input required type="text" value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Engineering" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Remote, Paris" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                    <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Describe the role and responsibilities..."></textarea>
                                </div>
                                <div className="pt-4 flex justify-end space-x-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                    <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors">Create Job</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;
