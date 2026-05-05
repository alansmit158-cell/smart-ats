import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await login(email, password);
            toast.success('Connexion réussie !', { icon: '✨' });
            
            // Logique de redirection selon le rôle
            if (data.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else if (data.role === 'admin') {
                navigate('/admin/stats');
            } else {
                navigate('/candidate/portal');
            }
        } catch (err) {
            toast.error(err || 'Identifiants incorrects');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-4 relative overflow-hidden">
            <Toaster position="top-right" />
            
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#B76E79]/10 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-[#B76E79]/5 blur-[80px]" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full bg-white/60 backdrop-blur-md rounded-[3rem] shadow-2xl shadow-[#B76E79]/10 overflow-hidden border border-white"
            >
                <div className="p-10 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20 mb-6">
                        <Sparkles className="text-[#B76E79] w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Smart-ATS</h2>
                    <p className="text-slate-500 font-medium text-sm">Le recrutement d'élite par intelligence artificielle.</p>
                </div>
                
                <div className="px-10 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Adresse Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-300" />
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    className="block w-full pl-12 pr-4 py-4 border-2 border-slate-50 rounded-2xl focus:ring-0 focus:border-[#B76E79] bg-white text-slate-900 transition-colors font-medium outline-none" 
                                    placeholder="vous@entreprise.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Mot de passe</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-300" />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    className="block w-full pl-12 pr-4 py-4 border-2 border-slate-50 rounded-2xl focus:ring-0 focus:border-[#B76E79] bg-white text-slate-900 transition-colors font-medium outline-none" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-lg shadow-[#B76E79]/20 font-bold text-white bg-[#B76E79] hover:bg-[#a05e68] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            ) : (
                                <LogIn className="mr-2 h-5 w-5" />
                            )}
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500 font-medium">
                            Nouveau sur la plateforme ?{' '}
                            <Link to="/register" className="font-bold text-[#B76E79] hover:underline">
                                Créer un compte candidat
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

