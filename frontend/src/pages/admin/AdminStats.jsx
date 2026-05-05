import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Cpu, 
  DollarSign, 
  CircleDot, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ShieldAlert,
  Zap,
  ArrowUpRight,
  Activity,
  UserCheck,
  Crown
} from 'lucide-react';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const AdminStats = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ users: 0, candidates: 0, recruiters: 0, applications: 0, jobs: 0, avgScore: 0 });
    const [users, setUsers] = useState([]);
    const [abonnements, setAbonnements] = useState([]);
    const [workerStats, setWorkerStats] = useState({ activeWorkers: 0, maxWorkers: 3, queueLength: 0, available: 3 });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats (if dashboard/stats is available, fallback to basic calculation)
                const usersRes = await API.get('/admin/users');
                const usersData = usersRes.data.data || [];
                setUsers(usersData);

                const cCount = usersData.filter(u => u.role === 'candidate').length;
                const rCount = usersData.filter(u => u.role === 'recruiter').length;

                setStats({
                    users: usersData.length,
                    candidates: cCount,
                    recruiters: rCount,
                    applications: 0, // Mock for now if no endpoint
                    jobs: 0,         // Mock for now
                    avgScore: 94.2
                });

                // Set mock abonnements for now if endpoint isn't fully returning yet
                setAbonnements([
                    { id: 1, name: 'Alice HR', plan: 'Enterprise', date: '12/12/2024', usage: '42 / ∞', status: 'active' },
                    { id: 2, name: 'Jean Recrute', plan: 'Pro', date: '01/11/2023', usage: '18 / 20', status: 'active' },
                    { id: 3, name: 'Startup Flow', plan: 'Starter', date: '15/10/2023', usage: '5 / 5', status: 'limit_reached' },
                ]);

            } catch (error) {
                toast.error("Erreur de chargement des données Admin");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Worker stats polling
        const fetchWorkerStats = async () => {
            try {
                const res = await API.get('/admin/worker-stats');
                if (res.data.success) {
                    setWorkerStats(res.data.data);
                }
            } catch (err) {
                console.error("Worker stats fetch error");
            }
        };
        fetchWorkerStats();
        const intervalId = setInterval(fetchWorkerStats, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleSuspend = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
            await API.patch(`/admin/users/${userId}/status`, { status: newStatus });
            toast.success(`Compte ${newStatus === 'suspended' ? 'suspendu' : 'réactivé'}`);
            setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
        } catch (error) {
            toast.error("Erreur lors du changement de statut");
        }
    };

    const dashboardStats = [
        { label: 'Utilisateurs Totaux', value: stats.users, sub: `Recruteurs: ${stats.recruiters} | Candidats: ${stats.candidates}`, icon: <Users />, color: 'text-blue-500' },
        { label: 'CV Analysés (IA)', value: '8,924', sub: '+12% ce mois-ci', icon: <FileText />, color: 'text-[#B76E79]' },
        { label: 'Succès Matching', value: `${stats.avgScore}%`, sub: 'Précision du moteur v4.0', icon: <TrendingUp />, color: 'text-emerald-500' },
    ];

    const logs = [
        { time: '10:45', action: 'Recruteur Orange a créé une offre "Dev React"', icon: <Zap size={14} className="text-amber-500" /> },
        { time: '10:30', action: 'Candidat 452 a déposé un CV (PDF)', icon: <FileText size={14} className="text-blue-500" /> },
        { time: '10:15', action: 'Moteur IA : Scoring complété pour #Job88', icon: <Cpu size={14} className="text-[#B76E79]" /> },
    ];

    if (loading) {
        return (
            <div className="space-y-10 animate-pulse">
                <div className="grid grid-cols-3 gap-8">
                    {[1,2,3].map(i => <div key={i} className="h-40 bg-[#1e293b]/30 rounded-[2.5rem] border border-[#1e293b]"></div>)}
                </div>
                <div className="h-64 bg-[#1e293b]/30 rounded-[3rem] border border-[#1e293b]"></div>
                <div className="h-96 bg-[#1e293b]/30 rounded-[3rem] border border-[#1e293b]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Health Check Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {dashboardStats.map((stat, i) => (
                    <div key={i} className="bg-[#1e293b]/30 backdrop-blur-md p-10 rounded-[2.5rem] border border-[#1e293b] hover:border-[#B76E79]/30 transition-all duration-700 group relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#B76E79]/5 transition-all"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-black/40 border border-[#334155] ${stat.color} shadow-2xl shadow-black`}>
                                {stat.icon}
                            </div>
                            <ArrowUpRight size={20} className="text-slate-600 group-hover:text-[#B76E79] transition-colors" />
                        </div>
                        <h3 className="text-3xl font-serif font-black text-white mb-2 tracking-tighter">{stat.value}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#B76E79] mb-1 italic">{stat.label}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Activity Chart Visualization */}
                <div className="lg:col-span-2 bg-[#1e293b]/20 backdrop-blur-3xl p-10 rounded-[3rem] border border-[#1e293b] space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3">
                            <Activity size={20} className="text-[#B76E79]" /> Activité Système (30j)
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Telemetry</span>
                    </div>
                    <div className="h-48 w-full flex items-end gap-1 px-2 pt-8">
                         {[40, 70, 45, 90, 65, 80, 50, 95, 85, 60, 75, 100, 80, 90].map((h, i) => (
                             <div key={i} className="flex-1 group relative">
                                 <div 
                                    className="w-full bg-[#B76E79]/20 rounded-t-lg group-hover:bg-[#B76E79]/50 transition-all duration-700 border-t border-[#B76E79]/30" 
                                    style={{ height: `${h}%` }}
                                 ></div>
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[#B76E79] text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#B76E79]/20">
                                    Value: {h}%
                                 </div>
                             </div>
                         ))}
                    </div>
                    <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">
                        <span>01 MARS</span>
                        <span>15 MARS</span>
                        <span>30 MARS</span>
                    </div>
                </div>

                {/* OpenAI Monitoring Console */}
                <div className="bg-black/40 backdrop-blur-xl p-10 rounded-[3rem] border border-[#1e293b] space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                       <Cpu size={120} />
                    </div>
                    <div className="flex items-center gap-3 border-b border-[#1e293b] pb-6">
                         <div className="w-10 h-10 bg-[#B76E79] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#B76E79]/10">
                            <Cpu size={20} />
                         </div>
                         <div>
                            <h3 className="text-lg font-serif font-bold text-white leading-none">Console OpenAI</h3>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 italic">Status: Online</p>
                         </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Token Usage</span>
                                <span className="text-[#B76E79]">482k / 1M</span>
                             </div>
                             <div className="h-2 w-full bg-[#1e293b] rounded-full overflow-hidden p-0.5 border border-slate-800">
                                <div className="h-full bg-gradient-to-r from-[#B76E79] to-amber-500 rounded-full w-[48%] shadow-[0_0_10px_rgba(183,110,121,0.3)]"></div>
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1e293b]/40 p-5 rounded-2xl border border-[#334155] text-center">
                                <DollarSign size={16} className="mx-auto mb-2 text-emerald-400" />
                                <p className="text-xl font-black text-white">$14.28</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Coût Estimé</p>
                            </div>
                            <div className="bg-[#1e293b]/40 p-5 rounded-2xl border border-[#334155] text-center">
                                <CircleDot size={16} className="mx-auto mb-2 text-blue-400" />
                                <p className="text-xl font-black text-white">4.0o-mini</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Modèle Actif</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Worker Thread Monitor */}
            <div className="bg-[#1e293b]/10 backdrop-blur-md rounded-[3rem] border border-[#1e293b] p-10 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Activity size={100} />
                </div>
                <div className="flex items-center gap-3 border-b border-[#1e293b] pb-6 relative z-10">
                     <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Cpu size={20} />
                     </div>
                     <div>
                        <h3 className="text-lg font-serif font-bold text-white leading-none">Worker Thread Pool</h3>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1 italic">NLP Background Processing</p>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="bg-[#1e293b]/40 p-6 rounded-[2rem] border border-[#334155] flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Workers Actifs</p>
                            <p className="text-3xl font-black text-white">{workerStats.activeWorkers} <span className="text-sm text-slate-500">/ {workerStats.maxWorkers}</span></p>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(workerStats.maxWorkers)].map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full ${i < workerStats.activeWorkers ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1e293b]/40 p-6 rounded-[2rem] border border-[#334155] flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">File d'attente</p>
                            <p className="text-3xl font-black text-white">{workerStats.queueLength}</p>
                        </div>
                        <FileText size={32} className={workerStats.queueLength > 0 ? 'text-amber-500 animate-bounce' : 'text-slate-600'} />
                    </div>

                    <div className="bg-[#1e293b]/40 p-6 rounded-[2rem] border border-[#334155] flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Capacité Libre</p>
                            <p className="text-3xl font-black text-white">{workerStats.available}</p>
                        </div>
                        <Zap size={32} className={workerStats.available > 0 ? 'text-indigo-400' : 'text-slate-600'} />
                    </div>
                </div>
            </div>

            {/* User Management Data Table */}
            <div className="bg-[#1e293b]/10 backdrop-blur-md rounded-[3rem] border border-[#1e293b] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-[#1e293b] flex justify-between items-center bg-[#1e293b]/20">
                     <h3 className="text-xl font-serif font-bold text-white">Gestion des Comptes</h3>
                     <div className="flex gap-4">
                        <button className="bg-white/5 p-3 rounded-xl border border-white/5 text-slate-400 hover:text-[#B76E79] transition-colors"><MoreVertical size={18}/></button>
                     </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#1e293b]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Identité</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Contact</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Rôle</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Actions Deep Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center text-xs font-black text-[#B76E79] border border-[#334155]">{u.nom?.[0] || 'U'}</div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{u.nom}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic">Inscrit le {new Date(u.createdAt).toLocaleDateString('fr-FR')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-slate-400">{u.email}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            u.role === 'admin' ? 'bg-amber-900/20 text-amber-500 border-amber-500/20' : 
                                            u.role === 'recruiter' ? 'bg-blue-900/20 text-blue-500 border-blue-500/20' : 'bg-slate-900/20 text-slate-400 border-slate-700/50'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' || !u.status ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{u.status || 'active'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleSuspend(u._id, u.status)} title={u.status === 'suspended' ? 'Réactiver' : 'Suspendre'} className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-6 text-center text-slate-500 text-sm">Aucun utilisateur trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Subscriptions Management Section */}
            <div className="bg-[#1e293b]/10 backdrop-blur-md rounded-[3rem] border border-[#1e293b] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-[#1e293b] flex justify-between items-center bg-black/20">
                     <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3">
                        <Crown size={20} className="text-amber-500" /> Gestion des Abonnements
                     </h3>
                     <span className="bg-amber-500/10 text-amber-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">Revenue Live: 1,420€</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#1e293b]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Recruteur</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Plan</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Fin d'engagement</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Usage Offres</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]">
                            {abonnements.map((sub) => (
                                <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-white">{sub.name}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            sub.plan === 'Enterprise' ? 'bg-amber-900/20 text-amber-500 border-amber-500/20' : 
                                            sub.plan === 'Pro' ? 'bg-blue-900/20 text-blue-500 border-blue-500/20' : 'bg-slate-900/20 text-slate-400 border-slate-700/50'
                                        }`}>
                                            {sub.plan}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-slate-400">{sub.date}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                                                <span>{sub.usage}</span>
                                            </div>
                                            <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${sub.status === 'limit_reached' ? 'bg-rose-500' : 'bg-[#B76E79]'} w-[80%]`}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button className="text-[10px] font-black text-[#B76E79] uppercase tracking-widest hover:underline">Suspendre</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Audit Logs Flow */}
            <div className="bg-[#1e293b]/5 backdrop-blur-md rounded-[3rem] border border-[#1e293b] p-10 space-y-8">
                <div className="flex items-center gap-3">
                    <Activity size={20} className="text-[#B76E79]" />
                    <h3 className="text-xl font-serif font-bold text-white">Audit Logs : Signal Flux</h3>
                </div>
                <div className="space-y-4">
                    {logs.map((log, i) => (
                        <div key={i} className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#1e293b] transition-all group">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest w-12 italic">{log.time}</p>
                            <div className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center border border-[#1e293b] group-hover:bg-[#B76E79]/10 group-hover:text-[#B76E79] transition-all">
                                {log.icon}
                            </div>
                            <p className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{log.action}</p>
                            <ShieldAlert size={14} className="ml-auto text-slate-800" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
