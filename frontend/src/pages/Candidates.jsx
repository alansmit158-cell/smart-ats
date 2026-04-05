import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Candidates = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, uploading, parsing, success, error
    const [message, setMessage] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (file) => {
        if (file && file.type === 'application/pdf') {
            setFile(file);
            setStatus('idle');
            setParsedData(null);
            setMessage('');
        } else {
            setStatus('error');
            setMessage('Seuls les fichiers PDF sont acceptés.');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('cv', file);

        try {
            // Changement de statut visuel juste pour l'UX
            setTimeout(() => setStatus('parsing'), 1500);

            // Appel API (adapter l'URL si besoin)
            const response = await axios.post('http://localhost:5000/api/candidates/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setStatus('success');
                setParsedData(response.data.data);
                setMessage('CV analysé avec succès !');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Une erreur est survenue lors de l\'analyse.');
        }
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />

            <main className="ml-64 w-full">
                <Header />

                <div className="p-8 pt-24 space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ajouter un Candidat</h1>
                        <p className="text-gray-500 mt-1">Uploadez un CV (PDF) pour extraire automatiquement les informations via l'IA.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Zone d'Upload */}
                        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col h-fit">
                            <div
                                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
                                    ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}
                                    ${file ? 'bg-slate-50 border-solid border-slate-200 cursor-default' : ''}
                                `}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => !file && fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handleFileSelect}
                                />

                                {!file ? (
                                    <>
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                            <UploadCloud className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Glissez et déposez votre PDF</h3>
                                        <p className="text-sm text-gray-500 text-center px-4">
                                            ou cliquez pour parcourir vos fichiers. Taille maximale : 5MB.
                                        </p>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center w-full">
                                        <FileText className="w-12 h-12 text-blue-600 mb-3" />
                                        <p className="text-sm font-medium text-gray-900 mb-1 truncate w-full text-center">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-6">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
                                        </p>

                                        <div className="flex gap-3 w-full justify-center">
                                            <button
                                                onClick={() => setFile(null)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                disabled={status === 'uploading' || status === 'parsing'}
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={handleUpload}
                                                disabled={status === 'uploading' || status === 'parsing' || status === 'success'}
                                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {(status === 'uploading' || status === 'parsing') && <Loader2 className="w-4 h-4 animate-spin" />}
                                                {status === 'idle' || status === 'error' ? 'Analyser avec l\'IA' : 'Analyse en cours...'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Messages */}
                            {message && (
                                <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 border ${status === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                                    {status === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                                    <p className="text-sm font-medium">{message}</p>
                                </div>
                            )}

                            {/* Timeline de progression */}
                            {(status === 'uploading' || status === 'parsing') && (
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status === 'uploading' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-blue-600 text-white'}`}>
                                            {status === 'parsing' ? <CheckCircle className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Lecture extraction du document PDF...</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status === 'parsing' ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                                            {status === 'parsing' && <Loader2 className="w-4 h-4 animate-spin" />}
                                        </div>
                                        <p className={`text-sm font-medium ${status === 'parsing' ? 'text-emerald-700' : 'text-gray-400'}`}>
                                            Analyse sémantique NLP en cours (OpenAI)...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Résultats Parsés */}
                        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm min-h-[500px]">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Données extraites</h2>

                            {!parsedData ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 pb-20">
                                    <BrainIcon />
                                    <p className="mt-4 text-sm font-medium text-center max-w-xs">
                                        Les informations structurées apparaîtront ici après l'analyse IA.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Informations personnelles */}
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Informations Personnelles</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Nom complet</p>
                                                <p className="text-sm font-medium text-slate-900">{parsedData.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Téléphone</p>
                                                <p className="text-sm font-medium text-slate-900">{parsedData.phone || 'Non spécifié'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-slate-500 mb-1">Email</p>
                                                <p className="text-sm font-medium text-slate-900">{parsedData.email || 'Non spécifié'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compétences */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Compétences</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {parsedData.skills?.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                                                    {skill}
                                                </span>
                                            ))}
                                            {(!parsedData.skills || parsedData.skills.length === 0) && (
                                                <span className="text-sm text-gray-500 italic">Aucune compétence extraite.</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expériences */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Expériences</h3>
                                        <div className="space-y-4">
                                            {parsedData.experiences?.map((exp, index) => (
                                                <div key={index} className="border-l-2 border-blue-200 pl-4">
                                                    <h4 className="text-sm font-bold text-slate-900">{exp.poste}</h4>
                                                    <p className="text-xs text-slate-600 mb-1">
                                                        <span className="font-medium text-blue-600">{exp.entreprise}</span> • {exp.duree}
                                                    </p>
                                                    <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Formations */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Formations</h3>
                                        <div className="space-y-3">
                                            {parsedData.formations?.map((form, index) => (
                                                <div key={index} className="bg-white border rounded-lg p-3">
                                                    <h4 className="text-sm font-bold text-slate-900">{form.diplome}</h4>
                                                    <p className="text-xs text-slate-600">
                                                        <span className="font-medium">{form.etablissement}</span> — {form.annee}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Icône décorative
const BrainIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2h5" />
        <path d="M12 2v5" />
        <path d="M10 7a6 6 0 0 0-6 6v1c0 2 1 4 3 4" />
        <path d="M14 7a6 6 0 0 1 6 6v1c0 2-1 4-3 4" />
        <path d="M10 18a2 2 0 1 0 0 4h4a2 2 0 1 0 0-4" />
        <path d="M15.5 14h-7" />
        <path d="M14.5 10h-5" />
    </svg>
);

export default Candidates;
