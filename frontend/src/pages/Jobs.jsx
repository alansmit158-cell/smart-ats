import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus, Briefcase, MapPin, Building, AlertCircle, X,
    Sparkles, Loader2, Trophy, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// ─── Score Badge ─────────────────────────────────────────────────────────────
const ScoreBadge = ({ score }) => {
    let color, Icon;
    if (score >= 80) { color = 'text-emerald-700 bg-emerald-50 border-emerald-200'; Icon = Trophy; }
    else if (score >= 60) { color = 'text-blue-700 bg-blue-50 border-blue-200'; Icon = CheckCircle; }
    else if (score >= 40) { color = 'text-amber-700 bg-amber-50 border-amber-200'; Icon = AlertTriangle; }
    else { color = 'text-red-700 bg-red-50 border-red-200'; Icon = XCircle; }

    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${color}`}>
            <Icon size={12} />
            {score}%
        </div>
    );
};

// ─── Match Result Card ────────────────────────────────────────────────────────
const MatchCard = ({ match, rank }) => {
    const [expanded, setExpanded] = useState(rank <= 2);

    const recoBg = {
        STRONGLY_RECOMMEND: 'bg-emerald-500',
        RECOMMEND: 'bg-blue-500',
        CONSIDER: 'bg-amber-500',
        NOT_RECOMMENDED: 'bg-red-500',
    }[match.recommendation] || 'bg-gray-400';

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-4 flex items-center gap-4">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-400' : rank === 3 ? 'bg-amber-600' : 'bg-gray-200 text-gray-500'}`}>
                    {rank}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate">{match.candidateName}</p>
                        <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${recoBg}`}>
                            {match.recommendation?.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{match.candidateEmail || 'Email non renseigné'}</p>
                </div>
                {/* Score */}
                <div className="flex items-center gap-3">
                    <ScoreBadge score={match.score} />
                    <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Score Bar */}
            <div className="px-4 pb-3">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${match.score >= 80 ? 'bg-emerald-500' : match.score >= 60 ? 'bg-blue-500' : match.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${match.score}%` }}
                    />
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                    <p className="text-sm text-gray-600 italic">"{match.summary}"</p>

                    {match.strengths?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">✅ Points Forts</p>
                            <ul className="space-y-1">
                                {match.strengths.map((s, i) => (
                                    <li key={i} className="text-xs text-emerald-700 bg-emerald-50 rounded px-2 py-1">{s}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {match.gaps?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">⚠️ Lacunes</p>
                            <ul className="space-y-1">
                                {match.gaps.map((g, i) => (
                                    <li key={i} className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">{g}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {match.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {match.skills.slice(0, 5).map((skill, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">{skill}</span>
                            ))}
                            {match.skills.length > 5 && (
                                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">+{match.skills.length - 5}</span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main Jobs Page ───────────────────────────────────────────────────────────
const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Create Job form state
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Full-time');
    const [error, setError] = useState('');

    // Matching state
    const [matchingJobId, setMatchingJobId] = useState(null);
    const [matchingJob, setMatchingJob] = useState(null);
    const [matchResults, setMatchResults] = useState([]);
    const [isMatching, setIsMatching] = useState(false);
    const [matchError, setMatchError] = useState('');

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

    useEffect(() => { fetchJobs(); }, []);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/jobs', { title, department, location, description, type });
            setShowModal(false);
            setTitle(''); setDepartment(''); setLocation(''); setDescription(''); setType('Full-time');
            fetchJobs();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating job');
        }
    };

    const handleFindMatches = async (job) => {
        setMatchingJobId(job._id);
        setMatchingJob(job);
        setMatchResults([]);
        setMatchError('');
        setIsMatching(true);

        try {
            const { data } = await axios.post(`http://localhost:5000/api/matching/job/${job._id}`);
            if (data.success) {
                setMatchResults(data.data);
            }
        } catch (err) {
            setMatchError(err.response?.data?.message || 'Erreur lors du matching IA.');
        } finally {
            setIsMatching(false);
        }
    };

    const closeMatchPanel = () => {
        setMatchingJobId(null);
        setMatchingJob(null);
        setMatchResults([]);
        setMatchError('');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <Header />

                <div className="flex flex-1 overflow-hidden pt-16">
                    {/* Jobs List */}
                    <main className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${matchingJobId ? 'w-1/2' : 'w-full'}`}>
                        <div className="max-w-7xl mx-auto">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Offres d'Emploi</h1>
                                    <p className="text-gray-500 text-sm mt-1">{jobs.length} offre(s) active(s)</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Créer une offre
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center p-12">
                                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                                </div>
                            ) : jobs.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                                    <Briefcase className="mx-auto h-12 w-12 text-gray-200 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune offre trouvée</h3>
                                    <p className="text-sm">Créez votre première offre d'emploi pour démarrer.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {jobs.map(job => (
                                        <div
                                            key={job._id}
                                            className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-6 ${matchingJobId === job._id ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100'}`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1 mr-2">{job.title}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-600'}`}>
                                                    {job.status}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5 mb-4">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Building size={14} className="mr-2 text-gray-400" />{job.department}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin size={14} className="mr-2 text-gray-400" />{job.location}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Briefcase size={14} className="mr-2 text-gray-400" />{job.type}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-5">{job.description}</p>

                                            <button
                                                onClick={() => handleFindMatches(job)}
                                                disabled={isMatching && matchingJobId === job._id}
                                                className="w-full py-2 text-sm font-medium flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-60 shadow-sm"
                                            >
                                                {isMatching && matchingJobId === job._id ? (
                                                    <><Loader2 size={14} className="animate-spin" /> Analyse IA en cours...</>
                                                ) : (
                                                    <><Sparkles size={14} /> Trouver les meilleurs candidats</>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Matching Results Panel */}
                    {matchingJobId && (
                        <div className="w-[420px] flex-shrink-0 border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
                            {/* Panel Header */}
                            <div className="p-5 bg-white border-b border-gray-200 flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles size={16} className="text-blue-600" />
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">AI Matching</span>
                                    </div>
                                    <h2 className="text-base font-bold text-gray-900 line-clamp-1">{matchingJob?.title}</h2>
                                    {!isMatching && matchResults.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">{matchResults.length} candidat(s) analysés · Triés par score</p>
                                    )}
                                </div>
                                <button onClick={closeMatchPanel} className="text-gray-400 hover:text-gray-600 ml-4 mt-1">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Panel Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {isMatching && (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                            <Sparkles size={28} className="text-blue-400 animate-pulse" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">Analyse Sémantique IA...</p>
                                        <p className="text-xs text-gray-400 mt-1">Comparaison de tous les profils en cours</p>
                                    </div>
                                )}

                                {matchError && (
                                    <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-4 rounded-lg flex items-start gap-3">
                                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                                        {matchError}
                                    </div>
                                )}

                                {!isMatching && matchResults.length === 0 && !matchError && (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                        <p className="text-sm">Aucun candidat dans la base de données.</p>
                                        <p className="text-xs mt-1">Uploadez des CVs d'abord.</p>
                                    </div>
                                )}

                                {matchResults.map((match, index) => (
                                    <MatchCard key={match.candidateId} match={match} rank={index + 1} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Job Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">Créer une offre d'emploi</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-100 p-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}
                            <form onSubmit={handleCreateJob} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre du poste *</label>
                                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" placeholder="ex. Développeur Full Stack Senior" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
                                        <input required type="text" value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" placeholder="ex. Engineering" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
                                        <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" placeholder="ex. Remote, Paris" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                                    <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Stage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                    <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none" placeholder="Décrivez le poste, les responsabilités et les compétences requises..." />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button>
                                    <button type="submit" className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors">Créer l'offre</button>
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
