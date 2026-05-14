import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Shield, 
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader2,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await API.get('/admin/users');
                setUsers(res.data.data || []);
            } catch (error) {
                toast.error("Network synchronization error", {
                    icon: '🚨',
                    style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSuspend = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
            await API.patch(`/admin/users/${userId}/status`, { status: newStatus });
            toast.success(`Node ${newStatus === 'suspended' ? 'isolated' : 'synchronized'}`, {
                icon: newStatus === 'suspended' ? '🔒' : '✅',
                style: { borderRadius: '20px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
            setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const filteredUsers = users.filter(u => 
        u.nom?.toLowerCase().includes(search.toLowerCase()) || 
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] italic">Scanning Node Directory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

            {/* Header Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/20 mb-3"
                    >
                        <ShieldCheck size={12} /> Deep Control Access
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-5">
                        User <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 italic">Directory</span>
                        <span className="text-sm font-black text-slate-600 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{users.length} Nodes</span>
                    </h1>
                </div>

                <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Filter by name, email or node ID..." 
                            className="w-full bg-white/5 border border-white/5 p-4 pl-14 rounded-2xl text-sm font-medium text-white placeholder-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-inner group-focus-within:bg-white/[0.08]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl backdrop-blur-md">
                        <Filter size={20} />
                    </button>
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/20">
                        <UserPlus size={18} /> Initialize Node
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { label: 'Active Sessions', val: '42', icon: <Activity size={20} />, color: 'text-emerald-400' },
                    { label: 'Isolation Zone', val: users.filter(u => u.status === 'suspended').length, icon: <Lock size={20} />, color: 'text-rose-400' },
                    { label: 'Neural Syncs', val: '1.2k', icon: <Cpu size={20} />, color: 'text-blue-400' },
                    { label: 'Threat Level', val: 'Low', icon: <Zap size={20} />, color: 'text-amber-400' },
                ].map((m, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="bg-white/5 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 flex items-center gap-5 hover:border-white/20 transition-all shadow-2xl"
                    >
                        <div className={`p-3.5 rounded-xl bg-white/5 border border-white/10 ${m.color} shadow-lg`}>{m.icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-white tracking-tighter">{m.val}</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 italic font-bold">{m.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -z-10"></div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Identity Matrix</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Sync Channels</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Protocol Status</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 text-right">Deep Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((u, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={u._id} 
                                    className="hover:bg-white/[0.03] transition-all group"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-sm font-black text-blue-400 border border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-700 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <span className="relative z-10">{u.nom?.[0] || 'U'}</span>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">{u.nom}</p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.1em] italic mt-1 flex items-center gap-2">
                                                   <span className="text-blue-500/50">NODE_ID:</span> {u._id.slice(-12).toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-slate-400 text-xs font-medium italic">
                                                <Mail size={14} className="text-blue-500/40" /> {u.email}
                                            </div>
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                u.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                                u.role === 'recruiter' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-white/10'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${u.status === 'active' || !u.status ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-rose-500 animate-pulse shadow-rose-500/40'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic font-bold">{u.status || 'active'}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <button className="p-3 bg-white/5 text-slate-600 rounded-xl hover:text-white hover:bg-white/10 transition-all shadow-xl"><ExternalLink size={18}/></button>
                                            <button 
                                                onClick={() => handleSuspend(u._id, u.status)}
                                                title={u.status === 'suspended' ? 'Sync Node' : 'Isolate Node'}
                                                className={`p-3 rounded-xl transition-all shadow-xl ${u.status === 'suspended' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                                            >
                                                {u.status === 'suspended' ? <CheckCircle size={18}/> : <XCircle size={18}/>}
                                            </button>
                                            <button className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-xl"><Trash2 size={18}/></button>
                                            <button className="text-slate-800 hover:text-white p-2 transition-colors"><MoreVertical size={22}/></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 italic">Encrypted Connection • Deep Scan Layer 7</p>
                    <div className="flex gap-4">
                        <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Prev</button>
                        <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
