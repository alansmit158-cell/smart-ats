import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  Target, 
  Zap, 
  ShieldCheck, 
  Cpu,
  Globe,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 font-sans flex flex-col relative overflow-hidden">
      {/* Dynamic Glow Cursor Follower */}
      <div 
        className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-500 opacity-60"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.15), rgba(79, 70, 229, 0.05), transparent 70%)`
        }}
      />

      {/* Technical Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating Orbs - Passive Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
            animate={{ 
                x: [0, 100, -50, 0], 
                y: [0, -100, 150, 0],
                scale: [1, 1.2, 0.8, 1] 
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" 
        />
        <motion.div 
            animate={{ 
                x: [0, -150, 100, 0], 
                y: [0, 200, -100, 0],
                scale: [1, 0.9, 1.3, 1] 
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" 
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-10 py-8 max-w-7xl mx-auto w-full">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
        >
          <div className="bg-white/5 p-3 rounded-2xl backdrop-blur-2xl border border-white/10 shadow-2xl group hover:border-blue-500/50 transition-all">
            <Cpu className="w-8 h-8 text-blue-400 group-hover:rotate-90 transition-transform duration-700" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">SMART<span className="text-blue-500 italic">.ATS</span></span>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-8"
        >
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
             <a href="#" className="hover:text-blue-400 transition-colors">{t('landing.nav_neural')}</a>
             <a href="#" className="hover:text-blue-400 transition-colors">{t('landing.nav_sync')}</a>
             <a href="#" className="hover:text-blue-400 transition-colors">{t('landing.nav_security')}</a>
          </div>
          <div className="flex items-center gap-4">
              {/* Language selector directly in navbar */}
              <LanguageSelector variant="dark" />
              <button 
                onClick={() => navigate('/login')}
                className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                {t('landing.nav_access')}
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="text-[11px] font-black bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] flex items-center gap-3 uppercase tracking-[0.2em] active:scale-95"
              >
                {t('landing.nav_initialize')} <ChevronRight size={16} />
              </button>
          </div>
        </motion.div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-6xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-2xl backdrop-blur-md"
        >
          <Zap size={14} className="animate-pulse" />
          <span>{t('landing.badge')}</span>
        </motion.div>
        
        <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold text-white mb-10 tracking-tight leading-[0.9]"
        >
          {t('landing.hero_line1')} <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 italic">{t('landing.hero_line2')}</span>
        </motion.h1>
        
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-3xl mb-14 leading-relaxed font-medium italic"
        >
          {t('landing.hero_desc')}
        </motion.p>
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
        >
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_70px_rgba(255,255,255,0.4)] transform hover:-translate-y-2 active:scale-90"
          >
            {t('landing.terminal')}
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] backdrop-blur-3xl border border-white/10 transition-all flex items-center justify-center gap-4 active:scale-90"
          >
            {t('landing.create_profile')}
          </button>
        </motion.div>

        {/* Global Stats Mock */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-12 w-full max-w-4xl"
        >
            {[
                { label: t('landing.stat_syncs'), val: '+1.2M' },
                { label: t('landing.stat_specs'), val: '450k' },
                { label: t('landing.stat_precision'), val: '98.4%' },
                { label: t('landing.stat_uptime'), val: '99.9%' },
            ].map((s, i) => (
                <div key={i} className="text-center">
                    <p className="text-2xl font-bold text-white tracking-tighter mb-1">{s.val}</p>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{s.label}</p>
                </div>
            ))}
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-10 py-24 grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-24">
        {[
            {
                title: t('landing.feature1_title'),
                desc: t('landing.feature1_desc'),
                icon: <FileText className="text-blue-400" />,
                color: 'blue'
            },
            {
                title: t('landing.feature2_title'),
                desc: t('landing.feature2_desc'),
                icon: <Target className="text-indigo-400" />,
                color: 'indigo'
            },
            {
                title: t('landing.feature3_title'),
                desc: t('landing.feature3_desc'),
                icon: <BrainCircuit className="text-blue-500" />,
                color: 'blue'
            }
        ].map((f, i) => (
            <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className="p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all shadow-2xl backdrop-blur-3xl relative overflow-hidden group"
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
                    {f.desc}
                </p>
            </motion.div>
        ))}
      </section>

      {/* Trust Bar */}
      <div className="relative z-10 w-full border-t border-white/5 py-12 bg-white/[0.02] backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-10 flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
             <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><Globe size={24}/> GLOBAL TECH</div>
             <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><ShieldCheck size={24}/> SECURE CORP</div>
             <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><Zap size={24}/> FAST FLOW</div>
             <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><Lock size={24}/> PRIVACY FIRST</div>
          </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 text-center bg-slate-950">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
            {t('landing.footer')}
        </p>
      </footer>
    </div>
  );
}
