import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, LogIn, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await login(email, password);
            toast.success(t('login.success'), { icon: '✨' });
            
            if (data.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else if (data.role === 'admin') {
                navigate('/admin/stats');
            } else {
                navigate('/candidate/portal');
            }
        } catch (err) {
            toast.error(err || t('login.error_default'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <Toaster position="top-right" />
            
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-rose-500/5 blur-[100px]" />

            {/* Language Selector — top right corner */}
            <div className="absolute top-6 right-6 z-50">
                <LanguageSelector variant="dark" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full bg-white/5 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-black overflow-hidden border border-white/10"
            >
                <div className="p-10 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
                        <Sparkles className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Smart<span className="text-rose-400">-ATS</span></h2>
                    <p className="text-slate-400 font-medium text-sm italic">{t('login.subtitle')}</p>
                </div>
                
                <div className="px-10 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">
                                {t('login.email_label')}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    autoComplete="email"
                                    className="block w-full pl-12 pr-4 py-4 border border-white/5 rounded-2xl focus:ring-0 focus:border-blue-500/50 bg-white/5 text-white transition-all font-medium outline-none placeholder-slate-600 shadow-inner" 
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">
                                {t('login.password_label')}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    autoComplete="current-password"
                                    className="block w-full pl-12 pr-4 py-4 border border-white/5 rounded-2xl focus:ring-0 focus:border-blue-500/50 bg-white/5 text-white transition-all font-medium outline-none placeholder-slate-600 shadow-inner" 
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
                            className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl shadow-blue-600/20 font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            ) : (
                                <LogIn className="mr-2 h-5 w-5" />
                            )}
                            {isLoading ? t('login.btn_loading') : t('login.btn_submit')}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-sm text-slate-400 font-medium">
                            {t('login.new_to_platform')}{' '}
                            <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                {t('login.create_account')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
