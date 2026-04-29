import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket, 
  ShieldCheck, 
  Loader2, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const RecruiterSubscription = () => {
    const [plans, setPlans] = useState([]);
    const [myPlan, setMyPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [plansRes, myPlanRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/abonnements/plans'),
                    axios.get('http://localhost:5000/api/abonnements/my-plan', config)
                ]);

                setPlans(plansRes.data.data);
                setMyPlan(myPlanRes.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching subscription data:", error);
                toast.error("Impossible de charger les abonnements.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubscribe = async (planType) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const res = await axios.post('http://localhost:5000/api/abonnements/subscribe', { planType }, config);
            
            if (res.data.success) {
                setMyPlan(res.data.data);
                toast.success(res.data.message, {
                    icon: '🚀',
                    style: { borderRadius: '20px', background: '#333', color: '#fff' }
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de l'abonnement");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="text-[#B76E79] animate-spin" />
                <p className="text-slate-400 font-medium italic">Accès au coffre-fort des offres...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight">Boostez votre <span className="text-[#B76E79]">Recrutement.</span></h1>
                <p className="text-slate-500 font-medium leading-relaxed">Choisissez le plan adapté à la croissance de votre entreprise et débloquez la puissance de l'IA Smart-ATS.</p>
            </div>

            {/* My Current Plan Info */}
            {myPlan && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto bg-white p-8 rounded-[3rem] border border-[#B76E79]/20 shadow-xl shadow-[#B76E79]/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#B76E79]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="flex items-center gap-6 relative">
                        <div className="w-16 h-16 bg-[#B76E79] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#B76E79]/30">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#B76E79] uppercase tracking-widest mb-1">Votre Plan Actuel</p>
                            <h2 className="text-2xl font-serif font-bold text-slate-900">{myPlan.type} Professional</h2>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 text-center md:text-left">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100">Actif</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiration</p>
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-2"><Calendar size={12} /> {new Date(myPlan.dateFin).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consommation</p>
                        <div className="w-40 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div className="h-full bg-[#B76E79] w-[40%] rounded-full"></div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500">4 / {myPlan.limiteOffres === 9999 ? '∞' : myPlan.limiteOffres} offres utilisées</p>
                    </div>
                </motion.div>
            )}

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                {plans.map((plan, i) => {
                    const isCurrent = myPlan?.type === plan.type;
                    const isPremium = plan.type === 'Pro';
                    
                    return (
                        <motion.div 
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-white p-10 rounded-[3rem] border relative flex flex-col h-full transition-all duration-500 ${
                                isPremium ? 'border-[#B76E79] shadow-2xl shadow-[#B76E79]/10 scale-105 z-10' : 'border-slate-50 shadow-xl shadow-slate-100'
                            } ${isCurrent ? 'ring-4 ring-emerald-500/10' : ''}`}
                        >
                            {isPremium && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#B76E79] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Plus Populaire</div>
                            )}

                            {isCurrent && (
                                <div className="absolute top-6 right-6 text-emerald-500"><ShieldCheck size={24} /></div>
                            )}

                            <div className="mb-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                                    plan.type === 'Starter' ? 'bg-slate-50 text-slate-400' :
                                    plan.type === 'Pro' ? 'bg-[#B76E79]/10 text-[#B76E79]' :
                                    'bg-slate-900 text-amber-400'
                                }`}>
                                    {plan.type === 'Starter' ? <Rocket size={24} /> : 
                                     plan.type === 'Pro' ? <Zap size={24} /> : <Crown size={24} />}
                                </div>
                                <h3 className="text-2xl font-serif font-black text-slate-900 mb-2">{plan.type}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-serif font-black text-slate-900">{plan.prix}€</span>
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">/ mois</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isPremium ? 'bg-[#B76E79]/10 text-[#B76E79]' : 'bg-emerald-50 text-emerald-500'}`}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => handleSubscribe(plan.type)}
                                disabled={isCurrent || submitting}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                                    isCurrent ? 'bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100' :
                                    isPremium ? 'bg-[#B76E79] text-white shadow-xl shadow-[#B76E79]/30 hover:scale-105 active:scale-95' :
                                    'bg-slate-900 text-white shadow-xl shadow-slate-200 hover:scale-105 active:scale-95'
                                } disabled:opacity-50`}
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 
                                 isCurrent ? 'Plan Actuel' : `Choisir ${plan.type}`}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Satisfaction Guarantee */}
            <div className="max-w-xl mx-auto flex items-center gap-6 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                    <AlertCircle size={24} />
                </div>
                <p className="text-xs text-slate-500 font-medium italic">
                    "Tous nos plans incluent une période d'essai de 14 jours. Les limites sont réinitialisées mensuellement à la date anniversaire de votre abonnement."
                </p>
            </div>
        </div>
    );
};

export default RecruiterSubscription;
