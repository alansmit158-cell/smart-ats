import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, Video, MapPin, Clock } from 'lucide-react';

const ScheduleInterviewModal = ({ isOpen, onClose, candidateId, defaultJobId }) => {
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        jobId: defaultJobId || '',
        date: '',
        time: '',
        type: 'Online',
        meetLink: '',
        location: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchJobs();
        }
    }, [isOpen]);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setJobs(data.data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Combine date and time
            const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
            
            const payload = {
                candidateId,
                jobId: formData.jobId || null,
                date: dateTime,
                type: formData.type,
                meetLink: formData.meetLink,
                location: formData.location,
                notes: formData.notes
            };

            await axios.post('http://localhost:5000/api/interviews', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Interview scheduled securely and email sent to candidate!');
            onClose();
        } catch (error) {
            console.error('Error scheduling interview:', error);
            alert('Failed to schedule interview');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" /> Schedule Interview
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Related Job (Optional)</label>
                        <select
                            name="jobId"
                            value={formData.jobId}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                        >
                            <option value="">-- No specific job --</option>
                            {jobs.map(job => (
                                <option key={job._id} value={job._id}>{job.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-gray-400" /> Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-gray-400" /> Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                required
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="type" value="Online" checked={formData.type === 'Online'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span className="ml-2 text-sm text-gray-700 flex items-center"><Video className="w-4 h-4 mr-1" /> Online</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="type" value="In-Person" checked={formData.type === 'In-Person'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span className="ml-2 text-sm text-gray-700 flex items-center"><MapPin className="w-4 h-4 mr-1" /> In-person</span>
                            </label>
                        </div>
                    </div>

                    {formData.type === 'Online' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link (e.g. Google Meet, Zoom)</label>
                            <input
                                type="url"
                                name="meetLink"
                                required
                                value={formData.meetLink}
                                onChange={handleChange}
                                placeholder="https://meet.google.com/..."
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location Details</label>
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Company Office, Room 4B"
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                            />
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors flex items-center"
                        >
                            {loading ? 'Scheduling...' : 'Schedule & Notify'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleInterviewModal;
