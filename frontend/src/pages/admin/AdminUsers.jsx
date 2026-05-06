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
  ExternalLink
} from 'lucide-react';
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
                toast.error("Erreur de chargement des utilisateurs");
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
            toast.success(`Compte ${newStatus === 'suspended' ? 'suspendu' : 'réactivé'}`);
            setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
        } catch (error) {
            toast.error("Erreur lors du changement de statut");
        }
    };

    const filteredUsers = users.filter(u => 
        u.nom?.toLowerCase().includes(search.toLowerCase()) || 
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-20 bg-[#1e293b]/30 rounded-[2rem]"></div>
                <div className="h-96 bg-[#1e293b]/30 rounded-[3rem]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <h1 className="text-3xl font-serif font-black text-white tracking-tighter flex items-center gap-4">
                    <UsersIcon size={32} className="text-[#B76E79]" /> 
                    Gestion de l'Annuaire {(users.length)}
                </h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Rechercher par nom ou email..." 
                            className="w-full bg-[#1e293b]/30 border border-[#1e293b] p-4 pl-12 rounded-2xl text-sm text-white focus:ring-1 focus:ring-[#B76E79] outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-4 bg-[#1e293b]/50 border border-[#1e293b] rounded-2xl text-slate-400 hover:text-white transition-all">
                        <Filter size={18} />
                    </button>
                    <button className="px-6 py-4 bg-[#B76E79] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                        <UserPlus size={16} /> Ajouter
                    </button>
                </div>
            </div>

            {/* Users Grid/Table */}
            <div className="bg-[#1e293b]/10 backdrop-blur-md rounded-[3rem] border border-[#1e293b] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#1e293b] bg-black/20">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Utilisateur</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Contact & Rôle</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status IA</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions Deep Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center text-sm font-black text-[#B76E79] border border-[#334155] shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                {u.nom?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{u.nom}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic">ID: {u._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                                <Mail size={12} /> {u.email}
                                            </div>
                                            <span className={`inline-block px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                u.role === 'admin' ? 'bg-amber-900/20 text-amber-500 border-amber-500/20' : 
                                                u.role === 'recruiter' ? 'bg-blue-900/20 text-blue-500 border-blue-500/20' : 'bg-slate-900/20 text-slate-400 border-slate-700/50'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${u.status === 'active' || !u.status ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{u.status || 'active'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2.5 bg-white/5 text-slate-400 rounded-xl hover:text-white hover:bg-[#B76E79] transition-all"><ExternalLink size={16}/></button>
                                            <button 
                                                onClick={() => handleSuspend(u._id, u.status)}
                                                className={`p-2.5 rounded-xl transition-all ${u.status === 'suspended' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                                            >
                                                {u.status === 'suspended' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                            </button>
                                            <button className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
