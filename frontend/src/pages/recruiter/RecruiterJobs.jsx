import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Sparkles, 
  MoreVertical,
  MapPin,
  Edit2,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const RecruiterJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    
    const [formData, setFormData] = useState({
        titre: '',
        lieu: '',
        salaire: '',
        description: '',
        competences: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Erreur lors du chargement des offres');
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/jobs', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Offre créée avec succès');
            setShowCreateModal(false);
            resetForm();
            fetchJobs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la création');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/jobs/${selectedJob._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Offre mise à jour');
            setShowEditModal(false);
            fetchJobs();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/jobs/${selectedJob._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Offre supprimée');
            setShowDeleteModal(false);
            fetchJobs();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const openEditModal = (job) => {
        setSelectedJob(job);
        setFormData({
            titre: job.titre,
            lieu: job.lieu,
            salaire: job.salaire,
            description: job.description,
            competences: job.competences
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (job) => {
        setSelectedJob(job);
        setShowDeleteModal(true);
    };

    const resetForm = () => {
        setFormData({
            titre: '',
            lieu: '',
            salaire: '',
            description: '',
            competences: ''
        });
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B76E79] mb-2 pl-1">Talent Management</h2>
                    <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Gestion des Offres d'Emploi</h1>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowCreateModal(true); }}
                    className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 hover:shadow-2xl hover:shadow-slate-200 transition-all active:scale-95"
                >
                    <Plus size={18} /> Nouvelle Offre
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Offres Actives', value: jobs.length, icon: <Briefcase className="text-[#B76E79]" /> },
                    { label: 'Candidatures Total', value: '1,284', icon: <Users className="text-blue-500" /> },
                    { label: 'Matching Moyen', value: '82%', icon: <Sparkles className="text-amber-500" /> },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center gap-6 hover:translate-y-[-5px] transition-all duration-500 group"
                    >
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-50 group-hover:bg-[#B76E79]/5 transition-colors">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-3xl font-serif font-black text-slate-900 tracking-tighter">{stat.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 italic">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Jobs Management Table */}
            <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="font-serif font-bold text-lg text-slate-800">Catalogue des Postes</h3>
                    <div className="flex gap-2">
                        <span className="px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Temps réel</span>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Détails du Poste</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Localisation</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Salaire</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-12 text-center text-slate-400 italic">Chargement des offres...</td>
                                </tr>
                            ) : jobs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-12 text-center text-slate-400 italic">Aucune offre disponible.</td>
                                </tr>
                            ) : jobs.map((job, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={job._id} 
                                    className="hover:bg-[#B76E79]/5 transition-colors group cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-800 group-hover:text-[#B76E79] transition-colors">{job.titre}</p>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Créée le {new Date(job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <MapPin size={14} className="text-[#B76E79] opacity-50" /> {job.lieu}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <span className="text-sm font-black text-slate-800">{job.salaire}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right pr-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openEditModal(job)}
                                                className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-blue-500"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => openDeleteModal(job)}
                                                className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-rose-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals Container */}
            <AnimatePresence>
                {(showCreateModal || showEditModal) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 lg:p-12 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-slate-900">
                                            {showEditModal ? 'Modifier l\'Opportunité' : 'Nouvelle Opportunité'}
                                        </h3>
                                        <p className="text-slate-400 text-xs mt-1 font-medium italic">Un design ultra-élégant pour vos offres de luxe.</p>
                                    </div>
                                    <button 
                                        onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} 
                                        className="p-2 hover:bg-slate-50 rounded-2xl transition-colors text-slate-300 hover:text-slate-900"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={showEditModal ? handleUpdate : handleCreate} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Titre du Poste</label>
                                        <input 
                                            required
                                            value={formData.titre}
                                            onChange={(e) => setFormData({...formData, titre: e.target.value})}
                                            type="text" 
                                            className="w-full bg-[#FAFAFA] border-none rounded-2xl p-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-[#B76E79]/20 outline-none" 
                                            placeholder="ex. Creative UI Specialist" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Localisation</label>
                                            <input 
                                                required
                                                value={formData.lieu}
                                                onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                                                type="text" 
                                                className="w-full bg-[#FAFAFA] border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#B76E79]/20 outline-none" 
                                                placeholder="Remote, Paris, Tunis..." 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Salaire (Annuel)</label>
                                            <input 
                                                required
                                                value={formData.salaire}
                                                onChange={(e) => setFormData({...formData, salaire: e.target.value})}
                                                type="text" 
                                                className="w-full bg-[#FAFAFA] border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#B76E79]/20 outline-none" 
                                                placeholder="ex. 45k - 60k €"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Description Stratégique</label>
                                        <textarea 
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            rows={3} 
                                            className="w-full bg-[#FAFAFA] border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#B76E79]/20 outline-none resize-none" 
                                            placeholder="Décrivez les enjeux et les missions du poste..."
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Compétences (Clés)</label>
                                        <input 
                                            required
                                            value={formData.competences}
                                            onChange={(e) => setFormData({...formData, competences: e.target.value})}
                                            type="text" 
                                            className="w-full bg-[#FAFAFA] border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#B76E79]/20 outline-none" 
                                            placeholder="ex. React, Figma, Tailwind, Node.js" 
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all">
                                            {showEditModal ? 'Mettre à jour' : 'Publier l\'offre'}
                                        </button>
                                        <button 
                                            type="button"
                                            className="px-8 border border-slate-100 rounded-2xl text-slate-400 font-bold text-xs hover:bg-slate-50 transition-colors" 
                                            onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center space-y-6 border border-[#B76E79]/20"
                        >
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={40} className="text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-slate-900">Confirmer la suppression ?</h3>
                            <p className="text-slate-500 text-sm italic font-medium">
                                Cette action est irréversible. L'offre <span className="font-bold text-slate-800">"{selectedJob?.titre}"</span> sera définitivement retirée de la plateforme.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                                >
                                    Supprimer
                                </button>
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 border-2 border-[#B76E79]/30 text-[#B76E79] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Garder
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecruiterJobs;
