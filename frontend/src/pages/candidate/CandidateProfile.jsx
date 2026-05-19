import React, { useState, useEffect } from 'react';
import { 
  User, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Edit, 
  Save, 
  X, 
  Sparkles,
  Shield,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const CandidateProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        nom: '',
        prenom: '',
        skills: [],
        experiences: [],
        formations: [],
        scoreFiabilite: 100
    });
    
    const [newSkill, setNewSkill] = useState('');

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await API.get('/candidates/me');
            if (res.data.success && res.data.data) {
                setProfile(res.data.data);
            } else {
                toast.error("Aucun profil candidat trouvé. Veuillez d'abord téléverser votre CV.");
            }
        } catch (error) {
            console.error("Error fetching profile", error);
            toast.error("Erreur de chargement du profil.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const res = await API.patch('/candidates/me', {
                skills: profile.skills,
                experiences: profile.experiences,
                formations: profile.formations
            });
            if (res.data.success) {
                toast.success("Profil mis à jour avec succès !", {
                    style: { borderRadius: '1rem', background: '#333', color: '#fff' }
                });
                setIsEditing(false);
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;
        if (profile.skills.includes(newSkill.trim())) {
            toast.error("Compétence déjà existante");
            return;
        }
        setProfile({
            ...profile,
            skills: [...profile.skills, newSkill.trim()]
        });
        setNewSkill('');
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfile({
            ...profile,
            skills: profile.skills.filter(s => s !== skillToRemove)
        });
    };

    const handleAddExperience = () => {
        const newExp = { titre: 'Nouveau Poste', entreprise: 'Nouvelle Entreprise', dateDebut: '', dateFin: '', description: '' };
        setProfile({
            ...profile,
            experiences: [...profile.experiences, newExp]
        });
    };

    const handleRemoveExperience = (idx) => {
        setProfile({
            ...profile,
            experiences: profile.experiences.filter((_, i) => i !== idx)
        });
    };

    const handleUpdateExperience = (idx, field, val) => {
        const updated = [...profile.experiences];
        updated[idx][field] = val;
        setProfile({ ...profile, experiences: updated });
    };

    const handleAddFormation = () => {
        const newForm = { diplome: 'Nouveau Diplôme', etablissement: 'Nouvel Établissement', dateDebut: '', dateFin: '' };
        setProfile({
            ...profile,
            formations: [...profile.formations, newForm]
        });
    };

    const handleRemoveFormation = (idx) => {
        setProfile({
            ...profile,
            formations: profile.formations.filter((_, i) => i !== idx)
        });
    };

    const handleUpdateFormation = (idx, field, val) => {
        const updated = [...profile.formations];
        updated[idx][field] = val;
        setProfile({ ...profile, formations: updated });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin text-[#B76E79]" size={40} />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Chargement du profil neural...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Profil */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm flex flex-col md:flex-row items-center gap-10 transition-all duration-500">
                <div className="relative group">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#B76E79] to-[#E5C4A7] rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-serif font-bold shadow-xl shadow-[#B76E79]/20 relative overflow-hidden">
                        {profile.prenom?.[0] || 'C'}{profile.nom?.[0] || 'D'}
                    </div>
                    {!isEditing && (
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                            <Sparkles size={16} className="text-white" />
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">{profile.prenom} {profile.nom}</h1>
                        <p className="text-[#B76E79] font-black uppercase tracking-widest text-xs italic mt-1">Candidat Smart-ATS</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                        <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <Briefcase size={14}/> {profile.experiences?.length || 0} Expériences
                        </span>
                        <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <BookOpen size={14}/> {profile.formations?.length || 0} Formations
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleSave}
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-xl shadow-slate-200"
                            >
                                <Save size={18} /> Enregistrer
                            </button>
                            <button 
                                onClick={() => { fetchProfile(); setIsEditing(false); }}
                                className="bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-200 transition-all"
                            >
                                <X size={18} /> Annuler
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-xl shadow-slate-200"
                        >
                            <Edit size={18} /> Éditer le profil
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Side: Skills & Trust score */}
                <div className="lg:col-span-1 space-y-10">
                    {/* Skills Block */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8">
                        <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3">
                            <Award size={20} className="text-[#B76E79]" /> Compétences
                        </h2>
                        
                        {isEditing && (
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Ajouter compétence..." 
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-100 text-sm p-3 rounded-xl outline-none focus:ring-1 focus:ring-[#B76E79]"
                                />
                                <button 
                                    onClick={handleAddSkill}
                                    className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {profile.skills?.map((skill, idx) => (
                                <span 
                                    key={idx} 
                                    className="flex items-center gap-2 bg-[#FAFAFA] border border-slate-50 text-xs font-bold text-slate-700 px-4 py-2 rounded-xl"
                                >
                                    {skill}
                                    {isEditing && (
                                        <button onClick={() => handleRemoveSkill(skill)} className="text-rose-500 hover:text-rose-700">
                                            <X size={12} />
                                        </button>
                                    )}
                                </span>
                            ))}
                            {(!profile.skills || profile.skills.length === 0) && (
                                <p className="text-xs text-slate-400 italic">Aucune compétence listée.</p>
                            )}
                        </div>
                    </div>

                    {/* Trust score */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8 relative overflow-hidden">
                        <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3">
                            <TrendingUp size={20} className="text-emerald-500" /> Score de Performance IA
                        </h2>
                        <div className="flex items-center gap-10">
                            <div className="relative w-24 h-24 flex-shrink-0">
                               <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (profile.scoreFiabilite || 100)) / 100} className="text-[#B76E79] drop-shadow-lg" strokeLinecap="round" />
                               </svg>
                               <div className="absolute inset-0 flex items-center justify-center font-serif font-black text-2xl text-slate-800">{profile.scoreFiabilite || 100}%</div>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-600 block">Indice de Fiabilité</span>
                                <span className="text-[10px] text-slate-400 block mt-1">Calculé sémantiquement par l'IA sur l'ensemble de votre profil.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Professional History & Academic Pathway */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Experiences */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3">
                                <Briefcase size={20} className="text-[#B76E79]" /> Expériences Professionnelles
                            </h2>
                            {isEditing && (
                                <button 
                                    onClick={handleAddExperience}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                                >
                                    <Plus size={14} /> Ajouter
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {profile.experiences?.map((exp, idx) => (
                                <div key={idx} className="bg-[#FAFAFA] p-6 rounded-2xl border border-slate-50 relative group space-y-4">
                                    {isEditing && (
                                        <button 
                                            onClick={() => handleRemoveExperience(idx)}
                                            className="absolute top-4 right-4 text-rose-500 hover:text-rose-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input 
                                                    type="text" 
                                                    placeholder="Titre du poste"
                                                    value={exp.titre || ''} 
                                                    onChange={(e) => handleUpdateExperience(idx, 'titre', e.target.value)}
                                                    className="w-full bg-white border border-slate-100 text-xs p-3 rounded-xl outline-none"
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Entreprise"
                                                    value={exp.entreprise || ''} 
                                                    onChange={(e) => handleUpdateExperience(idx, 'entreprise', e.target.value)}
                                                    className="w-full bg-white border border-slate-100 text-xs p-3 rounded-xl outline-none"
                                                />
                                            </div>
                                            <textarea 
                                                placeholder="Description des tâches"
                                                value={exp.description || ''} 
                                                onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                                                className="w-full bg-white border border-slate-100 text-xs p-3 rounded-xl outline-none h-20 resize-none"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{exp.titre} chez <span className="text-[#B76E79]">{exp.entreprise}</span></h4>
                                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed italic">{exp.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(!profile.experiences || profile.experiences.length === 0) && (
                                <p className="text-xs text-slate-400 italic">Aucune expérience répertoriée.</p>
                            )}
                        </div>
                    </div>

                    {/* Formations */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-3">
                                <BookOpen size={20} className="text-[#B76E79]" /> Parcours Académique
                            </h2>
                            {isEditing && (
                                <button 
                                    onClick={handleAddFormation}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                                >
                                    <Plus size={14} /> Ajouter
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {profile.formations?.map((form, idx) => (
                                <div key={idx} className="bg-[#FAFAFA] p-6 rounded-2xl border border-slate-50 relative group space-y-4">
                                    {isEditing && (
                                        <button 
                                            onClick={() => handleRemoveFormation(idx)}
                                            className="absolute top-4 right-4 text-rose-500 hover:text-rose-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    {isEditing ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <input 
                                                type="text" 
                                                placeholder="Diplôme"
                                                value={form.diplome || ''} 
                                                onChange={(e) => handleUpdateFormation(idx, 'diplome', e.target.value)}
                                                className="w-full bg-white border border-slate-100 text-xs p-3 rounded-xl outline-none"
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="Établissement"
                                                value={form.etablissement || ''} 
                                                onChange={(e) => handleUpdateFormation(idx, 'etablissement', e.target.value)}
                                                className="w-full bg-white border border-slate-100 text-xs p-3 rounded-xl outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{form.diplome}</h4>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider italic mt-1">{form.etablissement}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(!profile.formations || profile.formations.length === 0) && (
                                <p className="text-xs text-slate-400 italic">Aucune formation répertoriée.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
