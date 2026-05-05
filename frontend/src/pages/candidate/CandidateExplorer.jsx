import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, Sparkles, ChevronRight, BookmarkPlus, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CandidateExplorer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);

    // Mock data for demo purposes until API is connected
    useEffect(() => {
        setJobs([
            { id: 1, title: 'Senior React Developer', company: 'TechNova', location: 'Paris, FR', type: 'CDI', salary: '65k - 80k', match: 94, tags: ['React', 'Node.js', 'TypeScript'] },
            { id: 2, title: 'Full Stack Engineer', company: 'LuxeCorp', location: 'Remote', type: 'CDI', salary: '70k - 90k', match: 88, tags: ['Vue', 'Python', 'AWS'] },
            { id: 3, title: 'Frontend Designer', company: 'CreativStudio', location: 'Lyon, FR', type: 'Freelance', salary: '400€/jour', match: 75, tags: ['Figma', 'React', 'CSS'] }
        ]);
    }, []);

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Briefcase size={120} className="text-[#B76E79]" />
                </div>
                <div className="relative z-10 max-w-2xl space-y-4">
                    <span className="bg-[#B76E79]/10 text-[#B76E79] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#B76E79]/20">
                        Explorer Offres
                    </span>
                    <h1 className="text-4xl font-serif font-black text-slate-900 leading-tight">
                        Trouvez l'opportunité qui vous correspond avec l'<span className="text-[#B76E79] italic">IA</span>.
                    </h1>
                    <p className="text-slate-500 font-medium">Découvrez les offres les plus pertinentes basées sur l'analyse sémantique de votre CV.</p>
                </div>

                {/* Search Bar */}
                <div className="mt-10 flex gap-4 relative z-10">
                    <div className="flex-1 bg-slate-50 p-2 rounded-2xl border border-slate-100 flex items-center gap-4 focus-within:border-[#B76E79]/50 focus-within:bg-white transition-all shadow-sm">
                        <div className="pl-4">
                            <Search className="text-slate-400" size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Rechercher par métier, compétence ou entreprise..."
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-700 font-medium placeholder:text-slate-400 py-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-slate-900 text-white px-8 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                        <Filter size={18} /> Filtres
                    </button>
                </div>
            </div>

            {/* AI Matches Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
                            <Sparkles className="text-[#B76E79]" size={24} /> 
                            Recommandations IA
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Offres triées par taux de compatibilité sémantique.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase())).map((job) => (
                        <motion.div 
                            key={job.id}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#B76E79]/10 transition-all group relative cursor-pointer"
                        >
                            <div className="absolute top-8 right-8 text-slate-300 group-hover:text-[#B76E79] transition-colors">
                                <ArrowUpRight size={24} />
                            </div>

                            {/* Match Score */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center">
                                    <span className="text-emerald-600 font-black text-sm">{job.match}%</span>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600">Match Sémantique</p>
                                    <p className="text-[10px] font-bold text-slate-400 italic">Basé sur votre CV</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-[#B76E79] transition-colors">{job.title}</h3>
                                <p className="text-sm font-bold text-slate-500">{job.company}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-1">
                                    <MapPin size={12} /> {job.location}
                                </span>
                                <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                                    {job.type}
                                </span>
                                <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                                    {job.salary}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {job.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-[#B76E79] bg-[#B76E79]/10 px-2 py-1 rounded border border-[#B76E79]/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-slate-50">
                                <button className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#B76E79] transition-colors shadow-lg shadow-slate-900/10">
                                    Postuler
                                </button>
                                <button className="p-3 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-colors">
                                    <BookmarkPlus size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CandidateExplorer;
