import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Sparkles, 
  MoreVertical, 
  Circle,
  ChevronLeft,
  User,
  Clock,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const RecruiterMessages = () => {
    const [candidates, setCandidates] = useState([
        { id: '1', nom: 'Sarah Bellamine', role: 'UI/UX Designer', avatar: null, unread: 2, status: 'online', match: 94 },
        { id: '2', nom: 'Hamza Karoui', role: 'Frontend React', avatar: null, unread: 0, status: 'offline', match: 88 },
        { id: '3', nom: 'Inès Trabelsi', role: 'Product Manager', avatar: null, unread: 5, status: 'online', match: 76 },
        { id: '4', nom: 'Mehdi Ben Salem', role: 'Fullstack Dev', avatar: null, unread: 0, status: 'offline', match: 91 },
    ]);
    
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTypingAI, setIsTypingAI] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTypingAI]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            sender: 'recruiter',
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        setMessages([...messages, msg]);
        setNewMessage('');
        
        // Simuler une réponse après 1s
        setTimeout(() => {
            const reply = {
                id: Date.now() + 1,
                sender: 'candidate',
                content: "Merci pour votre message ! Je reste à votre disposition pour un entretien.",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    const handleAISuggest = () => {
        setIsTypingAI(true);
        // Simulation d'une suggestion IA
        setTimeout(() => {
            const suggestions = [
                "Bonjour " + (selectedCandidate?.nom.split(' ')[0] || "Candidat") + ", votre profil a retenu toute notre attention. Seriez-vous disponible pour un court échange téléphonique demain ?",
                "Félicitations ! Nous souhaitons faire progresser votre candidature vers l'étape suivante de notre processus de recrutement.",
                "Merci pour l'envoi de votre portfolio. La qualité de vos réalisations est impressionnante."
            ];
            const randomSuggest = suggestions[Math.floor(Math.random() * suggestions.length)];
            setNewMessage(randomSuggest);
            setIsTypingAI(false);
            toast.success('Suggestion IA générée', {
                icon: '✨',
                style: {
                    borderRadius: '20px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }, 1200);
    };

    return (
        <div className="h-[calc(100vh-180px)] flex flex-col md:flex-row bg-white rounded-[3rem] border border-slate-50 shadow-2xl overflow-hidden">
            
            {/* Sidebar: Liste des Candidats */}
            <div className={`w-full md:w-96 border-r border-slate-50 flex flex-col ${selectedCandidate ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-8 border-b border-slate-50">
                    <h2 className="text-2xl font-serif font-black text-slate-900 mb-6 tracking-tight">Conversations</h2>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#B76E79] transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Rechercher un talent..." 
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#B76E79]/10 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {candidates.map((candidate) => (
                        <div 
                            key={candidate.id}
                            onClick={() => setSelectedCandidate(candidate)}
                            className={`p-6 flex items-center gap-4 cursor-pointer transition-all border-l-4 ${
                                selectedCandidate?.id === candidate.id 
                                ? 'bg-[#B76E79]/5 border-[#B76E79]' 
                                : 'border-transparent hover:bg-slate-50'
                            }`}
                        >
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                    <User className="text-slate-400" size={24} />
                                </div>
                                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${candidate.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-slate-800 truncate text-sm">{candidate.nom}</h3>
                                    <span className="text-[10px] text-slate-400 font-medium">14:20</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate font-medium">{candidate.role}</p>
                            </div>
                            {candidate.unread > 0 && (
                                <div className="w-5 h-5 bg-[#B76E79] rounded-full flex items-center justify-center shadow-lg shadow-[#B76E79]/30">
                                    <span className="text-[10px] font-black text-white">{candidate.unread}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-[#FDFCF0]/30 ${!selectedCandidate ? 'hidden md:flex' : 'flex'}`}>
                {selectedCandidate ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-slate-50 bg-white/80 backdrop-blur-md flex items-center justify-between z-10 shadow-sm">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedCandidate(null)} className="md:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#B76E79] border border-slate-100">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm">{selectedCandidate.nom}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${selectedCandidate.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {selectedCandidate.status === 'online' ? 'En ligne' : 'Hors ligne'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:flex flex-col items-end mr-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">Score IA</span>
                                    <span className="text-lg font-serif font-black text-slate-900 leading-none">{selectedCandidate.match}%</span>
                                </div>
                                <button className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-slate-900"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            <div className="flex justify-center mb-8">
                                <span className="bg-white px-4 py-2 rounded-full border border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">Début de la conversation</span>
                            </div>

                            {messages.map((msg) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={msg.id} 
                                    className={`flex ${msg.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-5 rounded-[2rem] shadow-sm relative group ${
                                        msg.sender === 'recruiter' 
                                        ? 'bg-[#B76E79] text-white rounded-tr-none shadow-[#B76E79]/20' 
                                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-50'
                                    }`}>
                                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                        <div className={`flex items-center gap-2 mt-2 ${msg.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
                                            <Clock size={10} className="opacity-40" />
                                            <span className={`text-[9px] font-black uppercase tracking-tighter opacity-40`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {isTypingAI && (
                                <div className="flex justify-end">
                                    <div className="bg-slate-900/5 backdrop-blur-md p-5 rounded-[2rem] rounded-tr-none border border-slate-100 flex items-center gap-3">
                                        <Loader2 size={16} className="animate-spin text-[#B76E79]" />
                                        <span className="text-xs font-black text-[#B76E79] uppercase tracking-widest animate-pulse">L'IA rédige une réponse...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-8 bg-white/50 backdrop-blur-xl border-t border-slate-50">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                                <button 
                                    type="button"
                                    onClick={handleAISuggest}
                                    className="shrink-0 w-14 h-14 bg-slate-900 text-[#B76E79] rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 group relative"
                                    title="AI Suggest"
                                >
                                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">AI Suggest</span>
                                </button>
                                
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Écrivez votre message..." 
                                        className="w-full bg-white border-2 border-slate-50 rounded-[2rem] py-4 px-8 text-sm font-medium focus:ring-0 focus:border-[#B76E79]/20 outline-none transition-all shadow-inner"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="shrink-0 w-14 h-14 bg-[#B76E79] text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#B76E79]/20 disabled:opacity-50 disabled:grayscale"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                            <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 mt-4">Communication chiffrée de bout en bout • Smart-ATS Protect</p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center text-[#B76E79] shadow-2xl mb-8 relative">
                            <MessageSquare className="w-12 h-12" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#B76E79] rounded-2xl flex items-center justify-center text-white text-xs font-bold animate-bounce">!</div>
                        </div>
                        <h2 className="text-3xl font-serif font-black text-slate-900 mb-4">Votre centre de messagerie</h2>
                        <p className="text-slate-400 max-w-md text-sm font-medium italic">Sélectionnez un talent pour initier une conversation stratégique. Utilisez l'IA pour optimiser vos échanges.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterMessages;
