import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-rose-500/5 blur-[100px]" />

            <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-black overflow-hidden border border-white/10 relative z-10">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-10 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                    <p className="text-blue-100/70 text-sm italic font-medium">Join the next generation of Smart Recruitment.</p>
                </div>
                
                <div className="p-10">
                    {error && (
                        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center">
                            <AlertCircle className="text-rose-400 mr-2" size={20} />
                            <p className="text-rose-200 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                                    <User className="h-5 w-5 text-slate-500" />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-2xl focus:ring-0 focus:border-blue-500/50 bg-white/5 text-white transition-all font-medium outline-none placeholder-slate-600 shadow-inner" 
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-2xl focus:ring-0 focus:border-blue-500/50 bg-white/5 text-white transition-all font-medium outline-none placeholder-slate-600 shadow-inner" 
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Secure Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 border border-white/5 rounded-2xl focus:ring-0 focus:border-blue-500/50 bg-white/5 text-white transition-all font-medium outline-none placeholder-slate-600 shadow-inner" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl shadow-blue-600/20 font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all mt-4"
                        >
                            <UserPlus className="mr-2 h-5 w-5" />
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-sm text-slate-400 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
