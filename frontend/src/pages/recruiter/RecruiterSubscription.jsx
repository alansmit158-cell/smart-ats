import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket, 
  ShieldCheck, 
  Loader2, 
  Calendar,
  AlertCircle,
  X,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import API from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const RecruiterSubscription = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const [plans, setPlans] = useState([]);
    const [myPlan, setMyPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const fetchData = async () => {
        try {
            const [plansRes, usageRes] = await Promise.all([
                API.get(`/abonnements/plans`),
                API.get(`/abonnements/usage`)
            ]);

            setPlans(plansRes.data.data);
            setMyPlan(usageRes.data.data);
        } catch (error) {
            console.error("Error fetching subscription data:", error);
            toast.error("Impossible de charger les abonnements.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubscribe = async (planType) => {
        setSubmitting(true);
        try {
            const res = await API.post(`/abonnements/subscribe`, { planType });
            if (res.data.success) {
                toast.success(t('subscription.upgrade_success'), {
                    icon: '🚀',
                    style: { borderRadius: '20px', background: '#1e293b', color: '#fff' }
                });
                await fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de l'abonnement");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelSubscription = async () => {
        setSubmitting(true);
        try {
            const res = await API.patch(`/abonnements/cancel`);
            if (res.data.success) {
                toast.success(t('subscription.cancel_success'), {
                    icon: '✅',
                    style: { borderRadius: '20px', background: '#1e293b', color: '#fff' }
                });
                setShowCancelModal(false);
                await fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la résiliation");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
                <p className="text-slate-400 font-medium italic">{t('candidate_profile.loading')}</p>
            </div>
        );
    }

    const isActive = myPlan && myPlan.status === 'active';
    const isFreeTrial = !myPlan || myPlan.plan === 'Free Trial';

    return (
        <div className="space-y-12 pb-20 text-white" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header Section */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight"
                >
                    {t('subscription.title')}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 font-medium leading-relaxed"
                >
                    {t('subscription.subtitle')}
                </motion.p>
            </div>

            {/* My Current Plan Info */}
            {myPlan && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-40 h-40 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl`}></div>
                    
                    <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 relative z-10">
                        {/* Plan Badge and Name */}
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-2xl shadow-blue-500/10 shrink-0">
                                <ShieldCheck size={32} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('subscription.current_plan')}</p>
                                <h2 className="text-2xl font-bold text-white tracking-tight">
                                    {isFreeTrial ? t('subscription.trial_notice') : myPlan.plan}
                                </h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                        isActive 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {isActive ? t('subscription.active_label') : t('subscription.inactive_label')}
                                    </span>
                                    {isActive && myPlan.dateFin && (
                                        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                            <Calendar size={12} />
                                            {t('subscription.days_remaining', { count: myPlan.daysRemaining })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Usage Metrics */}
                        <div className="flex flex-col md:flex-row items-center gap-8 flex-1 justify-end">
                            {/* Jobs quota */}
                            <div className="space-y-2 w-full md:w-48">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-semibold">{t('subscription.jobs_used')}</span>
                                    <span className="text-white font-bold">
                                        {myPlan.jobsCreated} / {myPlan.jobLimit === 9999 ? '∞' : myPlan.jobLimit}
                                    </span>
                                </div>
                                <div className="h-2 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" 
                                        style={{ width: `${myPlan.percentJobs}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Analyses quota */}
                            <div className="space-y-2 w-full md:w-48">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-semibold">{t('subscription.analyses_used')}</span>
                                    <span className="text-white font-bold">
                                        {myPlan.analysesUtilisees} / {myPlan.limiteAnalyses === 99999 ? '∞' : myPlan.limiteAnalyses}
                                    </span>
                                </div>
                                <div className="h-2 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                                        style={{ width: `${myPlan.percentAnalyses}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Cancel Button */}
                            {isActive && !isFreeTrial && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="px-4 py-2 border border-red-500/20 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/15 rounded-xl text-red-400 text-xs font-bold transition-all duration-300 uppercase tracking-widest cursor-pointer mt-2 md:mt-0 shrink-0 self-center md:self-auto"
                                >
                                    {t('subscription.cancel_plan')}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 items-stretch">
                {plans.map((plan, i) => {
                    const isCurrent = myPlan?.plan === plan.type && isActive;
                    const isPremium = plan.type === 'Premium';
                    
                    return (
                        <motion.div 
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border relative flex flex-col justify-between h-full transition-all duration-500 ${
                                isPremium 
                                    ? 'border-blue-500/30 bg-white/[0.08] shadow-2xl scale-[1.03] z-10' 
                                    : 'border-white/5 hover:border-white/10 hover:bg-white/[0.06] shadow-xl'
                            } ${isCurrent ? 'ring-2 ring-emerald-500/30' : ''}`}
                        >
                            {isPremium && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                    {t('subscription.popular')}
                                </div>
                            )}

                            {isCurrent && (
                                <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} text-emerald-400 flex items-center gap-1.5`}>
                                    <ShieldCheck size={20} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                        {t('subscription.current_plan')}
                                    </span>
                                </div>
                            )}

                            <div>
                                <div className="mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${
                                        plan.type === 'Basic' ? 'bg-slate-900 border-white/5 text-slate-400' :
                                        plan.type === 'Premium' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                        'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                    }`}>
                                        {plan.type === 'Basic' ? <Rocket size={24} /> : 
                                         plan.type === 'Premium' ? <Zap size={24} /> : <Crown size={24} />}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{plan.type}</h3>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-4xl font-extrabold text-white tracking-tight">{plan.prix}€</span>
                                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                            {t('subscription.month')}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                                                isPremium 
                                                    ? 'bg-blue-500/15 border-blue-500/20 text-blue-400' 
                                                    : 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400'
                                            }`}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={() => handleSubscribe(plan.type)}
                                disabled={isCurrent || submitting}
                                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                                    isCurrent 
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default' 
                                        : isPremium 
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]' 
                                        : 'bg-white/10 hover:bg-white/15 text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-white/5'
                                } disabled:opacity-50`}
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 
                                 isCurrent ? t('subscription.current_plan') : `${t('subscription.choose')} ${plan.type}`}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Trial Notice Footer banner */}
            {isFreeTrial && (
                <div className="max-w-xl mx-auto flex items-center gap-6 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                    <div className="shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 border border-white/10 shadow-inner">
                        <AlertCircle size={24} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        {t('subscription.trial_notice')}
                    </p>
                </div>
            )}

            {/* Cancel Subscription Confirmation Modal */}
            <AnimatePresence>
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCancelModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        ></motion.div>

                        {/* Modal Content */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-white/10 max-w-md w-full p-8 rounded-[2rem] shadow-2xl relative z-10 space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                    <AlertCircle className="text-red-400" size={24} />
                                    {t('subscription.cancel_plan')}
                                </h3>
                                <button 
                                    onClick={() => setShowCancelModal(false)}
                                    className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-sm text-slate-300 leading-relaxed">
                                {t('subscription.cancel_confirm')}
                            </p>

                            <div className="flex items-center gap-4 justify-end">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border border-white/5 transition-colors"
                                >
                                    {t('subscription.close')}
                                </button>
                                <button
                                    onClick={handleCancelSubscription}
                                    disabled={submitting}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-red-600/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                                >
                                    {submitting ? <Loader2 size={14} className="animate-spin" /> : t('subscription.confirm')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecruiterSubscription;
