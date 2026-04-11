import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    UploadCloud, FileText, CheckCircle, AlertCircle, Loader2,
    Users, Search, Mail, Phone, ChevronDown, ChevronUp, X, Plus
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// ─── Candidate Profile Card ───────────────────────────────────────────────────
const CandidateCard = ({ candidate }) => {
    const [expanded, setExpanded] = useState(false);
    const initials = candidate.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
    const colorIndex = candidate.name?.charCodeAt(0) % colors.length || 0;

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                {/* Avatar */}
                <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${colors[colorIndex]}`}>
                    {initials}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{candidate.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                        {candidate.email && (
                            <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                <Mail size={10} />{candidate.email}
                            </span>
                        )}
                        {candidate.phone && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone size={10} />{candidate.phone}
                            </span>
                        )}
                    </div>
                </div>
                {/* Skills count + toggle */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {candidate.skills?.length > 0 && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                            {candidate.skills.length} skills
                        </span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">
                    {/* Skills */}
                    {candidate.skills?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Compétences</p>
                            <div className="flex flex-wrap gap-1.5">
                                {candidate.skills.map((skill, i) => (
                                    <span key={i} className="px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experiences */}
                    {candidate.experiences?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expériences</p>
                            <div className="space-y-2">
                                {candidate.experiences.map((exp, i) => (
                                    <div key={i} className="border-l-2 border-blue-200 pl-3">
                                        <p className="text-sm font-semibold text-gray-900">{exp.poste}</p>
                                        <p className="text-xs text-gray-500">{exp.entreprise} {exp.duree && `· ${exp.duree}`}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Formations */}
                    {candidate.formations?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Formations</p>
                            <div className="space-y-1.5">
                                {candidate.formations.map((form, i) => (
                                    <div key={i} className="text-sm">
                                        <span className="font-semibold text-gray-900">{form.diplome}</span>
                                        <span className="text-gray-500"> — {form.etablissement} {form.annee && `(${form.annee})`}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-[10px] text-gray-300">Ajouté le {new Date(candidate.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
            )}
        </div>
    );
};

// ─── Upload Zone Component ────────────────────────────────────────────────────
const UploadZone = ({ onSuccess }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const fileInputRef = useRef(null);

    const validateAndSetFile = (f) => {
        if (f && f.type === 'application/pdf') {
            setFile(f); setStatus('idle'); setParsedData(null); setMessage('');
        } else {
            setStatus('error'); setMessage('Seuls les fichiers PDF sont acceptés.');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setStatus('uploading');
        const formData = new FormData();
        formData.append('cv', file);
        try {
            setTimeout(() => setStatus('parsing'), 1500);
            const response = await axios.post('http://localhost:5000/api/candidates/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                setStatus('success');
                setParsedData(response.data.data);
                setMessage('CV analysé et sauvegardé avec succès !');
                onSuccess(); // Refresh candidate list
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Une erreur est survenue lors de l\'analyse.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Plus size={16} className="text-blue-600" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Ajouter un candidat</h2>
            </div>

            <div
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
                    ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}
                    ${file ? 'bg-slate-50 border-solid border-slate-200 cursor-default' : ''}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); validateAndSetFile(e.dataTransfer.files[0]); }}
                onClick={() => !file && fileInputRef.current?.click()}
            >
                <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={(e) => validateAndSetFile(e.target.files[0])} />

                {!file ? (
                    <>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                            <UploadCloud className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Glissez votre PDF ici</h3>
                        <p className="text-xs text-gray-400">ou cliquez · Max 5MB</p>
                    </>
                ) : (
                    <div className="flex flex-col items-center w-full">
                        <FileText className="w-10 h-10 text-blue-600 mb-2" />
                        <p className="text-sm font-medium text-gray-900 mb-0.5 truncate w-full text-center">{file.name}</p>
                        <p className="text-xs text-gray-400 mb-5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <div className="flex gap-2 w-full justify-center">
                            <button
                                onClick={() => setFile(null)}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                disabled={status === 'uploading' || status === 'parsing'}
                            >
                                <X size={12} className="inline mr-1" />Annuler
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={status === 'uploading' || status === 'parsing' || status === 'success'}
                                className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
                            >
                                {(status === 'uploading' || status === 'parsing') && <Loader2 className="w-3 h-3 animate-spin" />}
                                {status === 'idle' || status === 'error' ? 'Analyser avec l\'IA' : 'Analyse...'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {message && (
                <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 border text-xs ${status === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                    {status === 'error' ? <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                    {message}
                </div>
            )}

            {(status === 'uploading' || status === 'parsing') && (
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${status === 'uploading' ? 'bg-blue-100' : 'bg-blue-600'}`}>
                            {status === 'parsing' ? <CheckCircle className="w-3 h-3 text-white" /> : <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />}
                        </div>
                        <p className="text-xs text-gray-600">Extraction du texte PDF...</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${status === 'parsing' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                            {status === 'parsing' && <Loader2 className="w-3 h-3 text-emerald-600 animate-spin" />}
                        </div>
                        <p className={`text-xs ${status === 'parsing' ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>Analyse NLP via OpenAI...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main Candidates Page ─────────────────────────────────────────────────────
const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchCandidates = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/candidates');
            if (data.success) setCandidates(data.data);
        } catch (err) {
            console.error('Erreur chargement candidats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCandidates(); }, []);

    const filtered = candidates.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />

            <main className="ml-64 w-full">
                <Header />

                <div className="p-8 pt-24">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Candidats</h1>
                            <p className="text-gray-500 mt-1 text-sm">Uploadez des CVs et consultez les profils analysés par l'IA.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Upload + Stats */}
                        <div className="lg:col-span-1 space-y-4">
                            <UploadZone onSuccess={fetchCandidates} />

                            {/* Stats mini-card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <Users size={18} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
                                        <p className="text-xs text-gray-500">Candidat(s) dans la base</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Candidate Directory */}
                        <div className="lg:col-span-2">
                            {/* Search Bar */}
                            <div className="relative mb-4">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, email ou compétence..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                />
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-16">
                                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                                    <Users className="mx-auto h-10 w-10 text-gray-200 mb-3" />
                                    <p className="text-gray-500 text-sm font-medium">
                                        {search ? 'Aucun candidat ne correspond à votre recherche.' : 'Aucun candidat pour le moment.'}
                                    </p>
                                    {!search && <p className="text-gray-400 text-xs mt-1">Uploadez votre premier CV pour démarrer.</p>}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filtered.map(candidate => (
                                        <CandidateCard key={candidate._id} candidate={candidate} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Candidates;
