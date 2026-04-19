import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Video, CheckCircle, XCircle, Clock, BrainCircuit, Download, FileText, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import html2pdf from 'html2pdf.js';

const Interviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // AI Kit State
    const [kitModalOpen, setKitModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [kitData, setKitData] = useState(null);
    const [loadingKit, setLoadingKit] = useState(false);
    const kitContentRef = useRef(null);

    const fetchInterviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/interviews', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setInterviews(data.data);
            }
        } catch (error) {
            console.error('Error fetching interviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/interviews/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchInterviews(); // refresh layout
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    // --- AI Kit Methods ---
    const handleOpenKitModal = async (interview) => {
        setSelectedInterview(interview);
        setKitData(null);
        setKitModalOpen(true);
        setLoadingKit(true);
        
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:5000/api/kits/${interview._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success && data.data) {
                setKitData(data.data);
            }
        } catch (error) {
            console.error('Error fetching kit:', error);
        } finally {
            setLoadingKit(false);
        }
    };

    const handleGenerateKit = async () => {
        if (!selectedInterview) return;
        setLoadingKit(true);
        
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`http://localhost:5000/api/kits/generate/${selectedInterview._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setKitData(data.data);
            }
        } catch (error) {
            console.error('Error generating kit:', error);
            alert('Failed to generate AI kit');
        } finally {
            setLoadingKit(false);
        }
    };

    const downloadPDF = () => {
        const element = kitContentRef.current;
        if (!element) return;
        
        const opt = {
            margin:       10,
            filename:     `Kit_Entretien_${selectedInterview?.candidate?.name || 'Candidat'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />

            <main className="ml-64 w-full relative">
                <Header />

                <div className="p-8 pt-24 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
                            <p className="text-gray-500 mt-1">Manage scheduled, completed, and cancelled interviews.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : interviews.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No interviews found</h3>
                            <p className="text-gray-500 mt-1">When you schedule interviews, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                                        <th className="p-4 font-medium">Candidate / Job</th>
                                        <th className="p-4 font-medium">Date & Time</th>
                                        <th className="p-4 font-medium">Details</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {interviews.map((interview) => {
                                        const dateObj = new Date(interview.date);
                                        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                                        const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                                        return (
                                            <tr key={interview._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900">{interview.candidate?.name || 'Unknown Candidate'}</div>
                                                    <div className="text-sm text-gray-500">{interview.job?.title || 'General Interview'}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center text-sm font-medium text-gray-900">
                                                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                        {formattedDate}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                        {formattedTime}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {interview.type === 'Online' ? (
                                                        <a href={interview.meetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                                                            <Video className="w-4 h-4 mr-1" /> Join Meeting
                                                        </a>
                                                    ) : (
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <MapPin className="w-4 h-4 mr-1" /> {interview.location}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                                        interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {interview.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleOpenKitModal(interview)}
                                                            className="text-purple-600 hover:text-purple-900 bg-purple-50 p-2 rounded-lg transition-colors flex items-center justify-center group"
                                                            title="AI Interview Kit"
                                                        >
                                                            <BrainCircuit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                        </button>
                                                        {interview.status === 'Scheduled' && (
                                                            <>
                                                                <button 
                                                                    onClick={() => updateStatus(interview._id, 'Completed')}
                                                                    className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg transition-transform hover:scale-105"
                                                                    title="Mark Completed"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => updateStatus(interview._id, 'Cancelled')}
                                                                    className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-transform hover:scale-105"
                                                                    title="Cancel Interview"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* AI Kit Modal */}
            {kitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
                            <div className="flex items-center">
                                <BrainCircuit className="w-6 h-6 text-purple-600 mr-2" />
                                <h2 className="text-xl font-bold text-gray-900">AI Interview Kit</h2>
                                {selectedInterview && (
                                    <span className="ml-3 text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                                        {selectedInterview.candidate?.name}
                                    </span>
                                )}
                            </div>
                            <button onClick={() => setKitModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            {loadingKit ? (
                                <div className="flex flex-col justify-center items-center h-64 text-purple-600">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                                    <p className="font-medium animate-pulse">Generating your intelligent interview kit...</p>
                                </div>
                            ) : !kitData ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <BrainCircuit className="w-16 h-16 text-purple-200 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Kit Generated Yet</h3>
                                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                        Use our AI to automatically analyze {selectedInterview?.candidate?.name}'s CV and the target job profile to generate tailored interview questions and watch-outs.
                                    </p>
                                    <button 
                                        onClick={handleGenerateKit}
                                        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all hover:scale-105"
                                    >
                                        <BrainCircuit className="w-5 h-5 mr-2" />
                                        Generate AI Kit Now
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div ref={kitContentRef} className="p-8">
                                        
                                        {/* Titre PDF */}
                                        <div className="mb-8 pb-6 border-b border-gray-100 flex items-start justify-between">
                                            <div>
                                                <h1 className="text-2xl font-black text-gray-900 mb-1">Dossier d'Entretien</h1>
                                                <p className="text-gray-500 font-medium text-lg">Candidat : {selectedInterview?.candidate?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-1">Smart-ATS AI</p>
                                                <p className="text-xs text-gray-400">Généré le {new Date(kitData.createdAt).toLocaleDateString()} </p>
                                            </div>
                                        </div>

                                        {/* Profil Summary */}
                                        <div className="mb-8">
                                            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-3">
                                                <FileText className="w-5 h-5 text-blue-500 mr-2" /> 
                                                Résumé du Profil
                                            </h3>
                                            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-gray-700 leading-relaxed text-sm">
                                                {kitData.resume_profil}
                                            </div>
                                        </div>

                                        {/* Points de Vigilance */}
                                        <div className="mb-8">
                                            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-3">
                                                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" /> 
                                                Points de Vigilance
                                            </h3>
                                            <ul className="space-y-3">
                                                {kitData.points_vigilance?.map((point, index) => (
                                                    <li key={index} className="flex p-4 bg-red-50/50 border border-red-100 rounded-xl">
                                                        <span className="text-red-500 font-bold mr-3 mt-0.5">•</span>
                                                        <span className="text-gray-700 text-sm">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Questions Suggérées */}
                                        <div>
                                            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-3">
                                                <BrainCircuit className="w-5 h-5 text-purple-500 mr-2" /> 
                                                Questions Suggérées
                                            </h3>
                                            <div className="grid gap-3">
                                                {kitData.questions?.map((q, index) => (
                                                    <div key={index} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:border-purple-200 transition-colors">
                                                        <h4 className="font-bold text-purple-600 text-xs uppercase tracking-wider mb-2">Question {index + 1}</h4>
                                                        <p className="text-gray-800 text-sm font-medium">{q}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {kitData && !loadingKit && (
                            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end">
                                <button 
                                    onClick={downloadPDF}
                                    className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Télécharger PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Interviews;
